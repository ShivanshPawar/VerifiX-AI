import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-(--white)/10 py-12 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="text-3xl text-(--white) tracking-wide">
              Verifi<span className="logo">X</span>
            </Link>
            <p className="mt-3 text-sm text-(--gray) max-w-sm">
              A modern deepfake image verification platform—fast, privacy-first, and built for clarity.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="glass rounded-full px-3 py-1 text-xs text-(--gray)">Detect Deepfakes</span>
              <span className="glass rounded-full px-3 py-1 text-xs text-(--gray)">Privacy-First Scan</span>
              <span className="glass rounded-full px-3 py-1 text-xs text-(--gray)">Scan History</span>
              <span className="glass rounded-full px-3 py-1 text-xs text-(--gray)">Analysis Reports</span>
              <span className="glass rounded-full px-3 py-1 text-xs text-(--gray)">Multi-Model AI</span>
              <span className="glass rounded-full px-3 py-1 text-xs text-(--gray)">Precise Accuracy</span>

            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-semibold text-(--white)">Product</div>
              <div className="mt-3 space-y-2 text-sm text-(--gray)">
                <a href="#features" className="block hover:text-(--white) transition">Features</a>
                <a href="#how-it-works" className="block hover:text-(--white) transition">How it works</a>
                <a href="#cta" className="block hover:text-(--white) transition">Get started</a>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-(--white)">Account</div>
              <div className="mt-3 space-y-2 text-sm text-(--gray)">
                <Link to="/signin" className="block hover:text-(--white) transition">Sign in</Link>
                <Link to="/signup" className="block hover:text-(--white) transition">Sign up</Link>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-(--white)">Support</div>
              <div className="mt-3 space-y-2 text-sm text-(--gray)">
                <a href="#" className="block hover:text-(--white) transition">Privacy</a>
                <a href="#" className="block hover:text-(--white) transition">Terms</a>
                <a href="#" className="block hover:text-(--white) transition">support@verifix.ai</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center sm:justify-start text-sm text-(--gray)">
          © 2026 VerifiX. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer