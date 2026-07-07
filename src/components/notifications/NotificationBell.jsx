import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { unreadCount } = useNotifications();
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative flex items-center" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-high/30 transition-colors duration-200 cursor-pointer"
                aria-label="Notifications"
            >
                <span className="material-symbols-outlined text-[20px]">
                    {unreadCount > 0 ? 'notifications_active' : 'notifications'}
                </span>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-canvas border border-surface-low">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>
            <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
