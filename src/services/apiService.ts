// Serviço para consumir a API REST
const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private static async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ========================================
  // 🏥 HEALTH CHECK
  // ========================================
  static async healthCheck() {
    const response = await fetch('http://localhost:3001/health');
    if (!response.ok) throw new Error('API não disponível');
    return response.json();
  }

  // ========================================
  // 🎯 BINGOS
  // ========================================
  static async getBingos() {
    return this.request('/bingos');
  }

  static async getBingo(id: string) {
    return this.request(`/bingos/${id}`);
  }

  static async createBingo(bingoData: any) {
    return this.request('/bingos', {
      method: 'POST',
      body: JSON.stringify(bingoData),
    });
  }

  static async updateBingo(id: string, bingoData: any) {
    return this.request(`/bingos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bingoData),
    });
  }

  static async deleteBingo(id: string) {
    return this.request(`/bingos/${id}`, {
      method: 'DELETE',
    });
  }

  // ========================================
  // 👥 VENDEDORES
  // ========================================
  static async getVendedores() {
    return this.request('/vendedores');
  }

  static async createVendedor(vendedorData: any) {
    return this.request('/vendedores', {
      method: 'POST',
      body: JSON.stringify(vendedorData),
    });
  }

  static async updateVendedor(id: string, vendedorData: any) {
    return this.request(`/vendedores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendedorData),
    });
  }

  // ========================================
  // 📦 PEDIDOS
  // ========================================
  static async getPedidos() {
    return this.request('/pedidos');
  }

  static async createPedido(pedidoData: any) {
    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedidoData),
    });
  }

  static async updatePedido(id: string, pedidoData: any) {
    return this.request(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pedidoData),
    });
  }

  // ========================================
  // USUÁRIOS
  // ========================================
  static async getUsers() {
    return this.request('/users');
  }

  static async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  static async getUserByEmail(email: string) {
    return this.request(`/users/email/${email}`);
  }

  static async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  static async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export { ApiService };