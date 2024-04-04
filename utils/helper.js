import {setUserStorage} from "./localStorage";

export const getDefaultConversationData = () => {
    return {
        id: null,
        topic: null,
        messages: [],
        loadingMessages: false,
    }
}

export const getConversations = async () => {
    const { data, error } = await useAuthFetch('/api/chat/conversations/')
    if (!error.value) {
        return data.value
    }
    return []
}

export const addConversation = (conversation) => {
    const conversations = useConversations()
    conversations.value = [conversation, ...conversations.value]
}


export const genTitle = async (conversationId, sourcePage) => {
    const openaiApiKey = useApiKey();
    const runtimeConfig = useRuntimeConfig();
    const { data, error } = await useAuthFetch('/api/gen_title/', {
        method: 'POST',
        body: JSON.stringify({
            conversationId: conversationId,
            prompt: 'Generate a title for this conversation', // Assuming a generic prompt for title generation
            openaiApiKey: runtimeConfig.public.customApiKey ? openaiApiKey.value : null,
            source_page: sourcePage,
        })
    });
    if (!error.value) {
        const conversations = useConversations();
        let index = conversations.value.findIndex(item => item.id === conversationId);
        if (index === -1) {
            index = 0;
        }
        conversations.value[index].topic = data.value.title;
        return data.value.title;
    }
    return null;
};

export const fetchUser = async () => {
    return useMyFetch('/api/account/user/');
};

export const setUser = (userData) => {
    const user = useUser();
    user.value = userData;
};

export const logout = async () => {
    const user = useUser();
    user.value = null;
    setUserStorage(null);
    await navigateTo('/account/signin');
};