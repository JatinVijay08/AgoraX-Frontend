import { useState, useEffect } from 'react';
import api from '../api/axios';

export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [cursor, setCursor] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState('new');

    const fetchPosts = async (currentCursor = null, isLoadMore = false) => {
        if (!isLoadMore) { setLoading(true); setError(''); }
        else { setLoadingMore(true); }

        try {
            const params = { sort: activeTab, limit: 10 };
            if (activeTab === 'new') {
                if (isLoadMore && currentCursor) params.cursor = currentCursor;
            } else {
                params.page = isLoadMore ? page + 1 : 0;
            }

            const response = await api.get('/posts', { params });
            const data = response.data;

            let fetchedPosts = [];
            let nextCursorResult = null;
            let hasMoreResult = false;

            if (Array.isArray(data)) {
                fetchedPosts = data;
            } else if (data.content) {
                fetchedPosts = data.content;
                hasMoreResult = !data.last;
            } else {
                fetchedPosts = data.posts || [];
                nextCursorResult = data.nextCursor || null;
                hasMoreResult = data.hasMore || false;
            }

            if (isLoadMore) {
                setPosts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    return [...prev, ...fetchedPosts.filter(p => !existingIds.has(p.id))];
                });
            } else {
                setPosts(fetchedPosts);
            }

            if (activeTab !== 'new') {
                if (isLoadMore) setPage(prev => prev + 1);
                else setPage(0);
            }

            setCursor(nextCursorResult);
            setHasMore(hasMoreResult);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
            if (!isLoadMore) setPosts([]);
            setError(err.response ? `Failed to load: ${err.response.status}` : err.request ? 'Network Error' : err.message);
            setHasMore(false);
        } finally {
            if (!isLoadMore) setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => { fetchPosts(null, false); }, [activeTab]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            if (activeTab === 'new' && !cursor) return;
            fetchPosts(cursor, true);
        }
    };

    return {
        posts,
        loading,
        loadingMore,
        error,
        hasMore,
        activeTab,
        setActiveTab,
        handleLoadMore
    };
}
