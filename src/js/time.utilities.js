export class TimeUtils {

    constructor() {}

    addDays(date = new Date(), days = 1) {
        return this.addHours(date, 24);
    }

    addHours(endTime = new Date(), hours = 1) {
        return new Date(new Date(endTime).setTime(endTime.getTime() + hours * 60 * 60 * 1000));
    }

    addMinutes(endTime = new Date(), minutes = 5) {
        return new Date(new Date(endTime).setTime(endTime.getTime() + minutes * 60 * 1000));
    }

    addMonths(date = new Date(), months = 1) {
        return new Date(new Date(date.setMonth(date.getMonth() + months)));
    }

    ceilMinutes(time = new Date(), minutes = 5) {
        const coeff = minutes * 60 * 1000;
        return new Date(Math.ceil(time.getTime() / coeff) * coeff);
    }

    floorMinutes(time = new Date(), minutes = 5) {
        const coeff = minutes * 60 * 1000;
        return new Date(Math.floor(time.getTime() / coeff) * coeff);
    }

    hoursOfMonth(date = new Date()) {
        return this.endOfMonth().getDate() * 24;
    }

    endOfDay(date = new Date(), index = 0) {
        if (index === -1) return new Date(date.setHours(11,59,59,999));
        if (index ===  1) return new Date(date.setHours(23,59,59,999));
        return new Date(date.setHours(17,59,59,999));
    }

    endOfMonth(date = new Date()) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    endOfWeek(date = new Date(), workdaysOnly = false) {
        // get date of sunday or friday, if only workdays are required
        const lastday = workdaysOnly ? 5 : 6;
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? 0 : 6);
        return new Date(new Date(date.setDate(diff)).setHours(23,59,59,999));
    }

    roundMinutes(time, minutes = 5) {
        const coeff = minutes * 60 * 1000;
        return new Date(Math.round(time.getTime() / coeff) * coeff);
    }

    startOfDay(date = new Date(), index = 0) {
        if (index === -1) return new Date(date.setHours(0,0,0,0));
        if (index ===  1) return new Date(date.setHours(12,0,0,0));
        return new Date(date.setHours(6,0,0,0));

    }

    startOfWeek(date = new Date()) {
        // get date of last monday
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(new Date(date.setDate(diff)).setHours(0,0,0,0));
    }

    startOfMonth(date = new Date()) {
        return new Date(date.setDate(1));
    }

    subtractDays(date = new Date(), days = 1) {
        return this.subtractHours(date, 24);
    }

    subtractHours(endTime = new Date(), hours = 1) {
        return new Date(new Date(endTime).setTime(endTime.getTime() - hours * 60 * 60 * 1000));
    }

    subtractMinutes(endTime = new Date(), minutes = 5) {
        return new Date(new Date(endTime).setTime(endTime.getTime() - minutes * 60 * 1000));
    }
    
    subtractMonths(date = new Date(), months = 1) {
         return new Date(new Date(date.setMonth(date.getMonth() - 1)));
    }
}