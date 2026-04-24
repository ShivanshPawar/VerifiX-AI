import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const buttons = [
    'Detect Deepfakes',
    'Privacy-First Scan',
    'Scan History',
    'Analysis Reports',
    'Multi-Model AI',
    'Precise Accuracy'
  ];

  return (
    <footer className="flex justify-center items-center border-t border-(--white)/10 mt-20 py-20 px-5 sm:px-10 lg:px-0">
      <div className="w-full lg:max-w-[90%] px-4 py-2 sm:px-6 lg:px-4">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="text-3xl text-(--white) tracking-wide">
              Verifi<span className="logo">X</span>
            </Link>
            <p className="mt-3 text-sm text-(--gray) max-w-sm">
              A modern deepfake image verification platform—fast, privacy-first, and built for clarity.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              {buttons.map((button, index) => (
                <span key={index} className="glass rounded-full px-3 py-1 text-xs text-(--gray) hover:scale-105 transition-all cursor-pointer">
                  {button}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'How it works', href: '#how-it-works' }, { label: 'Get started', href: '#cta' }] },
              { title: 'Account', links: [{ label: 'Sign in', to: '/signin' }, { label: 'Sign up', to: '/signup' }] },
              { title: 'Support', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'support@verifix.ai', href: '#' }] }
            ].reduce((acc, section, idx) => {
              acc.push(
                <div key={idx}>
                  <div className="text-sm font-semibold text-(--white)">{section.title}</div>
                  <div className="mt-3 space-y-2 text-sm text-(--gray)">
                    {section.links.map((link, i) =>
                      link.to ? (
                        <Link key={i} to={link.to} className="block hover:text-(--white) transition">{link.label}</Link>
                      ) : (
                        <a key={i} href={link.href} className="block hover:text-(--white) transition">{link.label}</a>
                      )
                    )}
                  </div>
                </div>
              );
              return acc;
            }, [])}
          </div>
        </div>

        <div className="pt-10 flex items-center justify-center text-sm text-(--gray)">
          © 2026 VerifiX. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer