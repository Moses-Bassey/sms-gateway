const request = require('supertest');
const app = require('../app');

let IndexAPI = '/';

describe(`Index Route --> ${IndexAPI}`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(IndexAPI);
  });

  it('GET request returns 200 status code', () => {
    expect(response.statusCode).toBe(200);
  });

  it('GET request shows status API Online', () => {
    expect(response.body).toMatchObject({
      status: 'SUCCESS',
      message: '***API ONLINE***',
    });
  });
});
