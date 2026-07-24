import { useState, useCallback } from 'react';
import { commentService } from '../api/services';

export function useComments(postId) {
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingComments, setLoadingComments] = useState(true);

    const fetchComments = useCallback(async (page = currentPage) => {
        try {
            setLoadingComments(true);
            const data = await commentService.getCommentsByPostId(postId, page, 50);
            const flatComments = data.content || [];
            
            const commentMap = {};
            const rootComments = [];
            
            // First pass: initialize replies array and map
            flatComments.forEach(c => { 
                c.replies = []; 
                commentMap[c.id] = c; 
            });
            
            // Second pass: build the tree
            flatComments.forEach(c => {
                if (c.parentComment && c.parentComment !== 'null' && c.parentComment !== 0) {
                    const parent = commentMap[c.parentComment];
                    if (parent) parent.replies.push(c);
                    else rootComments.push(c);
                } else {
                    rootComments.push(c);
                }
            });
            
            setComments(rootComments);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.number || page);
        } catch (error) { 
            console.error("Failed to load comments", error); 
            setComments([]); 
        } finally { 
            setLoadingComments(false); 
        }
    }, [postId, currentPage]);

    const handlePageChange = useCallback((newPage) => { 
        if (newPage >= 0 && newPage < totalPages) {
            fetchComments(newPage); 
        }
    }, [fetchComments, totalPages]);

    return {
        comments,
        currentPage,
        totalPages,
        loadingComments,
        fetchComments,
        handlePageChange
    };
}
