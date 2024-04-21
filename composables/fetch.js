import {get, set} from '~/utils/localStorage';

// useMyFetch: 用于执行API请求的自定义Hook。接受URL和选项，自动添加默认请求头。
export const useMyFetch = (url, options = {}) => {
    let defaultOptions = {
        headers: {
            Accept: 'application/json'
        }
    }
    if (process.server) {
        defaultOptions.baseURL = process.env.SERVER_DOMAIN
    }
    return useFetch(url, Object.assign(defaultOptions, options))
}

// useAuthFetch: 带身份验证的API请求。如果身份验证失败（401错误），则自动注销。
export const useAuthFetch = async (url, options = {}) => {
    const res = await useMyFetch(url, options)
    if (res.error.value && res.error.value.status === 401) {
        await logout()
    }
    return res
}

export function useUserInfo() {
    const userInfo = ref(getLocalStorageUser() || null);
    const error = ref(null);

    async function fetchUserInfo(userId) {
        if (userInfo.value && userInfo.value.id === userId) {
            return;  // 如果本地已有数据且用户ID匹配，则不重新获取
        }
        const { data, error: fetchError } = await useFetch(`/api/account/userinfo/${userId}/`);

        if (fetchError.value) {
            console.error('Failed to fetch userinfo:', fetchError.value);
            error.value = fetchError.value;
        } else {
            userInfo.value = data.value;
            setLocalStorageUser(data.value);  // 将用户信息存储到本地存储
        }
    }

    return {
        userInfo,
        error,
        fetchUserInfo
    };
}

export function useDeleteComment(isFrameComment = false) {
    const deleteComment = async (commentId) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            try {
                const url = isFrameComment ? `/api/frameworld/frame_comments/${commentId}/delete_frame_comment/` : `/api/frameworld/global_comments/${commentId}/delete_global_comment/`;
                await useFetch(url, {
                    method: 'DELETE'
                });
                return true;

            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('Failed to delete the comment');
                return false;
            }
        }
        return false;
    };
    return {
        deleteComment
    };
}

export function useFetchUsername() {
    const fetchUsername = async (userId, setUsername) => {
        if (userId) {
            const { data, error } = await useFetch(`/api/account/user/${userId}`);
            if (!error.value && data.value && data.value.username) {
                setUsername(data.value.username);
                set(STORAGE_KEY.USERNAME, data.value.username);
            } else {
                console.error('Failed to fetch user:', error.value);
            }
        }
    };

    return { fetchUsername };
}

export function useCommentLike(commentId, userId, localPopularity, isFrameComment = false) {
    const userHasLiked = ref(false);
    const recordId = ref('');
    const storageKey = isFrameComment ? STORAGE_KEY.USER_FRAME_LIKE_STATUS : STORAGE_KEY.USER_LIKE_STATUS;
    const url = isFrameComment ? `/api/frameworld/frame_like_records/` : `/api/frameworld/like_records/`;

    const fetchLikeStatus = async () => {
        let status = get(storageKey);
        if (status && status.commentId === commentId) {
            userHasLiked.value = status.userHasLiked;
            recordId.value = status.recordId;
        } else {
            const { data, error } = await useFetch(`${url}?comment=${commentId}&user=${userId}`);
            if (!error.value && data.value.length > 0) {
                userHasLiked.value = data.value[0].status;
                recordId.value = data.value[0].id;
            } else {
                userHasLiked.value = false;
                recordId.value = '';
            }
            set(storageKey, {
                commentId,
                userHasLiked: userHasLiked.value,
                recordId: recordId.value
            });
        }
    };

    const toggleLike = async () => {
        const delta = userHasLiked.value ? -1 : 1;
        const newPopularity = localPopularity.value + delta;

        const commentUpdateUrl = isFrameComment ? `/api/frameworld/frame_comments/${commentId}/` : `/api/frameworld/global_comments/${commentId}/`;
        try {
            await useFetch(commentUpdateUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ popularity: newPopularity })
            });

            userHasLiked.value = !userHasLiked.value;

            const { data, error } = await useFetch(`${url}handle-like/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    comment: commentId,
                    user: userId,
                    status: userHasLiked.value
                })
            });

            if (error) {
                throw new Error('Failed to update like record');
            }

            if (data && data.id) {
                recordId.value = data.id;
            }

            set(storageKey, {
                commentId,
                userHasLiked: userHasLiked.value,
                recordId: recordId.value
            });
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };

    return {
        userHasLiked,
        fetchLikeStatus,
        toggleLike
    };
}

export function useAddComment(isFrame = false) {
    const isSubmitting = ref(false);
    const errorMessage = ref('');

    const addComment = async ({ entryId, content, parentID = "", replies = "", userID, timestamp = "", x_position = "", y_position = "" }) => {
        isSubmitting.value = true;
        errorMessage.value = '';

        if (!content.trim()) {
            errorMessage.value = "评论内容不能为空！";
            alert(errorMessage.value);
            isSubmitting.value = false;
            return null;
        }

        const commentData = isFrame ? {
            entry: entryId,
            time: new Date().toISOString(),
            timestamp: timestamp,
            content: content,
            replies: replies,
            popularity: 0,
            user: userID,
            x_position:x_position,
            y_position:y_position
        } : {
            entry: entryId,
            time: new Date().toISOString(),
            content: content,
            parentID: parentID,
            replies: replies,
            popularity: 0,
            user: userID
        };

        const url = isFrame ? '/api/frameworld/frame_comments/' : '/api/frameworld/global_comments/';

        try {
            const { data, error } = await useFetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData)
            });

            if (error.value) {
                errorMessage.value = 'Failed to add comment: ' + error.value;
                console.error('Error adding comment:', error.value);
                alert(errorMessage.value);
            } else if (data.value) {
                alert('评论发布成功！');
                isSubmitting.value = false;
                return data.value; // Assuming data.value contains the new comment data
            }
        } catch (error) {
            errorMessage.value = 'Failed to add comment: ' + error.message;
            console.error('Error adding comment:', error);
        } finally {
            isSubmitting.value = false;
        }
        return null;
    };
    return { addComment, isSubmitting, errorMessage };
}