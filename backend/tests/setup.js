const { sequelize } = require('../models');

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
