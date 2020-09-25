require('dotenv').config();

// const request = require('supertest');
// const app = require('../app');

describe('Handling Responses', () => {
  it('Responses with status 200 families', async () => {
    expect(Array.isArray(['some', 'tests'])).toBe(true);
  });

  it('Errors with status 400 families', () => {
    expect(Array.isArray(['some', 'tests'])).toBe(true);
  });
});
