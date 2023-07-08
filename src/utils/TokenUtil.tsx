const TokenUtil = {
    getApiToken: () => {
        return localStorage.getItem('api_token')
    }
}

export default TokenUtil