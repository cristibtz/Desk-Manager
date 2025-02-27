const request = require('supertest');
const expect = require('chai').expect;
require('dotenv').config();
const { getTestUserToken } = require('../auth/auth.js');

describe('Testing Resource Manager User GET API Endpoints', () => {

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

    it('Successfully accessed /user/reservations route', (done) => {
        request(URL)
        .get('/user/reservations')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
            if (err) throw err;
            if (res.statusCode === 200 || res.statusCode === 404) {
                done();
            } else {
                throw new Error('Expected status code 200 or 404, but got ' + res.statusCode);
            }
        });
        
    });

    it('Successfully accessed /user/reservations/1 route', (done) => {
        request(URL)
        .get('/user/reservations/1')
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

    it('Successfully accessed /occupied route', (done) => {
        request(URL)
        .get('/occupied')
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
