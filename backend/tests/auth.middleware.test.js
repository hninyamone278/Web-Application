const jwt = require('jsonwebtoken');
const { protect, adminOnly } = require('../middleware/auth');

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

describe('Auth Middleware', () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('protect', () => {
    it('should call next() with valid token', () => {
      const token = jwt.sign({ id: 1, email: 'a@b.com', role: 'customer' }, process.env.JWT_SECRET);
      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = mockRes();
      const next = jest.fn();

      protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toHaveProperty('id', 1);
      expect(req.user).toHaveProperty('email', 'a@b.com');
    });

    it('should return 401 with no token', () => {
      const req = { headers: {} };
      const res = mockRes();
      const next = jest.fn();

      protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 with invalid token', () => {
      const req = { headers: { authorization: 'Bearer invalidtoken' } };
      const res = mockRes();
      const next = jest.fn();

      protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('adminOnly', () => {
    it('should call next() for admin user', () => {
      const req = { user: { role: 'admin' } };
      const res = mockRes();
      const next = jest.fn();

      adminOnly(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 for non-admin user', () => {
      const req = { user: { role: 'customer' } };
      const res = mockRes();
      const next = jest.fn();

      adminOnly(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
