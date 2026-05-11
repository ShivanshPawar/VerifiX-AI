import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { api } from '../lib/api'
import { CloudAlert } from 'lucide-react'

const History = () => {
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [limit] = useState(9)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Pagination
    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

    // Load history
    const load = async (nextPage) => {
        setError('')
        setLoading(true)
        try {
            const res = await api.get('/history', { params: { page: nextPage, limit } })
            setItems(res.data?.data ?? [])
            setTotal(res.data?.total ?? 0)
            setPage(res.data?.page ?? nextPage)
        } catch (err) {
            if (err?.response?.status === 401) {
                navigate('/signin', { replace: true })
                return
            }
            setError(err?.response?.data?.message ?? 'Unable to load history.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Delete history
    const onDelete = async (scanId) => {
        setError('')
        try {
            await api.delete(`/history/${scanId}`)
            await load(page)
        } catch (err) {
            setError(err?.response?.data?.message ?? 'Failed to delete history item.')
        }
    }

    // Badge class by verdict
    const badgeClass = (verdict) => {
        const v = String(verdict || '').toUpperCase()
        if (v === 'AUTHENTIC') return 'bg-(--success)/15 text-(--success) border-(--success)/40'
        if (v === 'MANIPULATED') return 'bg-(--danger)/10 text-(--danger) border-(--danger)/40'
        return 'bg-(--warning)/10 text-(--warning) border-(--warning)/40'
    }

    return (
        <div className="min-h-screen bg-(--black) text-(--white)">
            <Navbar />

            <div className="mx-auto max-w-6xl px-5 sm:px-15 pt-24 pb-12">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">History</h1>
                        <p className="mt-2 text-(--gray)">Your recent scans and reports.</p>
                    </div>
                    <Link
                        to="/scan"
                        className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold bg-linear-to-t from-(--primary)/80 to-(--secondary)/80 hover:bg-(--primary) transition-all"
                    >
                        New scan
                    </Link>
                </div>

                {error ? (
                    <div className="mt-6 rounded-2xl flex items-center gap-2 p-3 border border-(--danger)/35 bg-(--danger)/10 text-(--danger) text-sm">
                        <CloudAlert /> {error}
                    </div>
                ) : null}

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((it) => (
                        <div key={it.scanId} className="glass-container hover:scale-102 transition-all rounded-2xl overflow-hidden">
                            <div className="relative h-40 overflow-hidden border-b border-(--white)/10 bg-(--black)">
                                {it.thumbnail ? (
                                    <>
                                        <img
                                            alt={it.title || 'Scan thumbnail'}
                                            className="h-full w-full object-cover"
                                            src={`data:image/jpeg;base64,${it.thumbnail}`}
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-(--black)/75 via-(--black)/25 to-transparent backdrop-blur-[5px]" />
                                    </>
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm text-(--white)/50">No preview</div>
                                )}
                            </div>

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold text-(--white)">{it.title || 'Untitled scan'}</div>
                                        <div className="mt-1 text-xs text-(--white)/70">
                                            {it.scannedAt ? new Date(it.scannedAt).toLocaleString() : ''}
                                        </div>
                                    </div>
                                    <div className={`shrink-0 rounded-full px-3 py-1 text-xs border ${badgeClass(it.verdict)}`}>
                                        {it.verdict}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <div className="text-xs text-(--white)/80">
                                        Confidence:{' '}
                                        <span className="font-semibold text-(--white)">{it.confidencePercent ?? '—'}%</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/history/${it.scanId}`}
                                            className="rounded-full px-3 py-1.5 text-xs font-semibold glass-container hover:scale-105 cursor-pointer transition-all"
                                        >
                                            Details
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(it.scanId)}
                                            className="rounded-full px-3 py-1.5 text-xs font-semibold border border-(--danger)/40 bg-(--danger)/10 text-(--danger) hover:scale-105 cursor-pointer transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-sm text-(--gray)">
                        {loading ? 'Loading…' : `Page ${page} of ${totalPages} • ${total} scans`}
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => load(page - 1)}
                            className="rounded-full px-4 py-2 text-sm font-semibold glass-container disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 transition-all"
                        >
                            Prev
                        </button>
                        <button
                            type="button"
                            disabled={page >= totalPages || loading}
                            onClick={() => load(page + 1)}
                            className="rounded-full px-4 py-2 text-sm font-semibold glass-container disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default History

