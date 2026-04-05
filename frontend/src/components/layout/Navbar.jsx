import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {

    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };
    const isLanding = pathname === "/";

    return (
        <nav className="fixed top-5 left-1/2 z-50 w-[90%] max-w-7xl -translate-x-1/2 glass border-b rounded-xl border-(--white)/5">
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

                    {isAuthenticated ? (
                        <>
                            <Link to="/scan" className="hover:text-[white] transition">
                                Scan
                            </Link>
                            <Link to="/history" className="hover:text-[white] transition">
                                History
                            </Link>
                            <Link to="/dashboard" className="hover:text-[white] transition">
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        <Link to="/scan" className="hover:text-[white] transition">
                            Test scan
                        </Link>
                    )}

                    {isLanding && (
                        <>
                            <a href="#features" className="hover:text-[white] transition">
                                Features
                            </a>
                            <a href="#how-it-works" className="hover:text-[white] transition">
                                How it Works
                            </a>
                            <a href="#cta" className="hover:text-[white] transition">
                                Get started
                            </a>
                        </>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-2">
                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold text-(--white)/90 hover:scale-105 cursor-pointer glass transition-all"
                        >
                            Log out
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/signin"
                                className="inline-flex items-center justify-center rounded-full px-2 py-2 text-sm font-semibold text-(--gray) hover:text-(--white) transition"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-linear-to-t from-(--primary)/80 to-(--secondary)/80 hover:bg-(--primary) transition-all"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                <div className="md:hidden">
                    <div className="flex items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link to="/scan" className="rounded-full px-3 py-2 text-xs font-semibold glass glass-hover">
                                    Scan
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-full px-3 py-2 text-xs font-semibold border border-white/20"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/scan" className="rounded-full px-3 py-2 text-xs font-semibold glass glass-hover">
                                    Test scan
                                </Link>
                                <Link
                                    to="/signin"
                                    className="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold glass glass-hover"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold bg-linear-to-r from-(--primary)/85 to-(--secondary)/55 border border-white/15"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;