import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import LogoutModal from './LogoutModal';
import NotificationBell from './notifications/NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300 nav-border-animate ${
        isScrolled ? 'glass scrolled' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[80rem] mx-auto px-8 md:px-12 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-canvas">account_balance</span>
            </div>
            <span className="text-[20px] font-[800] text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-cinzel)' }}>
              AgoraX
            </span>
          </Link>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="btn-ghost btn-pill flex items-center gap-2 px-4 py-2 text-[13px] font-[700] hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_square</span>
                  Create Post
                </Link>

                <NotificationBell />

                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-surface-high/40 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-primary flex items-center justify-center text-canvas font-[800] text-[13px]">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[14px] font-[600] text-on-surface">{user.username}</span>
                </Link>

                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="p-2 text-on-surface-variant hover:text-error rounded-lg hover:bg-surface-high/30 transition-colors duration-200 cursor-pointer"
                  title="Sign Out"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </>
            ) : (
              <>
                {isAuthPage ? (
                  <Link
                    to="/explore"
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-[700] text-on-surface-variant hover:text-white transition-colors border border-outline-variant/30 hover:bg-surface-high/30"
                  >
                    <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                    Browse Posts
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-on-surface-variant hover:text-on-surface font-[600] text-[14px] px-4 py-2 transition-colors duration-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary rounded-sm cta-glow px-5 py-2 text-[13px] font-[800]"
                    >
                      Become a Citizen
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle (Unauthenticated only) / Actions (Authenticated) */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <>
                <NotificationBell />
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="p-2 -mr-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <span className="material-symbols-outlined text-[24px]">logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -mr-2 text-on-surface hover:text-primary transition-colors cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                <span className="material-symbols-outlined text-[28px]">
                  {isMobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-surface-lowest/95 backdrop-blur-xl z-40 border-t border-white/5 flex flex-col pt-8 px-6 overflow-y-auto pb-24">
          <div className="flex flex-col gap-4">
            {user ? null : (
              <>
                {isAuthPage ? (
                  <Link
                    to="/explore"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex justify-center items-center gap-2 px-5 py-4 rounded-xl text-[15px] font-[700] text-on-surface transition-colors border border-outline-variant/30 hover:bg-surface-high/30"
                  >
                    <span className="material-symbols-outlined text-[20px]">travel_explore</span>
                    Browse Posts
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex justify-center py-4 rounded-xl text-on-surface bg-surface-high border border-white/5 font-[600] text-[15px]"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex justify-center py-4 btn-primary rounded-sm cta-glow text-[15px] font-[800]"
                    >
                      Become a Citizen
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
        }}
      />
    </nav>
  );
}
