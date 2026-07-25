import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import anime from 'animejs/lib/anime.es.js';

export default function BottomNav() {
    const location = useLocation();
    
    // Helper to determine if a feed tab is active
    const isFeedActive = (sortParam) => {
        if (location.pathname !== '/explore' && location.pathname !== '/') return false;
        const searchParams = new URLSearchParams(location.search);
        const sort = searchParams.get('sort') || 'new';
        return sort === sortParam;
    };

    const animateTab = (e) => {
        const icon = e.currentTarget.querySelector('.nav-icon');
        if (icon) {
            anime.remove(icon);
            anime({
                targets: icon,
                translateY: [0, -8, 0],
                scale: [1, 1.2, 1],
                duration: 500,
                easing: 'easeOutElastic(1, .5)'
            });
        }
    };

    return (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-lowest/90 backdrop-blur-xl border-t border-white/5 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {/* Home (New) */}
                <Link to="/explore?sort=new" onClick={animateTab} className="flex flex-col items-center justify-center w-12 h-full gap-1 group">
                    <span className={`nav-icon material-symbols-outlined text-[24px] transition-colors duration-200 ${isFeedActive('new') ? 'text-primary filled' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        schedule
                    </span>
                    <span className={`text-[9px] font-[700] uppercase tracking-wide ${isFeedActive('new') ? 'text-primary' : 'text-on-surface-variant'}`}>
                        New
                    </span>
                </Link>

                {/* Hot */}
                <Link to="/explore?sort=hot" onClick={animateTab} className="flex flex-col items-center justify-center w-12 h-full gap-1 group">
                    <span className={`nav-icon material-symbols-outlined text-[24px] transition-colors duration-200 ${isFeedActive('hot') ? 'text-primary filled' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        local_fire_department
                    </span>
                    <span className={`text-[9px] font-[700] uppercase tracking-wide ${isFeedActive('hot') ? 'text-primary' : 'text-on-surface-variant'}`}>
                        Hot
                    </span>
                </Link>

                {/* Create (Center Floating-like Button) */}
                <Link to="/create" onClick={animateTab} className="flex items-center justify-center -mt-6">
                    <div className="nav-icon w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg shadow-primary/20 transform transition-transform duration-200 active:scale-95">
                        <span className="material-symbols-outlined text-canvas text-[28px] font-bold">add</span>
                    </div>
                </Link>

                {/* Trending */}
                <Link to="/explore?sort=trending" onClick={animateTab} className="flex flex-col items-center justify-center w-12 h-full gap-1 group">
                    <span className={`nav-icon material-symbols-outlined text-[24px] transition-colors duration-200 ${isFeedActive('trending') ? 'text-primary filled' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        trending_up
                    </span>
                    <span className={`text-[9px] font-[700] uppercase tracking-wide ${isFeedActive('trending') ? 'text-primary' : 'text-on-surface-variant'}`}>
                        Trend
                    </span>
                </Link>

                {/* Profile */}
                <Link to="/profile" onClick={animateTab} className="flex flex-col items-center justify-center w-12 h-full gap-1 group">
                    <span className={`nav-icon material-symbols-outlined text-[24px] transition-colors duration-200 ${location.pathname === '/profile' ? 'text-primary filled' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                        person
                    </span>
                    <span className={`text-[9px] font-[700] uppercase tracking-wide ${location.pathname === '/profile' ? 'text-primary' : 'text-on-surface-variant'}`}>
                        Profile
                    </span>
                </Link>
            </div>
        </div>
    );
}
