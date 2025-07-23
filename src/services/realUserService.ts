import { ApiService } from './apiService';

export interface User {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  senha: string;
  tipo: 'admin' | 'user';
  ativo: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface NewUser {
  nome: string;
  email: string;
  whatsapp: string;
  senha: string;
  tipo?: 'admin' | 'user';
  ativo?: boolean;
}

export class UserService {
  static async list(): Promise<User[]> {
    return ApiService.getUsers();
  }

  static async findById(id: string): Promise<User | null> {
    try {
      return await ApiService.getUser(id);
    } catch (error) {
      return null;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      return await ApiService.getUserByEmail(email);
    } catch (error) {
      return null;
    }
  }

  static async create(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return ApiService.createUser(userData);
  }

  static async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      return await ApiService.updateUser(id, userData);
    } catch (error) {
      return null;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await ApiService.deleteUser(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getDefaultUserId(): Promise<string> {
    // Buscar usuário admin padrão
    const user = await this.findByEmail('admin@bingo.com');
    return user?.id || 'default-admin-user';
  }
}
