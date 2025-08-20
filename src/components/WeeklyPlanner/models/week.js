import { formatMonthYear } from "@/utils/format";

class Week {
  constructor(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();

    // shift so that Monday is 0
    const diff = (day === 0 ? -6 : 1) - day;

    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);

    this.startOfWeek = d;
  }

  get endOfWeek() {
    return this.getWeekDate(6);
  }

  getWeekHeader() {
    // Label the week for the month of Thursday
    const thursday = this.getWeekDate(3);
    return formatMonthYear(thursday);
  }

  getWeekDate(index) {
    const d = new Date(this.startOfWeek);
    d.setDate(this.startOfWeek.getDate() + index);
    return d;
  }

  getWeekDates() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.startOfWeek);
      d.setDate(this.startOfWeek.getDate() + i);
      dates.push(d);
    }
    return dates;
  }

  getNextWeek() {
    const d = new Date(this.startOfWeek);
    d.setDate(d.getDate() + 7);
    return new Week(d);
  }

  getPreviousWeek() {
    const d = new Date(this.startOfWeek);
    d.setDate(d.getDate() - 7);
    return new Week(d);
  }
}

export default Week;
