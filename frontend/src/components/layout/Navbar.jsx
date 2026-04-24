import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { isAuthenticated, logout, ready } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isLanding = pathname === "/";
    const isLoggedIn = ready && isAuthenticated;

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        setMobileMenuOpen(false);
        await logout();
        navigate("/", { replace: true });
    };

    // Centralized nav config
    const navLinks = [
        { to: "/", label: "Home" },
        ...(isLoggedIn
            ? [
                { to: "/scan", label: "Scan" },
                { to: "/history", label: "History" },
                { to: "/dashboard", label: "Dashboard" },
            ]
            : [{ to: "/scan", label: "Test scan" }]),
    ];

    const landingLinks = isLanding
        ? [
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How it works" },
            { href: "#cta", label: "Get started" },
        ]
        : [];

    return (
        <nav
            role="navigation"
            className="fixed top-4 left-1/2 z-50 w-[90%] sm:w-[95%] lg:max-w-[90%] -translate-x-1/2 rounded-xl glass"
        >
            <div className="flex items-center justify-between px-4 py-2 sm:px-6 lg:px-4">
                {/* Logo */}
                <Link to="/" className="text-2xl sm:text-3xl text-(--white)">
                    Verifi<span className="logo">X</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8 text-sm text-(--white)/70">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="hover:text-(--white) transition-all"
                        >
                            {link.label}
                        </Link>
                    ))}

                    {landingLinks.map((item) => (
                        <a className="hover:text-(--white) transition-all" key={item.href} href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Desktop Auth */}
                <div className="hidden lg:flex items-center gap-2">
                    {isLoggedIn ? (
                        <button className="text-sm glass px-2 py-1 rounded-lg hover:scale-105 transition-all cursor-pointer font-semibold" onClick={handleLogout}>Log out</button>
                    ) : (
                        <>
                            <Link className="text-sm font-semibold px-2 py-1 hover:scale-105 transition-all" to="/signin">Sign in</Link>
                            <Link className="text-sm font-semibold px-2 py-1 rounded-lg bg-linear-to-t from-(--primarybg-linear-to-t from-(--primary)/80 to-(--secondary)/80 hover:scale-105 transition-all" to="/signup">Sign up</Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden flex flex-col items-center gap-3 px-4 pb-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="block"
                        >
                            {link.label}
                        </Link>
                    ))}

                    {landingLinks.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="block"
                        >
                            {item.label}
                        </a>
                    ))}

                    {isLoggedIn ? (
                        <button className="w-full bg-(--danger)/20 border border-(--danger) text-(--danger) px-4 py-2 rounded-lg" onClick={handleLogout}>Log out</button>
                    ) : (
                        <>
                            <Link className="text-center w-full sm:w-auto font-semibold rounded-xl px-4 py-2 glass" to="/signin">Sign in</Link>
                            <Link className="text-center w-full sm:w-auto font-semibold rounded-xl px-4 py-2 bg-linear-to-t from-(--primarybg-linear-to-t from-(--primary)/80 to-(--secondary)/80 hover:bg-(--primary)" to="/signup">Sign up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;