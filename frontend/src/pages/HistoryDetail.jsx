import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { api } from '../lib/api'
import { Undo2 } from 'lucide-react'

const HistoryDetail = () => {
    const { id } = useParams()
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
                const res = await api.get(`/history/${id}`)
                if (!alive) return
                setData(res.data)
            } catch (err) {
                if (!alive) return
                if (err?.response?.status === 401) {
                    navigate('/signin', { replace: true })
                    return
                }
                setError(err?.response?.data?.message ?? 'Failed to fetch scan details.')
            } finally {
                if (alive) setLoading(false)
            }
        }
        run()
        return () => {
            alive = false
        }
    }, [id, navigate])

    const verdictClass = useMemo(() => {
        const v = data?.verdict
        if (v === 'AUTHENTIC') return 'text-(--success)'
        if (v === 'MANIPULATED') return 'text-(--danger)'
        return 'text-(--warning)'
    }, [data])

    return (
        <div className="min-h-screen bg-(--black) text-(--white)">
            <Navbar />

            <div className="mx-auto max-w-4xl px-5 sm:px-6 pt-24 pb-12">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Scan details</h1>
                        <p className="mt-2 text-(--gray)">Full report and confidence.</p>
                    </div>
                    <div className="flex glass p-2 rounded-xl gap-2">
                        <Link to="/history" className=" sm:px-2 py-2 text-sm font-semibold text-(--white)/80 hover:text-(--white) transition-all">
                            <Undo2 />
                        </Link>
                        <Link
                            to="/scan"
                            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-linear-to-t from-(--primary)/80 to-(--secondary)/80 hover:bg-(--primary) transition-all"
                        >
                            New scan
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="mt-6 glass rounded-2xl p-6 text-(--gray)">Loading…</div>
                ) : error ? (
                    <div className="mt-6 glass rounded-2xl p-3 border border-(--danger)/35 bg-(--danger)/10 text-(--white) text-sm">
                        {error}
                    </div>
                ) : (
                    <div className="mt-6 space-y-5">
                        <div className="glass rounded-2xl p-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className={`text-lg font-black tracking-tight ${verdictClass}`}>{data?.verdict}</div>
                                <div className="glass rounded-full px-3 py-1 text-xs text-(--gray)">
                                    Confidence: {data?.confidencePercent ?? '—'}%
                                </div>
                                <div className="glass rounded-full px-3 py-1 text-xs text-(--gray)">
                                    {data?.scannedAt ? new Date(data.scannedAt).toLocaleString() : ''}
                                </div>
                            </div>
                        </div>

                        {data?.report?.summary ? (
                            <div className="glass rounded-2xl p-6">
                                <div className="text-xs font-semibold text-(--gray)">Summary</div>
                                <div className="mt-2 text-sm text-(--white) leading-relaxed">{data.report.summary}</div>
                            </div>
                        ) : null}

                        {Array.isArray(data?.report?.what_this_means) && data.report.what_this_means.length ? (
                            <div className="glass rounded-2xl p-6">
                                <div className="text-xs font-semibold text-(--gray)">What this means</div>
                                <ul className="mt-3 space-y-2 text-sm text-(--gray)">
                                    {data.report.what_this_means.map((x, i) => (
                                        <li key={i} className="leading-relaxed">
                                            {x}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {data?.report?.recommended_action ? (
                            <div className="glass rounded-2xl p-6">
                                <div className="text-xs font-semibold text-(--gray)">Recommended action</div>
                                <div className="mt-2 text-sm text-(--gray) leading-relaxed">{data.report.recommended_action}</div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default HistoryDetail

