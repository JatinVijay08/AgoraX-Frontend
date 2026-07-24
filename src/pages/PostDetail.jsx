import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService, commentService } from '../api/services';
import PostCard from '../components/PostCard';
import CommentItem from '../components/CommentItem';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);
    const [showComments, setShowComments] = useState(true);
    const [showAddCommentForm, setShowAddCommentForm] = useState(false);

    useEffect(() => { fetchPost(); if (showComments) fetchComments(0); }, [id]);

    const fetchPost = async () => {
        try { setPost(await postService.getPostById(id)); }
        catch (error) { console.error("Failed to load post", error); }
        finally { setLoading(false); }
    };

    const fetchComments = async (page = currentPage) => {
        try {
            setLoadingComments(true);
            const data = await commentService.getCommentsByPostId(id, page, 50);
            const flatComments = data.content || [];
            const commentMap = {};
            const rootComments = [];
            flatComments.forEach(c => { c.replies = []; commentMap[c.id] = c; });
            flatComments.forEach(c => {
                if (c.parentComment && c.parentComment !== 'null' && c.parentComment !== 0) {
                    const parent = commentMap[c.parentComment];
                    if (parent) parent.replies.push(c);
                    else rootComments.push(c);
                } else rootComments.push(c);
            });
            setComments(rootComments);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.number || page);
        } catch (error) { console.error("Failed to load comments", error); setComments([]); }
        finally { setLoadingComments(false); }
    };

    const handlePageChange = (newPage) => { if (newPage >= 0 && newPage < totalPages) fetchComments(newPage); };
    const handleCommentToggle = () => { const next = !showComments; setShowComments(next); if (next && comments.length === 0) fetchComments(0); };

    const handleCommentSubmit = async (e, parentId = null) => {
        e?.preventDefault();
        if (!newComment.trim()) return;
        try { await commentService.addComment(id, newComment, parentId); setNewComment(''); setReplyingTo(null); fetchComments(0); fetchPost(); }
        catch (error) { /* handled globally */ }
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] pt-24">
                <span className="material-symbols-outlined text-primary text-[32px] animate-pulse">diamond</span>
            </div>
        );
    }

    if (!post) return <div className="text-center py-16 text-on-surface-variant pt-24">Post not found</div>;

    return (
        <div className="max-w-[720px] mx-auto pt-24 pb-16 px-8">
            <button onClick={() => navigate('/')}
                className="btn-ghost btn-pill flex items-center gap-2 px-5 py-2.5 text-[12px] font-[700] text-on-surface-variant hover:text-on-surface mb-8 cursor-pointer uppercase tracking-[0.1em]">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Feed
            </button>

            <PostCard post={post} isDetail={true} onCommentClick={handleCommentToggle} />

            {/* Comments */}
            {showComments && (
                <div className="mt-12">
                    <h3 className="text-[1.125rem] font-[700] text-on-surface mb-8 flex items-center gap-3">
                        <span className="label-meta text-primary text-[11px] px-3 py-1 rounded-full" style={{ background: 'rgba(189, 194, 255, 0.1)' }}>
                            {post.totalCommentCount ?? post.commentCount ?? comments.length}
                        </span>
                        Discussion
                    </h3>

                    {/* Comment Input */}
                    {user ? (
                        <div className="mb-10">
                            {!showAddCommentForm ? (
                                <button onClick={() => setShowAddCommentForm(true)}
                                    className="w-full flex items-center gap-3 p-5 rounded-xl text-[14px] font-[500] text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors"
                                    style={{ background: '#131b2e' }}>
                                    <span className="material-symbols-outlined text-[18px] text-primary">chat_bubble</span>
                                    Share your thoughts...
                                </button>
                            ) : (
                                <form onSubmit={handleCommentSubmit} className="space-y-3">
                                    <textarea className="w-full p-5 obsidian-input rounded-xl text-[14px] leading-[1.7] min-h-[120px] resize-y"
                                        placeholder="What are your thoughts?" value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)} autoFocus />
                                    <div className="flex justify-end gap-3">
                                        <button type="button" onClick={() => setShowAddCommentForm(false)}
                                            className="btn-ghost px-5 py-2.5 text-[13px] font-[600] cursor-pointer" style={{ borderRadius: '0.5rem' }}>Cancel</button>
                                        <button type="submit" disabled={!newComment.trim()}
                                            className={`btn-primary btn-pill px-6 py-2.5 text-[13px] flex items-center gap-2 ${!newComment.trim() ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                                            <span className="material-symbols-outlined text-[16px]">send</span>
                                            Publish
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="card-l2 p-8 text-center mb-10 flex flex-col items-center" style={{ borderRadius: '1.5rem' }}>
                            <h4 className="text-on-surface text-[1rem] font-[700] mb-2">Join the Discussion</h4>
                            <p className="text-on-surface-variant text-[13px] mb-6 max-w-sm">Sign in to leave a comment, vote, and curate the collective.</p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <button onClick={() => navigate('/login')} className="btn-secondary btn-pill px-6 py-2.5 text-[13px] cursor-pointer">Sign In</button>
                                <button onClick={() => navigate('/register')} className="btn-primary btn-pill px-6 py-2.5 text-[13px] cursor-pointer">Join Forum</button>
                            </div>
                        </div>
                    )}

                    {/* Comment List */}
                    {loadingComments ? (
                        <div className="flex justify-center py-8">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {comments.length === 0 ? (
                                <p className="text-on-surface-variant text-center text-[14px] py-8">No comments yet. Begin the discourse.</p>
                            ) : (
                                <>
                                    {comments.map(comment => (
                                        <CommentItem 
                                            key={comment.id} 
                                            comment={comment} 
                                            postId={id}
                                            user={user}
                                            replyingTo={replyingTo}
                                            setReplyingTo={setReplyingTo}
                                            onReplySuccess={() => { fetchComments(0); fetchPost(); }}
                                        />
                                    ))}

                                    {totalPages > 1 && (
                                        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-8 pt-6" style={{ borderTop: '1px solid rgba(69, 70, 83, 0.15)' }}>
                                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}
                                                className="btn-ghost px-3 py-1.5 text-[12px] font-[700] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" style={{ borderRadius: '0.5rem' }}>
                                                Previous
                                            </button>
                                            <div className="flex gap-1">
                                                {[...Array(totalPages)].map((_, i) => {
                                                    if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                                                        return (
                                                            <button key={i} onClick={() => handlePageChange(i)}
                                                                className={`min-w-[32px] h-[32px] flex items-center justify-center text-[12px] font-[700] rounded-md cursor-pointer transition-all ${
                                                                    currentPage === i ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-high/30'
                                                                }`}>
                                                                {i + 1}
                                                            </button>
                                                        );
                                                    } else if (i === currentPage - 2 || i === currentPage + 2) {
                                                        return <span key={i} className="text-outline-variant text-[12px] self-end pb-1 px-1">…</span>;
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}
                                                className="btn-ghost px-3 py-1.5 text-[12px] font-[700] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" style={{ borderRadius: '0.5rem' }}>
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
