import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postService } from '../api/services';

export function usePosts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [cursor, setCursor] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    
    // Read activeTab from URL, default to 'new'
    const activeTab = searchParams.get('sort') || 'new';

    const setActiveTab = (tab) => {
        setSearchParams({ sort: tab });
    };

    const fetchPosts = async (currentCursor = null, isLoadMore = false) => {
        if (!isLoadMore) { setLoading(true); setError(''); }
        else { setLoadingMore(true); }

        try {
            const fetchPage = isLoadMore ? page + 1 : 0;
            const data = await postService.getAllPosts(activeTab, 10, currentCursor, fetchPage);

            const fetchedPosts = data.posts || [];
            const nextCursorResult = data.nextCursor || null;
            const hasMoreResult = data.hasMore || false;

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
