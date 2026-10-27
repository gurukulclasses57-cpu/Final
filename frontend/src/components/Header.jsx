import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ChevronRight } from 'lucide-react';
import { SITE, NAV_LINKS, resolveBackendUrl } from '../mock';
import { Button } from './ui/button';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="hidden md:block bg-[#F5B921] text-[#0F2A5C] text-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span>For New Enquiry &amp; Registration:</span>
            <a href={`tel:${SITE.phone}`} className="hover:underline flex items-center gap-1"><Phone size={14}/> {SITE.phone}</a>
          </div>
          <a href={`mailto:${SITE.email}`} className="hover:underline flex items-center gap-1">
            <Mail size={14}/> {SITE.email}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className={`bg-[#0F2A5C] text-white transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-1 flex items-center justify-center" style={{ width: SITE.logo_width || 56, height: SITE.logo_height || 56 }}>
              <img src={resolveBackendUrl(SITE.logo)} alt={SITE.name} className="object-contain" style={{ width: '100%', height: '100%' }}/>
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-lg tracking-wide">{SITE.name}</div>
              <div className="text-[11px] text-[#F5B921] uppercase tracking-widest"></div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={`px-3 py-2 text-sm font-medium rounded hover:bg-white/10 transition-colors ${pathname === l.href ? 'text-[#F5B921]' : 'text-white'}`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/admission">
              <Button className="ml-2 bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold">
                Apply Now <ChevronRight size={16}/>
              </Button>
            </Link>
          </nav>

          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded hover:bg-white/10" aria-label="Open menu">
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}/>
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="font-bold text-[#0F2A5C]">{SITE.name}</div>
              <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-gray-100"><X /></button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className={`block px-4 py-3 rounded text-sm font-semibold hover:bg-[#F5B921]/10 ${pathname === l.href ? 'bg-[#0F2A5C] text-white' : 'text-[#0F2A5C]'}`}
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/admission" className="block mt-3 mx-4">
                <Button className="w-full bg-[#F5B921] hover:bg-[#e3a911] text-[#0F2A5C] font-bold">Apply Now</Button>
              </Link>
            </nav>
            <div className="p-4 border-t text-xs text-gray-600 space-y-1">
              <a href={`tel:${SITE.phone}`} className="flex items-center gap-2"><Phone size={14}/>{SITE.phone}</a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2"><Mail size={14}/>{SITE.email}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
