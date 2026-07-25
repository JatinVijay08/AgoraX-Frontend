import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/services';
import anime from 'animejs/lib/anime.es.js';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        anime({
            targets: '.anime-item',
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(100),
            easing: 'easeOutExpo'
        });
    }, []);

    const handleGoogleRedirectClick = () => {
        const clientId = '450258133865-irr7v1o53jss1dptndhoma703j8ea0hm.apps.googleusercontent.com';
        const redirectUri = window.location.origin;
        const scope = 'openid email profile';
        const responseType = 'id_token';
        const nonce = Math.random().toString(36).substring(2);
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&nonce=${nonce}&prompt=select_account`;
        window.location.href = url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: "Please enter a valid email address", type: 'warning' } }));
            return;
        }
        setLoading(true);
        try {
            const response = await authService.login(formData);
            login(response.data);
            navigate('/');
        } catch {
            // Handled by global interceptor
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1326] relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Top Right Navigation */}
            <div className="absolute top-8 right-8 z-50">
                <Link to="/explore" className="text-on-surface-variant hover:text-white transition-colors text-[13px] font-[600] tracking-wide flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-md">
                    <span className="material-symbols-outlined text-[16px]">explore</span>
                    Browse
                </Link>
            </div>

            {/* Centered Auth Card */}
            <div ref={containerRef} className="w-full max-w-[420px] p-6 sm:p-8 z-10">
                <div className="flex flex-col items-center text-center mb-8 anime-item">
                    <h1 className="text-[2.25rem] font-[800] text-white tracking-tight mb-1">Welcome</h1>
                    <p className="text-[14px] font-[500] text-on-surface-variant">Sign in to continue</p>
                </div>

                {/* Social Logins */}
                <div className="mb-6 flex justify-center w-full anime-item">
                    <button 
                        type="button"
                        className="relative w-full h-[52px] rounded-xl overflow-hidden bg-surface-low border border-white/5 hover:bg-surface-high/50 transition-colors group cursor-pointer"
                        onClick={handleGoogleRedirectClick}
                    >
                        <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            <span className="text-[13px] font-[700] text-white tracking-wide">Continue with Google</span>
                        </div>
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6 anime-item">
                    <div className="flex-1 h-px bg-white/5"></div>
                    <span className="text-[10px] font-[800] tracking-[0.15em] text-white/30 uppercase">Or Email</span>
                    <div className="flex-1 h-px bg-white/5"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="anime-item">
                        <label className="text-[10px] font-[800] tracking-[0.1em] uppercase text-on-surface-variant block mb-2 px-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-5 py-3 bg-surface-lowest border border-white/5 text-white text-[15px] font-[500] rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                            placeholder="name@discussion-forum.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="anime-item">
                        <label className="text-[10px] font-[800] tracking-[0.1em] uppercase text-on-surface-variant block mb-2 px-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-5 py-3 bg-surface-lowest border border-white/5 text-white text-[15px] font-[500] font-mono tracking-widest rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <span 
                                onClick={() => setShowPassword(!showPassword)}
                                className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant cursor-pointer hover:text-white transition-colors"
                            >
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 bg-primary text-[#0b1326] text-[15px] font-[800] rounded-xl cta-glow transform hover:-translate-y-0.5 duration-200 mt-2 cursor-pointer anime-item ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-[13px] font-[500] tracking-wide text-on-surface-variant anime-item">
                    No account?{' '}
                    <Link to="/register" className="text-white font-[700] hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary/50">Register now</Link>
                </div>
            </div>
        </div>
    );
}
