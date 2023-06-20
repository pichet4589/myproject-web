import axios from 'axios'
import config from 'config'

const instance = axios.create({
  baseURL: config.baseURL,
  // timeout: 10000,
  // headers: {'X-Custom-Header': 'foobar'}
})

instance.interceptors.request.use(async (config) => {
  const jwtToken = await localStorage.getItem('token')
  if (jwtToken != null) {
    config.headers = { Authorization: `Bearer ${jwtToken}` }
  }
  return config
})

instance.interceptors.response.use(
  (response) => {
    const status = response.response ? response.response.status : null
    const originalRequest = response.config
    if (status === 401) {
      const refreshToken = localStorage.getItem('refreshtoken')
      return axios
        .get(`${config.authanURL}/refresh_token`, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        })
        .then((refreshRes) => {
          if (refreshRes.data.code === 200) {
            const newToken = refreshRes.data.data.access_token
            const newRefreshToken = refreshRes.data.data.refresh_token
            localStorage.setItem('newToken', newToken)
            localStorage.setItem('newRefreshToken', newRefreshToken)
            instance.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${newToken}` //Add new token
            return instance(originalRequest) //call API
          } else {
            localStorage.clear()
            window.location.href = '/login'
          }
        })
        .catch((err) => {
          localStorage.clear()
          window.location.href = '/login'
        })
    } else {
      return response
    }
  },
  (error) => {
    return error
  }
)
export const httpClient = instance
