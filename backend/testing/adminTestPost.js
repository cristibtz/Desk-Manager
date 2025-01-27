const request = require('supertest');
const expect = require('chai').expect;
require('dotenv').config();
const { getTestUserToken } = require('../auth/auth.js');

describe('Testing Resource Manager Admin POST API Endpoints', () => {

    const URL = process.env.APP_URL;

    before(async () => {
        token = await getTestUserToken(process.env.TEST_USER, process.env.TEST_USER_PASS);
    })


    it('Successfully posted to /reservations route', (done) => {
        request(URL)
        .post('/reservations')
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .send({
            "user_id": 1,
            "room_id": 1,
            "desk_id": 5,
            "start_date": "2021-06-01 12:00:00",
            "duration": 60,
            "note": "Testing"
        })
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

    it('Successfully updated the created reservation /reservation/7', (done) => {
        request(URL)
        .post('/reservations/7')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .send({
            "new_start_date": "2021-06-01 12:00:00",
            "duration": 120,
        })
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

    it('Successfully posted to /rooms route', (done) => {
        request(URL)
        .post('/rooms')
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .send({
            "room_number": 6,
            "room_alias": "Test Room",
        })
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

    
    it('Successfully updated /rooms/6', (done) => {
        request(URL)
        .post('/rooms/6')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .send({
            "room_alias": "Test update"
        })
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

    it('Successfully posted to /desks route', (done) => {
        request(URL)
        .post('/desks')
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .send({
            "room_number": 6,
            "desk_number": 6,
        })
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });

    it('Successfully updated /desks/10 route', (done) => {
        request(URL)
        .post('/desks/10')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .send({
            "desk_number": 10
        })
        .end((err, res) => {
            if (err) return done(err);
            console.log(res.body);
            done();
        });
        
    });
})
