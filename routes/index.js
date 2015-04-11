import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

router.use('/users', userRoutes);

router.get('/', (req, res) => {
  res.status(200);
  res.json({
    version: 'v1',
    description: 'Sidehack API Version 1.0'
  });
  res.end();
});

export default router;
