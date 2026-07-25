import React, { useState, useEffect } from 'react';
import { commentService } from '../api/services';
import { timeAgo } from '../utils/timeAgo';

export default function CommentItem({ 
    comment, 
    depth = 0, 
    postId,
    user,
    replyingTo,
    setReplyingTo,
    onReplySuccess
}) {
    const [replyContent, setReplyContent] = useState('');
    const isReplying = replyingTo === comment.id;
    const [localComment, setLocalComment] = useState(comment);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => { setLocalComment(comment); }, [comment]);

    const submitReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        try { 
            await commentService.addComment(postId, replyContent, comment.id); 
            setReplyContent(''); 
            setReplyingTo(null); 
            if (onReplySuccess) onReplySuccess();
        } catch (error) { 
            console.error("Reply failed", error);
        }
    };

    const handleVote = async (e, type) => {
        e.stopPropagation();
        const previousComment = { ...localComment };
        
        let newVoteCount = localComment.voteCount || 0;
        let newVoteType = type;

        if (localComment.voteType === type) {
            newVoteType = null;
            newVoteCount += (type === 'downvote' ? 1 : -1);
        } else {
            if (localComment.voteType) {
                newVoteCount += (type === 'upvote' ? 2 : -2);
            } else {
                newVoteCount += (type === 'upvote' ? 1 : -1);
            }
        }
        setLocalComment(prev => ({ ...prev, voteType: newVoteType, voteCount: newVoteCount }));

        try {
            const updated = await commentService.voteOnComment(localComment.id, type);
            let updatedVoteType = updated.voteType;
            if (updatedVoteType === 'null' || updatedVoteType === undefined) updatedVoteType = null;
            setLocalComment(prev => ({ 
                ...prev, 
                ...updated, 
                voteType: updatedVoteType, 
                voteCount: updated.voteCount ?? prev.voteCount, 
                replies: prev.replies, 
                username: prev.username 
            }));
        } catch (error) { 
            console.error("Vote failed", error); 
            setLocalComment(previousComment);
        }
    };

    return (
        <div className={`flex flex-col gap-4 relative ${depth > 0 ? 'ml-5 pl-5' : ''}`}
             style={depth > 0 ? { borderLeft: '2px solid rgba(129, 140, 248, 0.12)' } : {}}>
            {depth > 0 && localComment.replies?.length > 0 && (
                <button onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -left-[9px] top-8 w-4 h-4 bg-canvas rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary z-10 transition-colors cursor-pointer ghost-border text-[10px] font-[700]">
                    {isCollapsed ? '+' : '−'}
                </button>
            )}

            {isCollapsed ? (
                <div className="flex gap-2 items-center py-2 px-4 rounded-xl cursor-pointer hover:bg-surface-high/30 transition-colors w-max" style={{ background: '#131b2e' }} onClick={() => setIsCollapsed(false)}>
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-container to-primary flex items-center justify-center text-canvas text-[9px] font-[800]">
                        {(localComment.username || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-[12px] font-[500] text-on-surface-variant">
                        {localComment.username} · {localComment.replies?.length || 0} replies
                    </span>
                </div>
            ) : (
                <div className="flex gap-3">
                    {/* Vote */}
                    <div className="flex flex-col items-center pt-1 min-w-[28px]">
                        <button onClick={(e) => handleVote(e, 'upvote')}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${
                                localComment.voteType === 'upvote' 
                                ? 'text-white bg-[#818cf8] ring-2 ring-[#818cf8]/50 shadow-[0_0_15px_rgba(129,140,248,0.4)]' 
                                : 'text-on-surface-variant hover:text-[#818cf8] hover:bg-[#818cf8]/10'
                            }`}>
                            <span className={`material-symbols-outlined text-[17px] ${localComment.voteType === 'upvote' ? 'filled' : ''}`}>arrow_upward</span>
                        </button>
                        <span className={`text-[12px] font-[900] my-1 transition-all duration-300 ${
                            localComment.voteType === 'upvote' ? 'text-[#818cf8] scale-110' : localComment.voteType === 'downvote' ? 'text-[#ff5252] scale-110' : 'text-on-surface'
                        }`}>
                            {localComment.voteCount || 0}
                        </span>
                        <button onClick={(e) => handleVote(e, 'downvote')}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${
                                localComment.voteType === 'downvote' 
                                ? 'text-white bg-[#ff5252] ring-2 ring-[#ff5252]/50 shadow-[0_0_15px_rgba(255,82,82,0.4)]' 
                                : 'text-on-surface-variant hover:text-[#ff5252] hover:bg-[#ff5252]/10'
                            }`}>
                            <span className={`material-symbols-outlined text-[17px] ${localComment.voteType === 'downvote' ? 'filled' : ''}`}>arrow_downward</span>
                        </button>
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Author */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-container to-primary flex items-center justify-center text-canvas text-[9px] font-[800]">
                                {(localComment.username || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-[12px] font-[600] text-on-surface">{localComment.username || 'User'}</span>
                            <span className="text-[10px] text-outline-variant">·</span>
                            <span className="label-meta text-[9px] text-outline-variant" style={{ letterSpacing: '0.08em' }}>{timeAgo(localComment.createdAt || localComment.createdDate)}</span>
                        </div>

                        {/* Content */}
                        <div className="text-[14px] text-on-surface-variant whitespace-pre-line break-words leading-[1.7] py-3 px-4 rounded-xl" style={{ background: '#131b2e' }}>
                            {localComment.content}
                        </div>

                        {/* Reply action */}
                        {user && (
                            <button onClick={() => setReplyingTo(isReplying ? null : localComment.id)}
                                className="mt-2 text-[11px] font-[700] text-primary hover:text-primary-container transition-colors cursor-pointer bg-transparent border-none p-0">
                                Reply
                            </button>
                        )}

                        {/* Reply Form */}
                        {isReplying && (
                            <form onSubmit={submitReply} className="mt-3 space-y-2">
                                <textarea className="w-full p-4 obsidian-input rounded-xl text-[14px] leading-[1.6] min-h-[80px] resize-y"
                                    placeholder={`Replying to ${localComment.username}...`}
                                    value={replyContent} onChange={(e) => setReplyContent(e.target.value)} autoFocus />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setReplyingTo(null)}
                                        className="btn-ghost px-4 py-2 text-[12px] font-[600] cursor-pointer" style={{ borderRadius: '0.5rem' }}>Cancel</button>
                                    <button type="submit" disabled={!replyContent.trim()}
                                        className={`btn-primary btn-pill px-5 py-2 text-[12px] ${!replyContent.trim() ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>Reply</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Nested replies */}
            {!isCollapsed && localComment.replies?.length > 0 && (
                <div className="flex flex-col gap-4 mt-1">
                    {localComment.replies.map(reply => (
                        <CommentItem 
                            key={reply.id} 
                            comment={reply} 
                            depth={depth + 1} 
                            postId={postId}
                            user={user}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            onReplySuccess={onReplySuccess}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
