import axios from 'axios'

// Criação da instância do axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    // Tratamento global de erros
    console.error('Erro na requisição:', error)
    
    // Retorna uma Promise rejeitada para que o erro seja tratado no componente
    return Promise.reject(error)
  }
)

export default api