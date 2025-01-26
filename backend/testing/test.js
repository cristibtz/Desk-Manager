const request = require('supertest');
const expect = require('chai').expect;
require('dotenv').config();
const { getTestUserToken } = require('../auth/auth.js');

describe('Testing Resource Manager API', () => {

    const URL = process.env.APP_URL;

    before(async () => {
        token = await getTestUserToken(process.env.TEST_USER, process.env.TEST_USER_PASS);
    })

    it('Successfully accessed / route', (done) => { 
        // Test the /GET route
        request(URL)
        .get('/')
        .expect(200)
        .end(function(err, res) {
                if (err) throw err;
                console.log(res.body);
                done();

        });
    });

    it('Successfully accessed /reservations route', (done) => {
        request(URL)
        .get('/reservations')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end(function(err, res) {
                if (err) throw err;
                console.log(res.body);
                done();
        });
        
    });
})
