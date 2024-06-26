// 管理和返回API密钥的状态。
export const useCurrentModel = () => useState('currentModel', () => getCurrentModel())
export const useApiKey = () => useState('apiKey', () => getStoredApiKey())
// 管理用户会话列表的状态。
export const useConversations = () => useState('conversations', () => [])
// 管理当前用户信息的状态。
export const useUser = () => useState('user', () => null)
// 控制侧边栏的显示状态。
export const useDrawer = () => useState('drawer', () => false)
// 管理当前正在查看的条目的ID状态。
export const useEntryId = () => useState('entryId', () => 1);
