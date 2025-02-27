const request = require('supertest');
const expect = require('chai').expect;
require('dotenv').config();
const { getTestUserToken } = require('../auth/auth.js');

describe('Testing Resource Manager Admin GET API Endpoints', () => {

    const URL = process.env.APP_URL;

    before(async () => {
        token = await getTestUserToken(process.env.TEST_USER, process.env.TEST_USER_PASS);
    })

    it('Successfully accessed / route', (done) => { 
        request(URL)
        .get('/')
        .expect(200)
        .end(function(err, res) {
                if (err) throw err;
                done();

        });
    });

    it('Successfully accessed /reservations route', (done) => {
        request(URL)
        .get('/reservations')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });

    it('Successfully accessed /users route', (done) => {
        request(URL)
        .get('/users')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });

    it('Successfully accessed /rooms route', (done) => {
        request(URL)
        .get('/rooms')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });

    it('Successfully accessed /desks route', (done) => {
        request(URL)
        .get('/desks')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });

    it('Successfully accessed /reservations/1 route', (done) => {
        request(URL)
        .get('/reservations/1')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });

    it('Successfully accessed /users/1 route', (done) => {
        request(URL)
        .get('/users/1')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });


    it('Successfully accessed /users/1/reservations route', (done) => {
        request(URL)
        .get('/users/1/reservations')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });

    it('Successfully accessed /rooms/1', (done) => {
        request(URL)
        .get('/rooms/1')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });


    it('Successfully accessed /rooms/1', (done) => {
        request(URL)
        .get('/rooms/1/desks')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });

    it('Successfully accessed /desks/1', (done) => {
        request(URL)
        .get('/desks/1')
        .set('Authorization', 'Bearer ' + token)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });
})
