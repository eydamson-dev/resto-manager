'use strict';

class TimeScheduler {
  weeks = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  constructor(schedule) {
    if (!schedule) return;

    this.setTime(schedule);
    this.setDays(schedule);
  }

  // splits the time to two
  setTime(time) {
    // ie '8 pm - 10:30 pm' -> ['8 pm', '10:30 pm']
    time = time.match(/\d{1,2}(\s|:?)(\d{0,})\s\w{2}/g);
    this.openningTime = time[0];
    this.closingTime = time[1];
  }

  // splits the days to two
  setDays(days) {
    // ie 'mon - fri' -> ['mon', 'fri']
    this.days = days.match(/(\w{3})(\w{3})?/g);
  }

  /**
   * returns normalized openning and closing time
   */
  getTimeSchedule() {
    let openning = this.normalizeTime(this.openningTime);
    let closing = this.normalizeTime(this.closingTime);

    // add 24hrs to closing time, only if the closing time is on the next day
    // ie opening = 9pm(21hr) and closing = 2am(2hrs)
    // then add 24hrs to closing, closing will be 6am(6hr) + 24hrs = 26hrs
    // this is done so that querying the database will be easier
    if (openning > closing) {
      closing += (24 * 3600);
    }

    return {
      openning,
      closing
    };
  }

  /**
   * converts weeks to numerical value
   * weeks start on monday in this case..
   */
  getDaysSchedule() {
    let from = this.days[0] ? this.weeks.indexOf(this.days[0].toLowerCase()) : null;
    let to = this.days[1] ? this.weeks.indexOf(this.days[1].toLowerCase()) : null;
    if (to === null) to = from;

    return {
      from,
      to
    };
  }

  /**
   * normalizes the time to seconds before inserting it to the database
   */
  normalizeTime(time) {
    // split time and period
    // ie '10:30 pm' -> ['10:30', 'pm']  
    time = time.split(' ');
    return this.convertTimeToSeconds(time[0], time[1]);
  }

  /**
   * converts the time to seconds
   */
  convertTimeToSeconds(time, period) {
    // split hours and minutes
    // ie '10:30' -> ['10', '30']
    var t = time.split(':'); 

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    // parse time as int and convert it to 24hr format
    let hour = period === 'pm' && +t[0] < 12 ? +t[0] + 12 : +t[0];
    let min = +t[1] ? +t[1] : 0;

    // hr -> sec =  hr * 60 * 60
    let hrToSec = hour * 3600;

    // mins -> sec = mins * 60
    let minsToSec = min ? min * 60 : 0;

    let totalSeconds = hrToSec + minsToSec;

    return totalSeconds;
  }

  convertSecondsToTime(totalSeconds) {
    let hours = Math.floor(totalSeconds/ 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);

    return { hours, minutes };
  }

  toJSON() {
    return {
      time: {
        ...this.getTimeSchedule()
      },
      days: {
        ...this.getDaysSchedule()
      }
    };
  }
}

module.exports = TimeScheduler;
