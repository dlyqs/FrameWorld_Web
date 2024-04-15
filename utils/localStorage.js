
const get = (key) => {
    if (process.server) return
    let val = localStorage.getItem(key)
    if (val) {
        val = JSON.parse(val)
    }
    return val
}

const set = (key, val) => {
    if (process.server) return
    localStorage.setItem(key, JSON.stringify(val))
}

export const setModels = (val) => {
    const models = useModels()
    set(STORAGE_KEY.MODELS, val)
    models.value = val
}

export const saveCurrentModel = (val) => {
    set(STORAGE_KEY.CURRENT_MODEL, val)
}

export const getCurrentModel = () => {
    let model = get(STORAGE_KEY.CURRENT_MODEL)
    if (!model) {
        model = MODELS[DEFAULT_MODEL_NAME]
    }
    return model
}

export const setApiKey = (val) => {
    const apiKey = useApiKey()
    set(STORAGE_KEY.OPENAI_API_KEY, val)
    apiKey.value = val
}

export const getStoredApiKey = () => {
    return get(STORAGE_KEY.OPENAI_API_KEY)
}

export const getUser = () => get(STORAGE_KEY.USER);

export const setUserStorage = (val) => set(STORAGE_KEY.USER, val);

export const setSearchResults = (query, results) => {
    set(STORAGE_KEY.SEARCH_RESULTS, { query, results });
}

export const getSearchResults = (query) => {
    const storedResults = get(STORAGE_KEY.SEARCH_RESULTS);
    if (storedResults && storedResults.query === query) {
        return storedResults.results;
    }
    return null; // 如果没有找到匹配的搜索结果或者query不匹配，返回null
}