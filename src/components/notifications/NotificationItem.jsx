import React from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../../utils/timeAgo';

export default function NotificationItem({ notification, onClose }) {
    const { 
        creatorName, 
        notificationType, 
        createdAt, 
        read, 
        postId, 
        commentId 
    } = notification;
    
    const senderName = creatorName || 'Someone';
    
    const getNotificationText = () => {
        switch (notificationType) {
            case 'POST_COMMENT': return 'commented on your post.';
            case 'POST_LIKE': return 'liked your post.';
            case 'COMMENT_REPLY': return 'replied to your comment.';
            default: return 'interacted with your content.';
        }
    };

    // Determine navigation link based on available IDs
    // Post route is /post/:id
    let linkTo = '#';
    if (postId) {
        linkTo = `/post/${postId}`;
        if (commentId) {
            linkTo += `#comment-${commentId}`;
        }
    }

    return (
        <Link 
            to={linkTo}
            onClick={onClose}
            className={`block p-4 border-b border-outline-variant/20 hover:bg-surface-highest transition-colors ${!read ? 'bg-surface-high/50' : ''}`}
        >
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-primary flex-shrink-0 flex items-center justify-center text-canvas font-[800] text-[12px]">
                    {senderName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-on-surface break-words">
                        <span className="font-[700] mr-1">{senderName}</span>
                        <span className="text-on-surface-variant">{getNotificationText()}</span>
                    </p>
                    {createdAt && (
                        <p className="text-[12px] text-on-surface-variant mt-1">
                            {timeAgo(createdAt)}
                        </p>
                    )}
                </div>
                {!read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                )}
            </div>
        </Link>
    );
}
