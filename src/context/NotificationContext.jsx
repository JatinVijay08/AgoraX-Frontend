import { createContext, useContext, useEffect, useState } from "react";
import { notificationService } from "../api/services";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState(null);
    const PAGE_SIZE = 10;

    useEffect(() => { // runs only when being mounted
        fetchUnreadCount();
    }, []);

        const fetchNotifications = async () => { // for first page of notifications
            if (isLoading) return; // dont process uncessary request,if one request is still Loading

            setIsLoading(true);

            try {
                const { data } = await notificationService.getNotifications(PAGE_SIZE,null); // first page cursor is null
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
            const { data } = await notificationService.getNotifications(PAGE_SIZE, cursor);
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
            const { data } = await notificationService.getUnreadNotificationCount();
            setUnreadCount(data);
        } catch (error) {
            console.error(error);
        }
        

    }

    const markAllAsRead = () => {
        
    }
    
    const addNotification =  () => {
        
    }

    const resetNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
        setHasMore(true);
        setCursor(null);    
    }

    return (<NotificationContext.Provider value={{ notifications, unreadCount, isLoading, hasMore, cursor , fetchNotifications,loadMore,markAllAsRead,addNotification,resetNotifications}}>
        {children}
    </NotificationContext.Provider>)

};

export const useNotifications = () => useContext(NotificationContext);
