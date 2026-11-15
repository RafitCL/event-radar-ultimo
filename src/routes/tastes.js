import express from 'express';
import {
  getCategories,
  getUserTastes,
  setUserTastes
} from '../services/catalog.js';

const router = express.Router();

router.get('/categories', async (req, res) => {
  try {
    const categories = await getCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'No se pudieron cargar las categorías.' } });
  }
});

router.get('/tastes', async (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Debes iniciar sesión.' } });
  }

  try {
    const tastes = await getUserTastes(userId);
    res.json({ tastes });
  } catch (error) {
    console.error('Tastes error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'No se pudieron cargar los gustos.' } });
  }
});

router.post('/tastes', async (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Debes iniciar sesión.' } });
  }

  const categories = Array.isArray(req.body?.categories) ? req.body.categories : [];
  try {
    const tastes = await setUserTastes(userId, categories);
    res.json({ ok: true, tastes });
  } catch (error) {
    console.error('Save tastes error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'No se pudieron guardar los gustos.' } });
  }
});

export default router;
