import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import RecentUsersWidget from '../components/RecentUsersWidget';

import { usePosts } from '../hooks/usePosts';

export default function Home() {
    const navigate = useNavigate();
    const { 
        posts, loading, loadingMore, error, hasMore, 
        activeTab, setActiveTab, handleLoadMore 
    } = usePosts();

    const tabs = [
        { key: 'hot', label: 'Hot', icon: 'local_fire_department' },
        { key: 'trending', label: 'Trending', icon: 'trending_up' },
        { key: 'new', label: 'New', icon: 'schedule' },
    ];

    const observer = useRef();
    const lastPostElementRef = useCallback(node => {
        if (loadingMore) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                handleLoadMore();
            }
        }, {
            root: null,
            rootMargin: '200px',
            threshold: 0
        });
        
        if (node) observer.current.observe(node);
    }, [loadingMore, hasMore, handleLoadMore]);

    if (loading) {
        return (
            <div className="flex justify-center flex-col items-center min-h-[50vh] gap-4 pt-24">
                <div className="w-10 h-10 rounded-xl bg-surface-high flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-primary text-[24px]">diamond</span>
                </div>
                <p className="label-meta text-on-surface-variant">Loading posts...</p>
            </div>
        );
    }

    return (
        <>
            <div className="pt-24 pb-16 px-6 md:px-12 max-w-[80rem] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(auto,680px)_1fr] gap-8 lg:gap-12 w-full">
                    {/* Left Spacers for exact centering */}
                    <div className="hidden lg:block"></div>

                    {/* Main Feed */}
                    <div className="w-full min-w-0">
                        {/* Hero headline */}
                        <div className="mb-12">
                            <h1 className="text-[2rem] md:text-[2.5rem] font-[800] text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-cinzel)' }}>
                                The Public Square
                            </h1>
                            <p className="text-on-surface-variant text-[15px] max-w-lg mt-2">
                                Welcome to AgoraX. Discuss the ideas that matter.
                            </p>
                        </div>

                        {/* Sort Tabs and Action */}
                        <div className="hidden md:flex flex-wrap items-center justify-between gap-4 mb-10 w-full border-b border-white/5 pb-4">
                            <div className="flex flex-wrap items-center gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2 px-4 sm:px-5 py-2 text-[12px] font-[800] uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer border ${
                                            activeTab === tab.key
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-high/40'
                                        }`}
                                        style={{ borderRadius: '4px' }}
                                    >
                                        <span className={`material-symbols-outlined text-[16px] ${activeTab === tab.key ? 'filled pulse-accent' : ''}`}>
                                            {tab.icon}
                                        </span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            
                            <button
                                onClick={() => navigate('/create')}
                                className="btn-primary btn-pill cta-glow flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-[700] cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Create Post
                            </button>
                        </div>

                        {/* Posts */}
                        <div className="flex flex-col gap-8">
                            {error && (
                                <div className="text-error text-[13px] font-[600] p-4 rounded-xl" style={{ background: 'rgba(255, 180, 171, 0.08)' }}>
                                    {error}
                                </div>
                            )}

                            {posts.length === 0 && !error ? (
                                <div className="card-l2 p-12 text-center flex flex-col items-center gap-4">
                                    <span className="material-symbols-outlined text-[36px] text-outline-variant">forum</span>
                                    <h3 className="text-[1.125rem] font-[700] text-on-surface">No Posts Found</h3>
                                    <p className="text-[0.875rem] text-on-surface-variant">Be the first to start a conversation.</p>
                                </div>
                            ) : (
                                <>
                                    {posts.map((post, index) => (
                                        <PostCard key={`feed-${post.id}`} post={post} index={index} />
                                    ))}

                                    {/* Infinite Scroll Trigger & Load More Status */}
                                    <div className="pt-8 flex justify-center pb-8" ref={lastPostElementRef}>
                                        {loadingMore ? (
                                            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-surface-high/50 text-[13px] text-on-surface-variant">
                                                <span className="material-symbols-outlined text-[18px] animate-spin text-primary">progress_activity</span>
                                                Loading...
                                            </div>
                                        ) : hasMore ? (
                                            // Invisible target for observer when not loading
                                            <div className="h-10 w-full" />
                                        ) : posts.length > 0 ? (
                                            <div className="flex items-center gap-3 px-6 py-3 rounded-full text-[12px] font-[700] text-on-surface-variant uppercase tracking-[0.1em]"
                                                 style={{ background: '#131b2e' }}>
                                                <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></span>
                                                All caught up
                                            </div>
                                        ) : null}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:block w-full">
                        <div className="w-[300px] sticky top-24 self-start space-y-8">
                        <RecentUsersWidget />

                        {/* Footer */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-[10px] opacity-60">© 2026 AgoraX</p>
                            <div className="flex items-center gap-6"></div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
