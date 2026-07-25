import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/services';
import anime from 'animejs/lib/anime.es.js';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        if (!success) {
            // Form entrance
            anime({
                targets: '.anime-item',
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 800,
                delay: anime.stagger(100),
                easing: 'easeOutExpo'
            });

            // Ambient background drift
            anime({
                targets: '.anime-bg',
                translateX: () => anime.random(-50, 50),
                translateY: () => anime.random(-50, 50),
                scale: [1, 1.1, 1],
                duration: 10000,
                easing: 'easeInOutSine',
                direction: 'alternate',
                loop: true
            });
        }
    }, [success]);

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
        setSuccess('');
        if (formData.password !== formData.confirmPassword) {
            window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: "Passwords don't match", type: 'warning' } }));
            return;
        }
        if (!formData.username || formData.username.length < 3) {
            window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: "Username must be at least 3 characters", type: 'warning' } }));
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: "Please enter a valid email address", type: 'warning' } }));
            return;
        }
        setLoading(true);
        try {
            await authService.register({ username: formData.username, email: formData.email, password: formData.password });
            setSuccess('Your citizenship has been registered.');
        } catch {
            // Handled by global interceptor
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#07101a] relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="anime-bg absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="anime-bg absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Greek Meander / Key pattern overlay (subtle) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h60v60H0z\' fill=\'none\'/%3E%3Cpath d=\'M15 15h30v30H15z\' stroke=\'%23ffffff\' stroke-width=\'1\' fill=\'none\'/%3E%3Cpath d=\'M25 25h10v10H25z\' stroke=\'%23ffffff\' stroke-width=\'1\' fill=\'none\'/%3E%3C/svg%3E")' }}></div>

            {/* Top Right Navigation */}
            <div className="absolute top-8 right-8 z-50">
                <Link to="/explore" className="text-on-surface-variant hover:text-white transition-colors text-[13px] font-[600] tracking-wide flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-md">
                    <span className="material-symbols-outlined text-[16px]">explore</span>
                    Browse
                </Link>
            </div>

            {/* Centered Auth Card */}
            <div ref={containerRef} className="w-full max-w-[420px] p-4 sm:p-6 z-10 mt-12 sm:mt-0">
                <div className="w-full">
                    {success ? (
                        <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-primary text-[32px]">check_circle</span>
                            </div>
                            <h2 className="text-[1.5rem] font-[800] text-white tracking-tight mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>Welcome to AgoraX</h2>
                            <p className="text-on-surface-variant text-[14px] font-[500] mb-8">{success}</p>
                            
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3.5 bg-primary text-[#0b1326] text-[15px] font-[800] rounded-sm cta-glow transform hover:-translate-y-0.5 duration-200 cursor-pointer"
                            >
                                Proceed to Sign In
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center text-center mb-8 anime-item">
                                <span className="material-symbols-outlined text-[48px] text-primary mb-4">account_balance</span>
                                <h2 className="text-[2.25rem] font-[800] text-white tracking-tight mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>Join AgoraX</h2>
                                
                                <div className="w-full p-4 border-l-2 border-primary/40 bg-primary/5 text-left rounded-sm backdrop-blur-sm">
                                    <p className="text-on-surface-variant text-[13px] leading-relaxed">
                                        <strong className="text-primary font-[700]">Agora</strong> <em>(n.)</em> In ancient Athens, the heart of public life. A marketplace of ideas where citizens gathered to debate, share stories, and govern.
                                    </p>
                                </div>
                            </div>

                            {/* Social Logins */}
                            <div className="mb-5 flex justify-center w-full anime-item">
                                <button 
                                    type="button"
                                    className="relative w-full h-[48px] rounded-sm overflow-hidden bg-surface-low border border-white/5 hover:bg-surface-high/50 transition-colors group cursor-pointer"
                                    onClick={handleGoogleRedirectClick}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
                                        <svg width="18" height="18" viewBox="0 0 48 48">
                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                        </svg>
                                        <span className="text-[13px] font-[700] text-white tracking-wide">Continue with Google</span>
                                    </div>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4 mb-5 anime-item">
                                <div className="flex-1 h-px bg-white/5"></div>
                                <span className="text-[10px] font-[800] tracking-[0.15em] text-white/30 uppercase">Or Register</span>
                                <div className="flex-1 h-px bg-white/5"></div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="anime-item">
                                    <label className="text-[9px] font-[800] tracking-[0.1em] uppercase text-on-surface-variant block mb-1.5 px-1">Display Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-2.5 bg-surface-lowest border border-white/5 text-white text-[14px] font-[500] rounded-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                        placeholder="Your alias"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>

                                <div className="anime-item">
                                    <label className="text-[9px] font-[800] tracking-[0.1em] uppercase text-on-surface-variant block mb-1.5 px-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-5 py-3 bg-surface-lowest border border-white/5 text-white text-[15px] font-[500] rounded-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                        placeholder="citizen@agorax.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 anime-item">
                                    <div>
                                        <label className="text-[9px] font-[800] tracking-[0.1em] uppercase text-on-surface-variant block mb-1.5 px-1">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="w-full px-4 py-2.5 bg-surface-lowest border border-white/5 text-white text-[14px] font-[500] font-mono tracking-widest rounded-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                            <span 
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant cursor-pointer hover:text-white transition-colors text-[18px]"
                                            >
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-[800] tracking-[0.1em] uppercase text-on-surface-variant block mb-1.5 px-1">Confirm</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="w-full px-4 py-2.5 bg-surface-lowest border border-white/5 text-white text-[14px] font-[500] font-mono tracking-widest rounded-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            />
                                            <span 
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant cursor-pointer hover:text-white transition-colors text-[18px]"
                                            >
                                                {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 bg-primary text-[#0b1326] text-[15px] font-[800] rounded-sm cta-glow transform hover:-translate-y-0.5 duration-200 mt-2 cursor-pointer anime-item ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>
                            <div className="mt-6 text-center text-[12px] font-[500] tracking-wide text-on-surface-variant anime-item">
                                Already joined?{' '}
                                <Link to="/login" className="text-white font-[700] hover:text-primary transition-colors hover:underline underline-offset-4 decoration-primary/50">Sign In</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
