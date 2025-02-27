const request = require('supertest');
const expect = require('chai').expect;
require('dotenv').config();
const { getTestUserToken } = require('../auth/auth.js');

describe('Testing Resource Manager Admin POST API Endpoints', () => {

    const URL = process.env.APP_URL;

    before(async () => {
        token = await getTestUserToken(process.env.TEST_USER, process.env.TEST_USER_PASS);
    })


    it('Successfully deleted /user/reservations/9', (done) => {
        request(URL)
        .delete('/user/reservations/9')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

})
