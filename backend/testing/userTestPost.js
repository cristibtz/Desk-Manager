const request = require('supertest');
const expect = require('chai').expect;
require('dotenv').config();
const { getTestUserToken } = require('../auth/auth.js');

describe('Testing Resource Manager Admin POST API Endpoints', () => {

    const URL = process.env.APP_URL;

    before(async () => {
        token = await getTestUserToken(process.env.TEST_USER, process.env.TEST_USER_PASS);
    })


    it('Successfully posted to /user/reservations route', (done) => {
        request(URL)
        .post('/user/reservations')
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .send({
            "user_id": 1,
            "room_id": 1,
            "desk_id": 5,
            "start_date": "2021-06-03 12:00:00",
            "duration": 60,
            "note": "Testing"
        })
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

    it('Successfully updated the created reservation /reservation/8', (done) => {
        request(URL)
        .post('/user/reservations/8')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .send({
            "new_start_date": "2021-06-01 11:00:00",
            "duration": 90,
        })
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

})
