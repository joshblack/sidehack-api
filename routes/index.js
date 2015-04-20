import { Router } from 'express';
import users from './users';
import projects from './projects';

const router = Router();

router.use('/users', users);
router.use('/projects', projects);

router.get('/me', (req, res) => {
  res.status(200).json({
    'user': req.user
  });
});

router.get('/:query', (req, res) => {
  res.status(200).json({
    query: 'YOU MADE A QUERYYYYY'
  })
})

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
