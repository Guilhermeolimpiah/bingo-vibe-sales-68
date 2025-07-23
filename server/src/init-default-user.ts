import { db } from './db/connection.js';
import { users } from './db/schema.js';
import { eq } from 'drizzle-orm';

const DEFAULT_USER_EMAIL = 'admin@bingo.com';
const DEFAULT_USER_ID = 'default-admin-user';

export async function createDefaultUser() {
  try {
    // Verificar se já existe
    const [existingUser] = await db.select().from(users).where(eq(users.email, DEFAULT_USER_EMAIL));
    
    if (existingUser) {
      console.log('✅ Usuário padrão já existe:', existingUser.id);
      return existingUser;
    }

    // Criar usuário padrão
    const [newUser] = await db.insert(users).values({
      id: DEFAULT_USER_ID,
      nome: 'Administrador',
      email: DEFAULT_USER_EMAIL,
      whatsapp: '(11) 99999-0000',
      senha: 'admin123', // Em produção, usar hash
      tipo: 'admin',
      ativo: true
    }).returning();

    console.log('✅ Usuário padrão criado:', newUser.id);
    return newUser;
  } catch (error) {
    console.error('❌ Erro ao criar usuário padrão:', error);
    throw error;
  }
}
