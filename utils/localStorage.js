
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

export const setApiKey = (val) => {
    const apiKey = useApiKey()
    set(STORAGE_KEY.OPENAI_API_KEY, val)
    apiKey.value = val
}

export const getStoredApiKey = () => {
    return get(STORAGE_KEY.OPENAI_API_KEY)
}