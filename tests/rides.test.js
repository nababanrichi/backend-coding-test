'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/orm/schemas');

describe('RIDES API DB connected', () => {
    describe('GET Rides no record(s)', () => {
        it('should return error', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });
    });

    describe('GET Ride By Id - no record(s)', () => {
        it('should return error', (done) => {
            request(app)
                .get('/rides/1')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });
    });
    
    describe('Insert Ride - wrong start_lat', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "-100","start_long": "0","end_lat": "0","end_long": "0","rider_name": "Budi","driver_name": "Anton","driver_vehicle": "Tesla Model 3 2020"})
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });
    
    describe('Insert Ride - wrong start_long', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "0","start_long": "-200","end_lat": "0","end_long": "0","rider_name": "Budi","driver_name": "Anton","driver_vehicle": "Tesla Model 3 2020"})
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });
    
    describe('Insert Ride - wrong end_lat', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "0","start_long": "0","end_lat": "-100","end_long": "0","rider_name": "Budi","driver_name": "Anton","driver_vehicle": "Tesla Model 3 2020"})
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });
    
    describe('Insert Ride - wrong end_long', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "0","start_long": "0","end_lat": "0","end_long": "-200","rider_name": "Budi","driver_name": "Anton","driver_vehicle": "Tesla Model 3 2020"})
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });
    
    describe('Insert Ride - wrong rider_name', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "0","start_long": "0","end_lat": "0","end_long": "0","rider_name": "","driver_name": "Anton","driver_vehicle": "Tesla Model 3 2020"})
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });
    
    describe('Insert Ride - wrong driver_name', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "0","start_long": "0","end_lat": "0","end_long": "0","rider_name": "Budi","driver_name": "","driver_vehicle": "Tesla Model 3 2020"})
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });
    
    describe('Insert Ride - wrong driver_vehicle', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "0","start_long": "0","end_lat": "0","end_long": "0","rider_name": "Budi","driver_name": "Anton","driver_vehicle": ""})
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });
    
    describe('Insert Ride with valid data', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "0","start_long": "0","end_lat": "0","end_long": "0","rider_name": "Budi","driver_name": "Anton","driver_vehicle": "Tesla Model 3 2020"})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET Rides - one record', () => {
        it('should return error', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET Ride By Id - record exist', () => {
        it('should return error', (done) => {
            request(app)
                .get('/rides/1')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    
    describe('Insert Ride with valid data', () => {
        it('should return error', (done) => {
            request(app)
                .post('/rides')
                .send({"start_lat": "0","start_long": "0","end_lat": "0","end_long": "0","rider_name": "Budi","driver_name": "Anton","driver_vehicle": "Tesla Model 3 2020"})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET Rides - with limit and page', () => {
        it('should return error', (done) => {
            request(app)
                .get('/rides')
                .send({"limit": "1", "page": "1"})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET Rides - with limit and page', () => {
        it('should return error', (done) => {
            request(app)
                .get('/rides')
                .send({"limit": "1", "page": "5"})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});