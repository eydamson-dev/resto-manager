const request = require('supertest');
const { expect } = require('chai');
const should = require('chai').should();

require('dotenv').config({ path: './.env' });

const dbo = require('./db/conn');
const app = require('./app');
const Restaurant = require('./models/Restaurant');
const TimeScheduler = require('./utils/TimeScheduler');
const File = require('./utils/File');

describe('Restaurant Schedule', () => {
  before((done) => {
    dbo.connectToServer((_err) => {
      done();
    });
  });

  describe('Restaurant API', () => {
    it('GET /seed should insert 6 items', (done) => {
      request(app)
        .get('/seed')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body.insertedCount).to.equal(6);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('GET / should return restaurants', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({
          days: 'fri',
          time: '5:30 pm - 5:30 am'
        })
        .then((res) => {
          res.body.length.should.not.equal(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });

  describe('Restaurant Model', () => {
    it('getRestaurant should return an array of restaurants', (done) => {
      Restaurant.getRestaurant('fri', '5:30 pm - 5:30 am')
        .then((result) => {
          expect(result).to.be.an('array');
          result.forEach((data) => {
            data.should.have.property('name');
            data.should.have.property('schedule');
          });
          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('getDataFromFile should return on array of objects', (done) => {
      Restaurant.getDataFromFile()
        .then((results) => {
          expect(results.length).to.equal(6);
          results.should.be.an('array');
          results.forEach((data) => {
            data.should.be.an('object');
          });
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });

  describe('TimeScheduler class', () => {
    let timeScheduler = new TimeScheduler();
    it('setTime should parse openning and closing time', done => {
      timeScheduler.setTime('8 pm - 10:30 pm');
      timeScheduler.openningTime.should.equal('8 pm');
      timeScheduler.closingTime.should.equal('10:30 pm');
      done()
    });

    it('setDays should parse the scheduled days', done => {
      timeScheduler.setDays('mon-fri');
      timeScheduler.days.should.be.an('array');
      timeScheduler.days.should.eql(['mon', 'fri']);
      done();
    })

    it('getTimeSchedule converts time to seconds', done => {
      // 8:00pm = 72000, 10:30pm = 81000
      let {openning, closing} = timeScheduler.getTimeSchedule();
      openning.should.equal(72000);
      closing.should.equal(81000);
      done();
    });
  });

  describe('File util', () => {
    it('should be able to read data.json', done => {
      File.readJSONFile('./data.json').then(data => {
        should.exist(data);
        done();
      }).catch(error => {
        should.not.exist(error);
        done(error);
      })
    });
  });
});
