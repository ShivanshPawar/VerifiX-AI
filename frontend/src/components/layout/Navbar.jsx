import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="fixed top-5 left-1/2 z-50 w-[90%] -translate-x-1/2 glass border-b rounded-xl border-(--white)/5">
            <div className="px-4 sm:px-6 lg:px-4 py-2 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-3xl sm:text-3xl text-(--white) tracking-wide">
                    Verifi<span className="logo">X</span>
                </Link>

                {/* Navigation */}
                <div className="hidden md:flex items-center gap-8 text-(--white)/70 text-sm">
                    <Link to="/" className="hover:text-(--white) transition-all">
                        Home
                    </Link>

                    <Link to="/scan" className="hover:text-(--white) transition-all">
                        Scan
                    </Link>

                    <Link to="/history" className="hover:text-(--white) transition-all">
                        History
                    </Link>

                    <a href="#features" className="hover:text-(--white) transition-all">
                        Features
                    </a>

                    <a href="#how-it-works" className="hover:text-(--white) transition-all">
                        How it Works
                    </a>

                    <a href="#cta" className="hover:text-(--white) transition-all">
                        Get started
                    </a>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/signin"
                        className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold text-(--white)/70 hover:text-(--white) transition-all"
                    >
                        Sign in
                    </Link>
                    <Link
                        to="/signup"
                        className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold bg-linear-to-t from-(--primary)/90 to-(--secondary)/90 hover:bg-(--primary) transition-all"
                    >
                        Sign up
                    </Link>
                </div>

                <div className="md:hidden">
                    <div className="flex items-center gap-2">
                        <Link
                            to="/signin"
                            className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold glass"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold bg-linear-to-t from-(--primary)/90 to-(--secondary)/90"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;