
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Menu, ChevronRight, LayoutDashboard, Globe } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ViewType } from '../types';
import { Link } from './Link';
import { usePathname } from 'next/navigation';
import { useAppContext } from './AppContext';
import { SITE_CONFIG } from '../blogData';

interface HeaderProps {
  dict: any;
}

const Header: React.FC<HeaderProps> = ({ dict }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, userTier } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const brandParts = SITE_CONFIG.brand.split(' ');
  const mainBrand = brandParts[0];
  const subBrand = brandParts[1];

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ease-in-out border-b ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-3xl border-neutral-800/50 h-16 shadow-[0_8px_32px_rgba(0,0,0,0.8)]' 
        : 'bg-black/20 backdrop-blur-sm border-transparent h-20'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo Area */}
        <Link 
          href={isLoggedIn ? '/dashboard' : '/'}
          className="flex items-center gap-4 cursor-pointer group z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="relative">
            <Activity className="w-6 h-6 text-white transition-transform group-hover:scale-110" strokeWidth={1.5} />
            <div className="absolute inset-0 bg-white blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-[0.2em] text-white uppercase font-manrope">
              {mainBrand} <span className="text-neutral-500">{subBrand}</span>
            </h1>
            <p className="text-[7px] font-mono text-neutral-600 uppercase tracking-[0.3em] -mt-1 leading-none">
              {SITE_CONFIG.publicationTitle}
            </p>
          </div>
        </Link>

        {/* Center Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {isLoggedIn ? (
              // LOGGED IN MENU
              <>
                <Link 
                  href="/dashboard"
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isActive('/dashboard') ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  {dict.common.dashboard}
                </Link>
                <Link 
                  href="/studio"
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isActive('/studio') ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  Generate
                </Link>
                <Link 
                  href="/showcase"
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isActive('/showcase') ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  Systems
                </Link>
              </>
            ) : (
              // PUBLIC MENU
              <>
                <Link 
                  href="/"
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isActive('/') ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  {dict.common.transmissions}
                </Link>
                <Link 
                  href="/showcase"
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isActive('/showcase') ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  {dict.common.systems}
                </Link>
                <Link 
                  href="/studio"
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isActive('/studio') ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  {dict.common.studio}
                </Link>
                <Link 
                  href="/pricing"
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isActive('/pricing') ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  {dict.common.access}
                </Link>
                <Link 
                  href="/models"
                  className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${isActive('/models') ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  Models
                </Link>
              </>
            )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6 z-50">
          <LanguageSwitcher />

          {!isLoggedIn ? (
            <>
              <Link 
                href="/login"
                className={`hidden md:block text-[10px] font-mono uppercase tracking-widest transition-colors ${isActive('/login') ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
              >
                {dict.common.login}
              </Link>
              
              <Link 
                href="/studio"
                className="group flex items-center gap-2 px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all sm:flex hidden"
              >
                {dict.common.getStarted}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          ) : (
            <Link 
              href="/dashboard"
              className="group flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all"
            >
              <LayoutDashboard className="w-3 h-3 text-neutral-400 group-hover:text-white" />
              <span className="hidden sm:inline">{dict.common.console}</span>
            </Link>
          )}
          
          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white w-10 h-10 flex items-center justify-center border border-neutral-900 bg-black/50"
          >
            {isMenuOpen ? <ChevronRight className="w-6 h-6 rotate-90" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 top-0 bg-black z-[40] flex flex-col pt-32 px-10"
            >
              <div className="space-y-8 overflow-y-auto max-h-[60vh] py-4">
                {(isLoggedIn ? ['Dashboard', 'Generate', 'Systems'] : [SITE_CONFIG.publicationTitle, 'Systems', 'Studio', 'Access', 'Login']).map((item) => {
                   const slug = item === SITE_CONFIG.publicationTitle ? '/' : `/${item.toLowerCase() === 'generate' ? 'studio' : item.toLowerCase() === 'access' ? 'pricing' : item.toLowerCase()}`;
                   return (
                    <Link 
                      key={item}
                      href={slug}
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-left text-4xl font-black italic uppercase tracking-tighter text-neutral-700 hover:text-white transition-all hover:translate-x-4 active:translate-x-2"
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
              
              <div className="mt-auto pb-12 space-y-6">
                <div className="h-px bg-neutral-900"></div>
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                  <span>VELOCITY_MOBILE_SYNC</span>
                  <div className="flex gap-4">
                    <button className="hover:text-white">TW</button>
                    <button className="hover:text-white">IG</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

