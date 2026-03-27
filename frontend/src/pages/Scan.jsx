import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import { Expand, ImageUp, Minimize2, PanelLeftOpen, PanelRightClose } from 'lucide-react'

// key for remembering sidebar open state and store it in local storage
const SIDEBAR_KEY = 'verifix_scan_sidebar_open'

const Scan = () => {
    const { user, isAuthenticated } = useAuth()
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
        try {
            return localStorage.getItem(SIDEBAR_KEY) !== 'false'
        } catch {
            return true
        }
    })
    const navigate = useNavigate()

    const canSubmit = useMemo(() => !!file && !isSubmitting, [file, isSubmitting])

    const toggleSidebar = () => {
        setSidebarOpen((o) => {
            const next = !o
            try {
                localStorage.setItem(SIDEBAR_KEY, String(next))
            } catch {
                /* ignore */
            }
            return next
        })
    }

    // pick a file from the file picker dialog and show a preview
    const onPickFile = (picked) => {
        setError('')
        setResult(null)

        if (!picked) return
        if (!picked.type?.startsWith('image/')) {
            setError('Please upload an image file.')
            return
        }
        if (picked.size > 10 * 1024 * 1024) {
            setError('Image must be under 10 MB.')
            return
        }

        setFile(picked)
        const url = URL.createObjectURL(picked)
        setPreviewUrl(url)
    }

    const inputRef = useRef(null);

    // load the user's scan history
    const loadHistory = async () => {
        if (!isAuthenticated) return
        setHistoryLoading(true)
        try {
            const res = await api.get('/history', { params: { page: 1, limit: 12 } })
            setHistory(res.data?.data ?? [])
        } catch (err) {
            if (err?.response?.status === 401) {
                setHistory([])
                return
            }
            setHistory([])
        } finally {
            setHistoryLoading(false)
        }
    }

    // submit the image for analysis
    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setResult(null)

        if (!file) {
            setError('Please choose an image.')
            return
        }

        setIsSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('image', file)
            if (title.trim()) fd.append('title', title.trim())

            const endpoint = isAuthenticated ? '/scan/image' : '/scan/guest/image'
            const res = await api.post(endpoint, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            setResult(res.data)
            if (isAuthenticated) loadHistory()
        } catch (err) {
            const status = err?.response?.status
            if (status === 401) {
                navigate('/signin', { replace: true })
                return
            }
            if (status === 403) {
                setError(
                    err?.response?.data?.message ??
                    'Free trial used. Sign up or sign in to scan more images.'
                )
                return
            }
            const message = err?.response?.data?.message ?? 'Scan failed. Please try again.'
            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    // load the history when the user is authenticated
    useEffect(() => {
        if (isAuthenticated) loadHistory()
        else setHistory([])
    }, [isAuthenticated])

    const verdictColorClass = useMemo(() => {
        const v = result?.verdict
        if (v === 'AUTHENTIC') return 'text-(--success)'
        if (v === 'MANIPULATED') return 'text-(--danger)'
        if (v === 'SUSPICIOUS' || v === 'INCONCLUSIVE') return 'text-(--warning)'
        return 'text-(--white)'
    }, [result])

    // get the display name for a model
    const modelDisplayName = (rawName = '') => {
        const n = String(rawName).trim()
        const k = n.toLowerCase()
        if (!n) return { title: 'Model', subtitle: 'Detector' }

        if (k.includes('gan')) return { title: 'AI-generation artifacts', subtitle: 'GAN fingerprints • ' + n }
        if (k.includes('deepfake') || k.includes('swap') || k.includes('face')) return { title: 'Face manipulation', subtitle: 'Swap/reenactment cues • ' + n }
        if (k.includes('metadata') || k.includes('exif')) return { title: 'Metadata consistency', subtitle: 'EXIF/integrity checks • ' + n }
        if (k.includes('jpeg') || k.includes('compression')) return { title: 'Compression anomalies', subtitle: 'JPEG block artifacts • ' + n }
        if (k.includes('noise') || k.includes('sensor')) return { title: 'Camera fingerprint', subtitle: 'Noise/sensor pattern • ' + n }
        if (k.includes('clip') || k.includes('vision') || k.includes('embedding')) return { title: 'Visual classifier', subtitle: 'Embedding-based detector • ' + n }
        if (k.includes('nsfw') || k.includes('safety')) return { title: 'Safety classifier', subtitle: 'Content safety • ' + n }

        return { title: n, subtitle: 'Detection model' }
    }

    // get the model chart data
    const modelChartData = useMemo(() => {
        const models = result?.models
        if (!Array.isArray(models)) return []
        const rows = models.map((m) => {
            const meta = modelDisplayName(m?.name ?? '')
            const score =
                typeof m?.confidence_percent === 'number'
                    ? Math.max(0, Math.min(100, m.confidence_percent))
                    : 0
            const fullTitle = meta.title
            const short =
                fullTitle.length > 22 ? `${fullTitle.slice(0, 20)}…` : fullTitle
            return {
                rawName: m?.name ?? 'Model',
                ...meta,
                name: short,
                fullName: fullTitle,
                score,
                confidence: score,
                status: m?.status ?? '',
            }
        })
        /* Lowest score left → highest right */
        const sorted = rows.sort((a, b) => a.score - b.score)
        const counts = {}
        return sorted.map((row) => {
            const base = row.name
            counts[base] = (counts[base] || 0) + 1
            const n = counts[base]
            const label = n === 1 ? base : `${base} · ${n}`
            return { ...row, name: label }
        })
    }, [result])

    // get the bar color for a status
    const barColorForStatus = (status) => {
        const s = String(status || '').toUpperCase()
        if (s.includes('AUTH')) return 'var(--success)'
        if (s.includes('MANIP')) return 'var(--danger)'
        if (s.includes('SUSP') || s.includes('INCON')) return 'var(--warning)'
        return 'var(--primary)'
    }

    // drag-and-drop events for file upload
    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragIn = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    const onDragOut = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }

    const onDropFile = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const f = e.dataTransfer?.files?.[0]
        if (f) onPickFile(f)
    }

    // When sidebar is open, main content is 9/12 cols; when closed, it expands to full 12/12
    const mainColSpan = isAuthenticated && sidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'

    return (
        <div className="min-h-screen liquid-bg bg-(--black) text-(--white)">
            <Navbar />

            {/* Guest mode strip */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-12">
                {!isAuthenticated && (
                    <div className="mb-6 rounded-2xl border border-(--primary)/30 bg-(--primary)/10 px-4 py-3 text-sm text-(--gray) text-center">
                        <span className="text-(--white) font-semibold">Guest mode:</span> includes one free scan.{' '}
                        <Link to="/signup" className="text-(--primary) underline font-medium">
                            Create an account
                        </Link>{' '}
                        to unlock more scans, history, and your dashboard.
                    </div>
                )}

                {/* Main content */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {isAuthenticated && sidebarOpen && (
                        // Sidebar for logged-in users
                        <aside className="lg:col-span-3">
                            <div className="glass rounded-2xl p-4 sm:p-5 lg:sticky lg:top-24">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-(--white)">Your scans</div>
                                        <div className="text-xs text-(--gray)">Quick access</div>
                                    </div>
                                    <div className="flex items-center gap-2">

                                        <button
                                            type="button"
                                            onClick={toggleSidebar}
                                            className="text-xs text-(--gray) hover:text-(--white) transition-all cursor-pointer"
                                            title="Hide History"
                                        >
                                            <Minimize2 className='w-5' />
                                        </button>
                                    </div>
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
                                                    {h.thumbnail ? (
                                                        <>
                                                            <img
                                                                alt={h.title || 'Scan thumbnail'}
                                                                className="h-full w-full object-cover"
                                                                src={`data:image/jpeg;base64,${h.thumbnail}`}
                                                            />
                                                            {/* <div className="pointer-events-none absolute inset-0 rounded-full bg-(--black)/30 backdrop-blur-[2px]" /> */}
                                                        </>
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate text-sm font-medium text-(--white)">{h.title || 'Untitled scan'}</div>
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

                    {/* Main column with upload + preview */}
                    <div className={mainColSpan}>
                        {isAuthenticated && !sidebarOpen && (
                            <div className="mb-4 flex justify-start">
                                <button
                                    type="button"
                                    onClick={toggleSidebar}
                                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-(--gray) hover:text-(--white) text-sm font-semibold glass glass-hover"
                                    title="Show History"
                                >
                                    <Expand className='w-5' /> Show history
                                </button>
                            </div>
                        )}

                        {/* Upload + Preview side-by-side */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="glass rounded-2xl p-6 sm:p-8">
                                <div className="flex flex-col items-start justify-between">
                                    {/* <div> */}
                                    <h1 className="text-2xl sm:text-3xl font-black">Scan with Verifi<span className='logo'>X</span></h1>
                                    <p className="mt-2 text-(--gray)">
                                        Upload or drag an image to detect deepfakes and verify authenticity. Results and insights appear instantly below.
                                    </p>
                                    {/* </div> */}
                                </div>

                                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                                    {error ? (
                                        <div className="rounded-lg p-3 border border-(--danger)/35 bg-(--danger)/10 text-(--danger) text-sm">
                                            {error}
                                        </div>
                                    ) : null}

                                    {isAuthenticated && (
                                        <div className="space-y-2">
                                            <label title='Title Optional' className="text-sm text-(--gray)">Title</label>
                                            <input
                                                className="glass w-full p-2 border border-(--gray) rounded-lg "
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
                                            onDragOver={onDrag}
                                            onDrop={onDropFile}
                                            className={`glass rounded-lg border-2 border-dashed p-3 transition ${dragActive
                                                ? 'border-(--primary)/70 bg-(--primary)/10'
                                                : 'border-white/15'
                                                }`}
                                        >
                                            <div
                                                onClick={() => inputRef.current?.click()}
                                                className="relative overflow-auto text-center flex flex-col justify-center items-center w-full h-full border border-dashed rounded-lg p-5 text-sm text-(--gray)">
                                                <ImageUp className='w-20 h-20 text-(--gray)/90' />
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
                                    {file ? (
                                        <div className="text-xs text-(--gray)">{Math.round(file.size / 1024)} KB</div>
                                    ) : null}
                                </div>
                                <div className="mt-4 rounded-2xl border border-(--white)/10 overflow-hidden bg-(--black)">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-70 sm:h-110 object-cover" />
                                    ) : (
                                        <div className="h-70 sm:h-110 flex items-center justify-center text-(--gray)">
                                            No image selected
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* After scan: chart then result — full width, stacked */}
                        {result ? (
                            <div className="mt-8 space-y-6">
                                <div className="glass glass-ring rounded-2xl p-5 sm:p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-(--white)">Model scores</div>
                                            <div className="mt-1 text-xs text-(--gray)">
                                                Bars left → right: lowest to highest score (0–100%)
                                            </div>
                                        </div>
                                        <div className="text-xs text-(--gray)">{modelChartData.length} models</div>
                                    </div>

                                    {modelChartData.length ? (
                                        <div className="mt-4 h-[min(420px,55vh)] w-full min-h-70">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={modelChartData}
                                                    margin={{ top: 12, right: 16, left: 8, bottom: 64 }}
                                                    barCategoryGap="12%"
                                                >
                                                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                                                    <XAxis
                                                        dataKey="name"
                                                        type="category"
                                                        tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 11 }}
                                                        axisLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                                        tickLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                                        interval={0}
                                                        angle={-28}
                                                        textAnchor="end"
                                                        height={70}
                                                    />
                                                    <YAxis
                                                        type="number"
                                                        domain={[0, 100]}
                                                        tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }}
                                                        axisLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                                        tickLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                                        label={{
                                                            value: 'Score (%)',
                                                            angle: -90,
                                                            position: 'insideLeft',
                                                            fill: 'rgba(255,255,255,0.45)',
                                                            fontSize: 11,
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
                                                                    style={{
                                                                        borderWidth: 2,
                                                                        borderStyle: 'solid',
                                                                        borderColor: signal,
                                                                        background: 'rgba(8, 10, 16, 0.96)',
                                                                    }}
                                                                >
                                                                    <div
                                                                        className="text-[10px] uppercase font-bold tracking-wider mb-1"
                                                                        style={{ color: signal }}
                                                                    >
                                                                        Signal
                                                                    </div>
                                                                    <div className="text-sm font-semibold text-(--white) leading-snug">
                                                                        {p.fullName || p.name}
                                                                    </div>
                                                                    <div
                                                                        className="text-2xl font-black tabular-nums mt-1"
                                                                        style={{ color: signal }}
                                                                    >
                                                                        {v}%
                                                                    </div>
                                                                    {p.status ? (
                                                                        <div className="text-xs text-(--white)/80 mt-1 border-t border-(--white)/10 pt-1">
                                                                            {p.status}
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            )
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="score"
                                                        name="Score"
                                                        radius={[8, 8, 0, 0]}
                                                        maxBarSize={56}
                                                        activeBar={(props) => {
                                                            const p = props?.payload
                                                            const stroke = barColorForStatus(p?.status)
                                                            return (
                                                                <Rectangle
                                                                    {...props}
                                                                    stroke={stroke}
                                                                    strokeWidth={2}
                                                                    fillOpacity={0.88}
                                                                />
                                                            )
                                                        }}
                                                        shape={(props) => {
                                                            const { x, y, width, height, payload } = props
                                                            const fill = barColorForStatus(payload?.status)
                                                            return (
                                                                <Rectangle
                                                                    x={x}
                                                                    y={y}
                                                                    width={width}
                                                                    height={height}
                                                                    fill={fill}
                                                                    radius={[8, 8, 0, 0]}
                                                                />
                                                            )
                                                        }}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-sm text-(--gray)">No per-model breakdown for this result.</p>
                                    )}
                                </div>

                                <div className="glass glass-ring rounded-2xl p-5 sm:p-6">
                                    <div className="text-sm font-semibold text-(--white)">Result</div>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className={`text-lg font-black tracking-tight ${verdictColorClass}`}>
                                                {result.verdict}
                                            </div>
                                            <div className="glass rounded-full px-3 py-1 text-xs text-(--gray)">
                                                Confidence: {result.confidence_percent ?? '—'}%
                                            </div>
                                            <div className="glass rounded-full px-3 py-1 text-xs text-(--gray)">
                                                Source: {result.source ?? '—'}
                                            </div>
                                            {result.guest ? (
                                                <span className="glass rounded-full px-3 py-1 text-xs text-(--warning) border border-(--warning)/40">
                                                    Guest scan
                                                </span>
                                            ) : null}
                                        </div>

                                        {result.report?.summary ? (
                                            <div className="glass rounded-2xl p-4 border border-(--white)/10">
                                                <div className="text-xs font-semibold text-(--gray)">Summary</div>
                                                <div className="mt-1 text-sm text-(--white) leading-relaxed">{result.report.summary}</div>
                                            </div>
                                        ) : null}

                                        {Array.isArray(result.report?.what_this_means) && result.report.what_this_means.length ? (
                                            <div className="glass rounded-2xl p-4 border border-(--white)/10">
                                                <div className="text-xs font-semibold text-(--gray)">What this means</div>
                                                <ul className="mt-2 space-y-2 text-sm text-(--white)">
                                                    {result.report.what_this_means.map((item, idx) => (
                                                        <li key={idx} className="text-(--gray) leading-relaxed">
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}

                                        {result.report?.recommended_action ? (
                                            <div className="glass rounded-2xl p-4 border border-(--white)/10">
                                                <div className="text-xs font-semibold text-(--gray)">Recommended action</div>
                                                <div className="mt-1 text-sm text-(--gray) leading-relaxed">
                                                    {result.report.recommended_action}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-8 text-center text-sm text-(--gray)">
                                Run analysis to see charts and the full report below.
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