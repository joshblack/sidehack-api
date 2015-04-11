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
});

router.get('*', (req, res) => {
  res.status(404);
  res.json({
    status: 404,
    message: 'GET request for this route is not supported'
  });
});

router.post('*', (req, res) => {
  res.status(404);
  res.json({
    status: 404,
    message: 'POST request for this route is not supported'
  });
});

router.put('*', (req, res) => {
  res.status(404);
  res.json({
    status: 404,
    message: 'PUT request for this route is not supported'
  });
});

router.patch('*', (req, res) => {
  res.status(404);
  res.json({
    status: 404,
    message: 'PATCH request for this route is not supported'
  });
});

router.delete('*', (req, res) => {
  res.status(404);
  res.json({
    status: 404,
    message: 'DELETE request for this route is not supported'
  });
});

router.all('*', (req, res) => {
  res.status(404);
  res.json({
    status: 404,
    message: 'The request made for this route is not supported'
  });
});

export default router;
