const request = require('supertest');
const { create } = require('./server');

describe('root', () => {

    let app;

    beforeAll(async () => {
        app = await create();
    });

    it('request root, returns html', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });

    it('request api, returns json', async () => {
        const res = await request(app).get('/api');
        expect(res.statusCode).toBe(200);
    });

    it('request invalid path, returns 404', async () => {
        const res = await request(app).get('/invalid-path');
        expect(res.statusCode).toBe(404);
    });

});
