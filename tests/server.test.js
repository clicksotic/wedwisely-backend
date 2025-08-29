const request = require('supertest');
const app = require('../server');

describe('WedWisely Backend API', () => {
  describe('GET /', () => {
    it('should return welcome message and server status', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('company');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      
      expect(response.body.company).toBe('WedWisely');
      expect(response.body.status).toBe('Server is running successfully');
      expect(response.body.message).toContain('Welcome to WedWisely');
    });
  });

  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('company');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
      
      expect(response.body.status).toBe('OK');
      expect(response.body.company).toBe('WedWisely');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('CORS', () => {
    it('should have CORS headers', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('JSON Response', () => {
    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
}); 