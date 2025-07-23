import { UserService } from './realUserService';

const DEFAULT_USER_EMAIL = 'admin@bingo.com';
const DEFAULT_USER_ID = 'default-admin-user';

export async function getOrCreateDefaultUser() {
  try {
    // Tentar encontrar usuário existente
    let user = await UserService.findByEmail(DEFAULT_USER_EMAIL);
    
    if (!user) {
      console.log('Criando usuário padrão...');
      // Criar usuário padrão se não existir
      user = await UserService.create({
        nome: 'Administrador',
        email: DEFAULT_USER_EMAIL,
        whatsapp: '(11) 99999-0000',
        senha: 'admin123', // Em produção, usar hash apropriado
        tipo: 'admin'
      });
      console.log('Usuário padrão criado:', user.id);
    }
    
    return user;
  } catch (error) {
    console.error('Erro ao criar/obter usuário padrão:', error);
    throw error;
  }
}

export function getDefaultUserId(): string {
  // Retornar o ID fixo que será criado pela API
  return DEFAULT_USER_ID;
}

export async function getDefaultUserIdAsync(): Promise<string> {
  try {
    return await UserService.getDefaultUserId();
  } catch (error) {
    console.error('Erro ao obter ID do usuário padrão:', error);
    return DEFAULT_USER_ID;
  }
}