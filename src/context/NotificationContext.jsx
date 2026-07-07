import { createContext, useContext, useEffect, useState } from "react";
import { notificationService } from "../api/services";
import { useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "./AuthContext";


const getWebSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
    return apiUrl.replace(/^http/, 'ws').replace(/\/api\/?$/, '/ws');
};

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const clientRef = useRef(null); // for storing client state for WebSocket
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState(null);
    const PAGE_SIZE = 10;

    useEffect(() => { // runs only when being mounted
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            setHasMore(true);
            setCursor(null);
            return;
        }

        fetchUnreadCount();
    }, [user]);

    useEffect(() => {
         // WebSocket connection triggers when user state changes
        if (!user) return; // if user is null do nothing

        const connect = () => {
            const client = new Client({
                brokerURL: getWebSocketUrl(),
                reconnectDelay: 5000,
                beforeConnect: () => {
                    const currentToken = localStorage.getItem('token');
                    client.connectHeaders = {
                        Authorization: `Bearer ${currentToken}`
                    };
                },
                onConnect: () => {
                    console.log('Connected!'); 
                    client.subscribe("/user/queue/notifications",
                        (message) => {
                            console.log("WEBSOCKET MSG RECEIVED!");
                            const notification = JSON.parse(message.body);
                            addNotification(notification);
                            
                            const senderName = notification.creatorName || 'Someone';
                            let actionText = 'interacted with your content.';
                            switch (notification.notificationType) {
                                case 'POST_COMMENT': actionText = 'commented on your post.'; break;
                                case 'POST_LIKE': actionText = 'liked your post.'; break;
                                case 'COMMENT_REPLY': actionText = 'replied to your comment.'; break;
                            }
                            let linkTo = null;
                            if (notification.postId) {
                                linkTo = `/post/${notification.postId}`;
                                if (notification.commentId) {
                                    linkTo += `#comment-${notification.commentId}`;
                                }
                            }
                            
                            window.dispatchEvent(new CustomEvent('app-toast', {
                                detail: {
                                    title: 'New Notification',
                                    message: `${senderName} ${actionText}`,
                                    type: 'info',
                                    duration: 6000,
                                    linkTo: linkTo
                                }
                            }));
                    })
                 }
            }); // making a client object for connection
            
            clientRef.current = client; // storing that client in a Reference so its not lost upon re-render
            client.activate();

        };

        connect(); // calling the connect method

        return () => {
            clientRef.current?.deactivate();
            clientRef.current = null;
        }

        
    },[user])


        const fetchNotifications = async () => { // for first page of notifications
            if (isLoading) return; // dont process uncessary request,if one request is still Loading

            setIsLoading(true);

            try {
                const  data  = await notificationService.getNotifications(PAGE_SIZE,null); // first page cursor is null
                    setNotifications(data.list);        
                    setHasMore(data.hasMore);
                    setCursor(data.cursor);
            } catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
                
    }
    

    const loadMore = async () => {
        if (isLoading) return;
        
        if (!hasMore) return;

        setIsLoading(true);

        try {
            const data  = await notificationService.getNotifications(PAGE_SIZE, cursor);
            setNotifications(prev => [...prev, ...data.list]);
            setCursor(data.cursor);
            setHasMore(data.hasMore);
        }
        catch (error) {
            console.error(error);
            
        }
        finally {
            setIsLoading(false);
        }
        
    }

    const fetchUnreadCount = async () => {

        try {
            const  data  = await notificationService.getUnreadNotificationCount();
            setUnreadCount(data);
        } catch (error) {
            console.error(error);
        }
        

    }

    const markAllAsRead = async () => {
        const previousUnreadCount = unreadCount;

        setUnreadCount(0);

        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(notification => ({
                ...notification,read:true
            })))
        }
        catch (error) {
            setUnreadCount(previousUnreadCount);
        }

    }
    
    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
    }

    const resetNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
        setHasMore(true);
        setCursor(null);    
    }

    return (<NotificationContext.Provider value={{ notifications, unreadCount, isLoading, hasMore, cursor , fetchNotifications,loadMore,markAllAsRead,addNotification,resetNotifications,fetchUnreadCount}}>
        {children}
    </NotificationContext.Provider>)

};

export const useNotifications = () => useContext(NotificationContext);
