
// export const useModels = () => useState('models', () => getStoredModels())

export const useCurrentModel = () => useState('currentModel', () => getCurrentModel())

export const useApiKey = () => useState('apiKey', () => getStoredApiKey())

export const useConversations = () => useState('conversations', () => [])

export const useUser = () => useState('user', () => null)

export const useDrawer = () => useState('drawer', () => false)


export const useActiveConversation = () => useState('activeConversation', () => ({ id: null, sourcePage: null }));

export const setActiveConversationId = (id) => {
    const conversation = useActiveConversation();
    conversation.value.id = id;
};

export const getActiveConversationId = () => {
    const conversation = useActiveConversation();
    return conversation.value.id;
};
