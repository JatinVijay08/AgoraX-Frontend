import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';

export default function NotificationDropdown({ isOpen, onClose }) {
    const {
        notifications,
        unreadCount,
        isLoading,
        hasMore,
        fetchNotifications,
        loadMore,
        markAllAsRead
    } = useNotifications();

    const hasFetched = useRef(false);

    // Fetch initial notifications when opened (if not already fetched)
    useEffect(() => {
        if (isOpen && !hasFetched.current) {
            fetchNotifications();
            hasFetched.current = true;
        }
    }, [isOpen, fetchNotifications]);

    // Mark as read when opened
    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            markAllAsRead();
        }
    }, [isOpen, unreadCount, markAllAsRead]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // Check if scrolled to bottom (within 10px margin)
        if (scrollHeight - scrollTop <= clientHeight + 10) {
            if (hasMore && !isLoading) {
                loadMore();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-x-0 top-16 mx-auto w-[92vw] max-w-[400px] md:absolute md:inset-auto md:top-12 md:right-0 md:w-80 md:mx-0 max-h-[80vh] md:max-h-96 bg-surface-high border border-outline-variant/30 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-highest">
                <h3 className="font-[700] text-[16px] text-on-surface">Notifications</h3>
            </div>
            
            <div 
                className="flex-1 overflow-y-auto"
                onScroll={handleScroll}
            >
                {notifications.length === 0 && !isLoading && (
                    <div className="p-8 text-center text-on-surface-variant text-[14px]">
                        No notifications yet.
                    </div>
                )}
                
                {notifications.map((notif, index) => (
                    <NotificationItem key={index} notification={notif} onClose={onClose} />
                ))}

                {isLoading && (
                    <div className="p-4 flex justify-center">
                        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                    </div>
                )}
                
                {!hasMore && notifications.length > 0 && (
                    <div className="p-3 text-center text-[12px] text-on-surface-variant">
                        End of notifications
                    </div>
                )}
            </div>
        </div>
    );
}
