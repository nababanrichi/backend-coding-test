'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('RIDES API DB not connected', () => {
    describe('GET /rides', () => {
        it('should return error', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });
    
    describe('GET /rides/1', () => {
        it('should return error', (done) => {
            request(app)
                .get('/rides/1')
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });
    
    describe('POST /rides', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "0","start_long": "0","end_lat": "0","end_long": "0","rider_name": "Budi","driver_name": "Anton","driver_vehicle": "Tesla Model 3 2020"})
                .expect('Content-Type', /json/)
                .expect(500, done);
        });
    });
});

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => { 
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });
});