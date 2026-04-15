import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { CloudAlert, History, ImageUp, Minimize2 } from 'lucide-react'

// ─── Constants & pure helpers (outside component — never recreated) ───────────

const SIDEBAR_KEY = 'verifix_scan_sidebar_open'


const barColorForStatus = (status) => {
    const s = String(status || '').toUpperCase()
    if (s.includes('AUTH')) return 'var(--success)'
    if (s.includes('MANIP')) return 'var(--danger)'
    if (s.includes('SUSP') || s.includes('INCON')) return 'var(--warning)'
    return 'var(--primary)'
}

const verdictColorClass = (verdict) => {
    if (verdict === 'AUTHENTIC') return 'text-(--success)'
    if (verdict === 'MANIPULATED') return 'text-(--danger)'
    if (verdict === 'SUSPICIOUS' || verdict === 'INCONCLUSIVE') return 'text-(--warning)'
    return 'text-(--white)'
}

const truncateTitle = (title, maxWords = 5) => {
    const words = (title || 'Untitled scan').split(' ')
    return words.length > maxWords ? `${words.slice(0, maxWords).join(' ')}...` : words.join(' ')
}

// ─── Component ────────────────────────────────────────────────────────────────

const Scan = () => {
    const { isAuthenticated, ready } = useAuth()
    const [title, setTitle] = useState('')
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [error, setError] = useState('')
    const [result, setResult] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [history, setHistory] = useState([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        try { return localStorage.getItem(SIDEBAR_KEY) !== 'false' }
        catch { return true }
    })

    const navigate = useNavigate()
    const inputRef = useRef(null)
    const canSubmit = !!file && !isSubmitting

    const toggleSidebar = () => {
        setSidebarOpen((o) => {
            const next = !o
            try { localStorage.setItem(SIDEBAR_KEY, String(next)) } catch { /* ignore */ }
            return next
        })
    }

    const onPickFile = (picked) => {
        setError('')
        setResult(null)
        if (!picked) return
        if (!picked.type?.startsWith('image/')) { setError('Please upload an image file.'); return }
        if (picked.size > 10 * 1024 * 1024) { setError('Image must be under 10 MB.'); return }
        setFile(picked)
        setPreviewUrl(URL.createObjectURL(picked))
    }

    const loadHistory = useCallback(async () => {
        if (!isAuthenticated) return
        setHistoryLoading(true)
        try {
            const res = await api.get('/history', { params: { page: 1, limit: 12 } })
            setHistory(res.data?.data ?? [])
        } catch {
            setHistory([])
        } finally {
            setHistoryLoading(false)
        }
    }, [isAuthenticated])

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setResult(null)
        if (!file) { setError('Please choose an image.'); return }

        setIsSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('image', file)
            if (title.trim()) fd.append('title', title.trim())

            const endpoint = isAuthenticated ? '/scan/image' : '/scan/guest/image'
            const res = await api.post(endpoint, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
            setResult(res.data)
            if (isAuthenticated) loadHistory()
        } catch (err) {
            const status = err?.response?.status
            if (status === 401) { navigate('/signin', { replace: true }); return }
            if (status === 403) { setError(err?.response?.data?.message ?? 'Test scan used. Sign in or sign up to continue.'); return }
            setError(err?.response?.data?.message ?? 'Scan failed. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated) loadHistory()
        else setHistory([])
    }, [isAuthenticated, loadHistory])

    const modelChartData = useMemo(() => {
        const models = result?.models
        if (!Array.isArray(models)) return []

        const counts = {}
        return models
            .map((m) => {
                const label = m?.display_name || m?.name || 'Model'
                const score = typeof m?.confidence_percent === 'number'
                    ? Math.max(0, Math.min(100, m.confidence_percent))
                    : 0
                const short = label.length > 22 ? `${label.slice(0, 20)}…` : label
                return { name: short, fullName: label, score, status: m?.status ?? '' }
            })
            .sort((a, b) => a.score - b.score)
            .map((row) => {
                counts[row.name] = (counts[row.name] || 0) + 1
                const n = counts[row.name]
                return { ...row, name: n === 1 ? row.name : `${row.name} · ${n}` }
            })
    }, [result])

    // Consolidated drag handlers — all share the same base behaviour
    const stopDrag = (e) => { e.preventDefault(); e.stopPropagation() }
    const onDragIn = (e) => { stopDrag(e); setDragActive(true) }
    const onDragOut = (e) => { stopDrag(e); setDragActive(false) }
    const onDropFile = (e) => {
        stopDrag(e)
        setDragActive(false)
        const f = e.dataTransfer?.files?.[0]
        if (f) onPickFile(f)
    }

    const mainColSpan = isAuthenticated && sidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'

    return (
        <div className="min-h-screen liquid-bg bg-(--black) text-(--white)">
            <Navbar />

            <div className="mx-auto max-w-6xl px-5 sm:px-6 pt-24 pb-12">
                {/* Guest mode strip */}
                {ready && !isAuthenticated && (
                    <div className="mb-6 rounded-2xl border border-(--primary)/50 bg-(--primary)/15 px-4 py-3 text-sm text-(--gray) text-center">
                        <span className="text-(--white) font-semibold">Guest mode:</span> includes one free scan.{' '}
                        <Link to="/signup" className="text-(--primary) underline font-medium">
                            Create an account
                        </Link>{' '}
                        to unlock more scans, history, and your dashboard.
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Sidebar */}
                    {isAuthenticated && sidebarOpen && (
                        <aside className="lg:col-span-3">
                            <div className="glass rounded-2xl p-4 sm:p-5 lg:sticky lg:top-24">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-(--white)">Your scans</div>
                                        <div className="text-xs text-(--gray)">Quick access</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={toggleSidebar}
                                        className="text-xs text-(--gray) hover:text-(--white) transition-all cursor-pointer"
                                        title="Hide History"
                                    >
                                        <Minimize2 className="w-5" />
                                    </button>
                                </div>

                                <div className="history-sidebar mt-4 space-y-2 max-h-140 overflow-auto pr-1">
                                    {historyLoading ? (
                                        <div className="text-sm text-(--gray)">Loading…</div>
                                    ) : history.length ? (
                                        history.map((h) => (
                                            <Link
                                                key={h.scanId}
                                                to={`/history/${h.scanId}`}
                                                className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-(--white)/5 transition"
                                            >
                                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-(--white)/15 bg-(--black) ring-1 ring-(--white)/10">
                                                    {h.thumbnail && (
                                                        <img
                                                            alt={h.title || 'Scan thumbnail'}
                                                            className="h-full w-full object-cover"
                                                            src={`data:image/jpeg;base64,${h.thumbnail}`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate text-sm font-medium text-(--white)">
                                                        {truncateTitle(h.title)}
                                                    </div>
                                                    <div className="truncate text-xs text-(--white)/75">
                                                        <span className="text-(--gray)">{h.verdict}</span> · {h.confidencePercent ?? '—'}%
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-sm text-(--gray)">No history yet. Run your first scan.</div>
                                    )}
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* Main column */}
                    <div className={mainColSpan}>
                        {isAuthenticated && !sidebarOpen && (
                            <div className="mb-4 flex justify-start">
                                <button
                                    type="button"
                                    onClick={toggleSidebar}
                                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-(--gray) hover:text-(--white) text-sm font-semibold glass"
                                >
                                    <History className="w-5" /> Show history
                                </button>
                            </div>
                        )}

                        {/* Upload + Preview */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="glass rounded-2xl p-5 sm:p-6">
                                <div className="flex flex-col items-start justify-between">
                                    <h1 className="text-2xl sm:text-3xl font-black">
                                        Scan with Verifi<span className="logo">X</span>
                                    </h1>
                                    <p className="mt-2 text-(--gray)">
                                        Upload or drag an image to detect deepfakes and verify authenticity. Results and insights appear instantly below.
                                    </p>
                                </div>

                                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                                    {error && (
                                        <div className="rounded-lg flex gap-2 items-center p-3 border border-(--danger)/35 bg-(--danger)/10 text-(--danger) text-sm">
                                            <CloudAlert /> {error}
                                        </div>
                                    )}

                                    {isAuthenticated && (
                                        <div className="space-y-2">
                                            <label title="Title Optional" className="text-sm text-(--gray)">Title</label>
                                            <input
                                                className="glass w-full p-2 rounded-lg"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="e.g., Celebrity photo from social media"
                                                maxLength={60}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm text-(--gray)">Image</label>
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onDragEnter={onDragIn}
                                            onDragLeave={onDragOut}
                                            onDragOver={stopDrag}
                                            onDrop={onDropFile}
                                            className={`glass rounded-lg border-2 border-dashed p-3 transition ${dragActive ? 'border-(--primary)/70 bg-(--primary)/10' : 'border-(--white)/15'
                                                }`}
                                        >
                                            <div
                                                onClick={() => inputRef.current?.click()}
                                                className="relative overflow-auto text-center flex flex-col justify-center items-center w-full h-full border border-dashed rounded-lg p-5 text-md text-(--gray)"
                                            >
                                                <ImageUp className="w-15 h-15 text-(--gray)" />
                                                <span className="text-(--white) font-semibold">Drag & Drop</span>
                                                <input
                                                    type="file"
                                                    ref={inputRef}
                                                    accept="image/*"
                                                    onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                                                    className="w-full h-full absolute hidden"
                                                />
                                                an image here, or choose a file
                                                <p className="text-center text-xs text-(--gray)">JPG, PNG, GIF, WebP. Max 10MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!canSubmit}
                                        className="w-full inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold bg-linear-to-t from-(--primary)/80 to-(--secondary)/80 hover:bg-(--primary) transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Analyzing…' : 'Analyze image'}
                                    </button>
                                </form>
                            </div>

                            {/* Preview */}
                            <div className="glass rounded-2xl p-5 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-(--white)">Preview</div>
                                    {file && (
                                        <div className="text-xs text-(--gray)">{Math.round(file.size / 1024)} KB</div>
                                    )}
                                </div>
                                <div className="mt-4 rounded-2xl border border-(--white)/10 overflow-hidden bg-(--black)">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-70 sm:h-110 object-contain" />
                                    ) : (
                                        <div className="h-70 sm:h-110 flex items-center justify-center text-(--gray)">
                                            No image selected
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        {result ? (
                            <div className="mt-8 space-y-6">
                                {/* Chart */}
                                <div className="glass rounded-2xl p-5 sm:p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-(--white)">Multi-Model Scores</div>
                                            <div className="mt-1 text-xs text-(--gray)">
                                                Bars left → right: lowest to highest score (0–100%)
                                            </div>
                                        </div>
                                        <div className="text-xs text-(--gray)">{modelChartData.length} models</div>
                                    </div>

                                    {modelChartData.length ? (
                                        <div className="mt-10 h-[min(420px,55vh)] w-full min-h-70">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={modelChartData}
                                                    margin={{ top: 20, right: 20, left: 0, bottom: 70 }}
                                                    barCategoryGap="12%"
                                                >
                                                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                                                    <XAxis
                                                        dataKey="name"
                                                        type="category"
                                                        tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 10 }}
                                                        axisLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                                        tickLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                                        interval={0}
                                                        angle={-90}
                                                        textAnchor="end"
                                                        height={50}
                                                    />
                                                    <YAxis
                                                        type="number"
                                                        domain={[0, 100]}
                                                        tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 10 }}
                                                        axisLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                                        tickLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                                        label={{
                                                            value: 'Score (%)',
                                                            angle: -90,
                                                            position: 'insideLeft',
                                                            fill: 'rgba(255,255,255,0.45)',
                                                            fontSize: 10,
                                                        }}
                                                    />
                                                    <Tooltip
                                                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                                        content={({ active, payload }) => {
                                                            if (!active || !payload?.length) return null
                                                            const p = payload[0].payload
                                                            const signal = barColorForStatus(p.status)
                                                            const v = Math.max(0, Math.min(100, Number(p.score) || 0))
                                                            return (
                                                                <div
                                                                    className="rounded-xl px-3 py-2.5 shadow-2xl backdrop-blur-md max-w-65"
                                                                    style={{ background: 'rgba(8, 10, 16, 0.90)' }}
                                                                >
                                                                    <div className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: signal }}>
                                                                        Signal
                                                                    </div>
                                                                    <div className="text-sm font-semibold text-(--white) leading-snug">
                                                                        {p.fullName || p.name}
                                                                    </div>
                                                                    <div className="text-2xl font-black tabular-nums mt-1" style={{ color: signal }}>
                                                                        {v}%
                                                                    </div>
                                                                    {p.status && (
                                                                        <div className="text-xs text-(--white)/80 mt-1 border-t border-(--white)/10 pt-1">
                                                                            {p.status}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="score"
                                                        name="Score"
                                                        radius={[8, 8, 0, 0]}
                                                        maxBarSize={56}
                                                        activeBar={(props) => (
                                                            <Rectangle
                                                                {...props}
                                                                stroke={barColorForStatus(props?.payload?.status)}
                                                                strokeWidth={2}
                                                                fillOpacity={0.88}
                                                            />
                                                        )}
                                                        shape={({ x, y, width, height, payload }) => (
                                                            <Rectangle
                                                                x={x} y={y} width={width} height={height}
                                                                fill={barColorForStatus(payload?.status)}
                                                                radius={[8, 8, 0, 0]}
                                                            />
                                                        )}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-sm text-(--gray)">No per-model breakdown for this result.</p>
                                    )}
                                </div>

                                {/* Result detail */}
                                <div className="glass rounded-2xl p-5 sm:p-6">
                                    <div className="text-sm font-semibold text-(--white)">Result</div>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className={`text-lg font-black tracking-tight ${verdictColorClass(result.verdict)}`}>
                                                {result.verdict}
                                            </div>
                                            <div className="glass rounded-full px-3 py-1 text-xs text-(--gray)">
                                                Confidence: {result.confidence_percent ?? '—'}%
                                            </div>
                                            <div className="glass rounded-full px-3 py-1 text-xs text-(--gray)">
                                                Source: {result.source ?? '—'}
                                            </div>
                                            {result.guest && (
                                                <span className="glass rounded-full px-3 py-1 text-xs text-(--warning) border border-(--warning)/40">
                                                    Guest scan
                                                </span>
                                            )}
                                        </div>

                                        {result.report?.summary && (
                                            <div className="glass rounded-2xl p-4 border border-(--white)/10">
                                                <div className="text-xs font-semibold text-(--gray)">Summary</div>
                                                <div className="mt-1 text-sm text-(--white) leading-relaxed">{result.report.summary}</div>
                                            </div>
                                        )}

                                        {Array.isArray(result.report?.what_this_means) && result.report.what_this_means.length > 0 && (
                                            <div className="glass rounded-2xl p-4 border border-(--white)/10">
                                                <div className="text-xs font-semibold text-(--gray)">What this means</div>
                                                <ul className="mt-2 space-y-2 text-sm text-(--white)">
                                                    {result.report.what_this_means.map((item, idx) => (
                                                        <li key={idx} className="text-(--gray) leading-relaxed">{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {result.report?.recommended_action && (
                                            <div className="glass rounded-2xl p-4 border border-(--white)/10">
                                                <div className="text-xs font-semibold text-(--gray)">Recommended action</div>
                                                <div className="mt-1 text-sm text-(--gray) leading-relaxed">
                                                    {result.report.recommended_action}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-8 text-center text-sm text-(--gray)">
                                Run analysis to view detailed insights.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Scan