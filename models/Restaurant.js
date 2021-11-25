const dbo = require('../db/conn');
const File = require('../utils/File');
const TimeScheduler = require('../utils/TimeScheduler');
const path = require('path');

class Restaurant {
  static get schedules() {
    return dbo.collection('schedules');
  }
  static getRestaurant(days, time) {
    let promise = new Promise((resolve, reject) => {
      let schedule = new TimeScheduler();
      schedule.setTime(time);
      schedule.setDays(days);
      let s = schedule.toJSON();

      this.schedules
        .find({
          'schedule.time.openning': {
            $lte: s.time.closing
          },
          'schedule.time.closing': {
            $gte: s.time.openning
          },
          'schedule.days.from': {
            $lte: s.days.to
          },
          'schedule.days.to': {
            $gte: s.days.from
          }
        })
        .toArray((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    });

    return promise;
  }

  static async seed() {
    return this.getDataFromFile().then(restaurants => {
      return this.schedules.insertMany(restaurants);
    });
  }

  static async getDataFromFile() {
    return File.readJSONFile(path.resolve(__dirname, '../data.json'))
      .then(({ restaurants }) => {
        restaurants = restaurants.map((r) => {
          let name = r.name;
          let opening_hours = r.opening_hours.split(';');

          let s = opening_hours.map((sched) => {
            const schedule = new TimeScheduler(sched);
            return schedule.toJSON();
          });

          return {
            name,
            schedule: s
          };
        });

        return restaurants;

      })
      .catch((error) => {
        return error;
      });
  }
}

module.exports = Restaurant;
