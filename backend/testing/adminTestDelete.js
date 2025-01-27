const request = require('supertest');
const expect = require('chai').expect;
require('dotenv').config();
const { getTestUserToken } = require('../auth/auth.js');

describe('Testing Resource Manager Admin DELETE API Endpoints', () => {

    const URL = process.env.APP_URL;

    before(async () => {
        token = await getTestUserToken(process.env.TEST_USER, process.env.TEST_USER_PASS);
    })


    it('Successfully deleted /reservations/7', (done) => {
        request(URL)
        .delete('/reservations/7')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

    it('Successfully deleted /user/5', (done) => {
        request(URL)
        .delete('/users/5')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });
    
    it('Successfully deleted /desks/9', (done) => {
        request(URL)
        .delete('/desks/9')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

    it('Successfully deleted /rooms/6', (done) => {
        request(URL)
        .delete('/rooms/6')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

})
