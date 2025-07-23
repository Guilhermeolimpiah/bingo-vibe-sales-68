import { Router } from 'express';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const userRoutes = Router();

// GET /api/users - Listar todos os usuários
userRoutes.get('/', async (req, res) => {
  try {
    const result = await db.select().from(users).where(eq(users.ativo, true));
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/users/:id - Buscar usuário por ID
userRoutes.get('/:id', async (req, res) => {
  try {
    const [result] = await db.select().from(users).where(eq(users.id, req.params.id));
    if (!result) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/users/email/:email - Buscar usuário por email
userRoutes.get('/email/:email', async (req, res) => {
  try {
    const [result] = await db.select().from(users).where(eq(users.email, req.params.email));
    if (!result) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/users - Criar novo usuário
userRoutes.post('/', async (req, res) => {
  try {
    const [result] = await db.insert(users).values(req.body).returning();
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/users/:id - Atualizar usuário
userRoutes.put('/:id', async (req, res) => {
  try {
    const [result] = await db
      .update(users)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(users.id, req.params.id))
      .returning();
    
    if (!result) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(result);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/users/:id - Deletar usuário (soft delete)
userRoutes.delete('/:id', async (req, res) => {
  try {
    const [result] = await db
      .update(users)
      .set({ ativo: false, updatedAt: new Date() })
      .where(eq(users.id, req.params.id))
      .returning();
    
    if (!result) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ message: 'Usuário desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
