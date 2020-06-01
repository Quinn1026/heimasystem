const key = "heimasystem_token"

const setToken = token => {
    localStorage.setItem(key, token);
}

const getToken = () => {
    return localStorage.getItem(key);
}

const removeToken = () => {
    localStorage.removeItem(key);
}

// 按需导出
export {
    setToken,
    getToken,
    removeToken
}