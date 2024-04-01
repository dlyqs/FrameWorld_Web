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