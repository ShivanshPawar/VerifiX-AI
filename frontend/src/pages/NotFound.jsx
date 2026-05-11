import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="relative min-h-screen w-full flex justify-center overflow-hidden bg-(--black) text-(--white) px-4 sm:px-6">
            <div className="relative z-10 grid w-full max-w-4xl items-center">
                <section aria-label="Not found scanner" className="glass relative overflow-hidden rounded-2xl p-4 sm:p-6 md:p-6">
                    <div className="relative min-h-75 sm:min-h-100 md:min-h-125 overflow-hidden rounded-2xl border border-(--gray)/35 bg-(--black)">
                        <div className="grid-overlay" />

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,221,255,0.22),transparent_42%)]" />
                        <div className="absolute inset-8 rounded-full border border-(--primary)/25" />
                        <div className="absolute inset-16 rounded-full border border-(--primary)/10" />
                        <div className="absolute left-1/2 top-1/2 h-32 w-px -translate-x-1/2 -translate-y-1/2 bg-(--primary)/40" />
                        <div className="absolute left-1/2 top-1/2 h-px w-32 -translate-x-1/2 -translate-y-1/2 bg-(--primary)/40" />

                        <div className="absolute inset-0 flex items-center justify-center px-4">
                            <div className="text-center">
                                <div className="logo text-6xl sm:text-8xl md:text-[10rem] lg:text-[15rem] font-black leading-none">404</div>
                                <div className="mt-3 text-xs sm:text-sm font-semibold uppercase text-(--primary)">
                                    No matching route
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="absolute z-30 right-2 top-2 inline-flex items-center justify-center gap-2 rounded-lg px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-(--gray) transition-all hover:text-(--white)"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Go back</span>
                            <span className="sm:hidden">Back</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default NotFound
