import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { api } from '../lib/api'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Pie,
    PieChart,
    Rectangle,
    ResponsiveContainer,
    Sector,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { CloudAlert, History } from 'lucide-react'

const COLORS = {
    AUTHENTIC: 'var(--success)',
    MANIPULATED: 'var(--danger)',
    INCONCLUSIVE: 'var(--warning)',
}

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        let alive = true
        const run = async () => {
            setError('')
            setLoading(true)
            try {
                const res = await api.get('/dashboard')
                if (alive) setData(res.data)
            } catch (err) {
                if (err?.response?.status === 401) {
                    navigate('/signin', { replace: true })
                    return
                }
                if (alive) setError(err?.response?.data?.message ?? 'Unable to load dashboard data.')
            } finally {
                if (alive) setLoading(false)
            }
        }
        run()
        return () => {
            alive = false
        }
    }, [navigate])

    const verdictPieData = useMemo(() => {
        const s = data?.stats
        if (!s) return []
        return [
            { name: 'Authentic', value: s.authentic || 0, key: 'AUTHENTIC', fill: COLORS.AUTHENTIC },
            { name: 'Manipulated', value: s.manipulated || 0, key: 'MANIPULATED', fill: COLORS.MANIPULATED },
            { name: 'Inconclusive', value: s.inconclusive || 0, key: 'INCONCLUSIVE', fill: COLORS.INCONCLUSIVE },
        ].filter((d) => d.value > 0)
    }, [data])

    const verdictBarData = useMemo(() => {
        const s = data?.stats
        if (!s) return []
        const rows = [
            { name: 'Authentic', score: s.authentic || 0, key: 'AUTHENTIC', fill: COLORS.AUTHENTIC },
            { name: 'Manipulated', score: s.manipulated || 0, key: 'MANIPULATED', fill: COLORS.MANIPULATED },
            { name: 'Inconclusive', score: s.inconclusive || 0, key: 'INCONCLUSIVE', fill: COLORS.INCONCLUSIVE },
        ]
        /* Left = lowest count, right = highest */
        return [...rows].sort((a, b) => a.score - b.score)
    }, [data])

    const barColorByKey = (key) => COLORS[key] || 'var(--primary)'

    const renderBarShape = (props) => {
        const fill = props?.payload?.fill ?? barColorByKey(props?.payload?.key)
        return <Rectangle {...props} fill={fill} stroke={fill} strokeWidth={2} rx={8} ry={8} fillOpacity={0.88} />
    }

    const renderPieShape = (props) => {
        const fill = props?.payload?.fill ?? 'var(--primary)'
        return <Sector {...props} fill={fill} />
    }

    return (
        <div className="min-h-screen bg-(--black) text-(--white)">
            <Navbar />

            <div className="mx-auto max-w-6xl px-5 sm:px-6 pt-24 pb-12">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Dashboard</h1>
                        <p className="mt-2 text-(--gray)">Overview of your scans and verdicts.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/history" title='history' className="inline-flex items-center justify-center rounded-full px-2.5 text-sm font-semibold text-(--white)/80 hover:text-(--white) glass">
                            <History className='w-5' />
                        </Link>
                        <Link
                            to="/scan"
                            className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold bg-linear-to-t from-(--primary)/80 to-(--secondary)/80 hover:bg-(--primary) transition-all"
                        >
                            New scan
                        </Link>

                    </div>
                </div>

                {loading ? (
                    <div className="mt-8 glass rounded-2xl p-8 text-(--gray)">Loading…</div>
                ) : error ? (
                    <div className="mt-8 rounded-2xl flex items-center gap-2 p-4 border border-(--danger)/35 bg-(--danger)/10 text-(--danger) text-sm"><CloudAlert /> {error}</div>
                ) : data ? (
                    <>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {[
                                { label: 'Total scans', value: data.stats?.total_scans ?? 0 },
                                { label: 'Unique images', value: data.stats?.unique_image ?? 0, },
                                { label: 'Authentic', value: data.stats?.authentic ?? 0, accent: 'text-(--success)' },
                                { label: 'Manipulated', value: data.stats?.manipulated ?? 0, accent: 'text-(--danger)' },
                                { label: 'Inconclusive', value: data.stats?.inconclusive ?? 0, accent: 'text-(--warning)' },
                            ].map((c) => (
                                <div key={c.label} className="glass rounded-2xl p-5">
                                    <div className="text-xs text-(--gray)">{c.label}</div>
                                    <div className={`mt-1 text-2xl font-black ${c.accent ?? 'text-(--white)'}`}>{c.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="glass rounded-2xl p-5 sm:p-6">
                                <div className="text-sm font-semibold text-(--white)">Verdict distribution</div>
                                <p className="mt-1 text-xs text-(--gray)">Bars left → right: lowest to highest count</p>
                                <div className="mt-4 h-70">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={verdictBarData} margin={{ top: 16, right: 12, left: 12, bottom: 8 }}>
                                            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: 'rgba(255,255,255,0.85)', fontSize: 12 }}
                                                axisLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                            />
                                            <YAxis
                                                allowDecimals={false}
                                                tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 11 }}
                                                axisLine={{ stroke: 'rgba(255,255,255,0.10)' }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                                content={({ active, payload }) => {
                                                    if (!active || !payload?.length) return null
                                                    const p = payload[0].payload
                                                    const c = barColorByKey(p.key)
                                                    return (
                                                        <div
                                                            className="rounded-xl px-3 py-2 shadow-xl backdrop-blur-md"
                                                            style={{
                                                                borderWidth: 1,
                                                                borderStyle: 'solid',
                                                                borderColor: 'var(--gray)',
                                                                background: 'rgba(8, 10, 16, 0.96)',
                                                                color: '#fff',
                                                            }}
                                                        >
                                                            <div className="text-xs font-semibold" style={{ color: c }}>
                                                                {p.name}
                                                            </div>
                                                            <div className="text-lg font-black tabular-nums mt-0.5" style={{ color: c }}>
                                                                {p.score} scans
                                                            </div>
                                                        </div>
                                                    )
                                                }}
                                            />
                                            <Bar
                                                dataKey="score"
                                                radius={[8, 8, 0, 0]}
                                                maxBarSize={48}
                                                shape={renderBarShape}
                                                activeBar={(props) => {
                                                    const p = props?.payload
                                                    const stroke = barColorByKey(p?.key)
                                                    return <Rectangle {...props} stroke={stroke} strokeWidth={2} fillOpacity={0.88} />
                                                }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="glass rounded-2xl p-5 sm:p-6">
                                <div className="text-sm font-semibold text-(--white)">Verdict share</div>
                                <p className="mt-1 text-xs text-(--gray)">Proportional breakdown</p>
                                <div className="mt-4 h-70">
                                    {verdictPieData.length ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={verdictPieData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={90}
                                                    shape={renderPieShape}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: 'rgba(8,10,16,0.96)',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        borderRadius: 12,
                                                        color: '#fff',
                                                    }}
                                                    formatter={(value, name) => [`${value}`, name]}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-(--gray)">
                                            No scans yet — Run analysis to view detailed insights.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 glass rounded-2xl p-5 sm:p-6">
                            <div className="text-sm font-semibold text-(--white)">Recent activity</div>
                            <div className="mt-4 space-y-2">
                                {(data.recentActivity ?? []).length ? (
                                    data.recentActivity.map((r) => (
                                        <Link
                                            key={r.scanId}
                                            to={`/history/${r.scanId}`}
                                            className="flex items-center gap-4 rounded-2xl border border-white/10  px-4 py-3 hover:bg-(--gray)/5 transition"
                                        >
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/20 bg-(--black) ring-1 ring-white/10">
                                                {r.thumbnail ? (
                                                    <>
                                                        <img
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                            src={`data:image/jpeg;base64,${r.thumbnail}`}
                                                        />
                                                        {/* <div className="pointer-events-none absolute inset-0 rounded-full bg-black/35 backdrop-blur-[3px]" /> */}
                                                    </>
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xs font-medium text-white/60">
                                                        —
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate font-semibold text-white">{r.title || 'Untitled'}</div>
                                                <div className="mt-0.5 text-xs text-white/75">
                                                    <span className="font-medium text-white/90">{r.verdict}</span>
                                                    {' · '}
                                                    <span>{r.confidence ?? '—'}%</span>
                                                    {r.scannedAt ? (
                                                        <>
                                                            {' · '}
                                                            <span className="text-white/65">{new Date(r.scannedAt).toLocaleString()}</span>
                                                        </>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-sm text-(--gray)">No activity yet.</p>
                                )}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>

            <Footer />
        </div>
    )
}

export default Dashboard
