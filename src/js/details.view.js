import { ViewController } from './view.controller';
import { Chart } from 'chart.js';
import { TimeUtils } from './time.utilities';

export class DetailsView extends ViewController {

    constructor(app, state) {
        super('.details');
        this._app = app;
        this._state = state;
        this._init();
    }

    showDetails(id) {
        // public interface to deliver correct room to details view
        this._room = this._state.rooms.find(r => r.id === id);
        if (!this._room) return;
        this._app.setTitle(this._room.name, this._room.description);
        this._diagramsList.innerHTML = '';
        this._showCo2Diagram();
   }

    _drawDiagram(datapoints) {
        // draw diagram using chart1,js line diagram
        const canvas = document.querySelector('.diagram__canvas');
        const ctx = canvas.getContext('2d');
        const values = datapoints.data.slice(0, this._interval.maxVisibleDataPoints).map(d => d.co2 );
        const labels = datapoints.labels.slice(0, this._interval.maxVisibleDataPoints);
        const data = { 
            labels: labels.reverse(), 
            datasets: [{ data: values.reverse(), fill: false, borderColor: '#819c94', label: this._getLegend() }]
        };
        const options = {
            responsive: true,
            aspectRatio: 1,
             scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 500,
                        suggestedMax: 3500                    }
                }]
            }
        };
        canvas.innerHTML = '';
        const chart = new Chart(ctx, { type: 'line', data, options } );
    }
    
    _getDataPoints() {
        // get datapoints for currently selected interval and map it to a fitting grid - based on number of datapoints
        // also, build labels for datapoints
        const { start, end, hours } = this._interval;
        // get value to "round" grid to the correct time unit (5 minutes, 1 hour, 1 day)
        const minutes = hours >= 168 ? 1440 : hours * 5;
        // filter datapoints from measurements - based on interval (start / end) and assign "rounded" time
        const values = this._room.measurements
            .filter(m => m.time.getTime() >= end.getTime() && m.time.getTime() <= start.getTime())
            .map(m => ({...m, time: hours <= 24 ? this._utils.roundMinutes(m.time, minutes) : this._utils.floorMinutes(m.time, minutes)}));
        // since - after "rounding" there will be many datapoints for a single "rounded" point in time,
        // we will have to calculate the average of all the values belonging to a single time and store it as a grid
        const datapoints = [];
        values.forEach(p => {
            const point = datapoints.find(n => n.time.getTime() === p.time.getTime());
            if (point) { 
                // calculate average
                point.co2 = (point.co2 + p.co2) / 2;
                point.humidity = (point.humidity + p.humidity) / 2;
                point.temperature = (point.temperature + p.temperature) / 2;
            } else {
                // insert new grid line
                datapoints.push(p);
            }
        });
        console.log('dataPoints: ', datapoints);
        // build labels for data points
        const labels = this._getLabelsFromDataPoints(datapoints);
        console.log('Labels: ', labels);
        return { data: datapoints, labels };
    }

    _getLabelsFromDataPoints(datapoints) {
        // build labels for datapoints
        if (this._interval.hours <= 24) {
            // for hour and day build a label with HH:MM
            return datapoints.map(d => `${d.time.getHours()}:${d.time.getMinutes().toString().padStart(2, '0')}`);
        } 
        // for week and month build a label with DD.MM
        return datapoints.map(d => `${d.time.getDate().toString().padStart(2, '0')}.${(d.time.getMonth() + 1).toString().padStart(2, '0')}`);
    }

    _getLegend() {
        // build time interval date/time from/to for diagram legend
        const startDate = this._interval.start.toLocaleDateString();
        const startTime = this._interval.start.toLocaleTimeString().slice(0, 5);
        const endDate = this._interval.end.toLocaleDateString();
        const endTime = this._interval.end.toLocaleTimeString().slice(0, 5);
        return `${endDate} ${endTime} -${startDate === endDate ? '' : ' ' + startDate} ${startTime}`;
    }

    _getStatusColorCo2() {
        // set status color - based on ppm value
        const co2 = this._room.measurements[0].co2;
        if (co2 <= 1000) return 'green';
        if (co2 <= 2000) return 'yellow';
        return 'red';
    }

    _handleButton(e) {
        // handle toogle for selection of hour, day, week, month - by setting control data
        const el = e.target.closest('.btn');
        if (el.classList.contains('details__hour')) 
            this._interval = {
                hours: 1,
                maxVisibleDataPoints: 13,
                start: this._utils.ceilMinutes(), 
                end: this._utils.ceilMinutes(this._utils.subtractHours())
            };
        if (el.classList.contains('details__day')) 
            this._interval = {
                hours: 12,
                maxVisibleDataPoints: 13,
                start: this._utils.endOfDay(new Date()),
                end: this._utils.startOfDay(new Date())
            };
        if (el.classList.contains('details__week')) 
            this._interval = {
                hours: 168,
                maxVisibleDataPoints: 7,
                start:  this._utils.endOfDay(this._utils.endOfWeek(), 1),
                end:  this._utils.startOfDay(this._utils.startOfWeek(), -1)
            };
    
        if (el.classList.contains('details__month')) 
            this._interval = {
                hours: this._utils.hoursOfMonth(),
                maxVisibleDataPoints: this._utils.endOfMonth().getDate(),
                start: this._utils.endOfDay(this._utils.endOfMonth(), 1),
                end: this._utils.startOfDay(this._utils.startOfMonth(), -1)
            };
        console.log('interval: ', this._interval);
        const datapoints = this._getDataPoints();
        this._drawDiagram(datapoints);
    }

    _init() {
        // initialize view and control data for diagram
        this._diagramsList = document.querySelector('.details__diagrams');
        this._detailsButtons = document.querySelector('.details__buttons');
        this._detailsButtons.addEventListener('click', this._handleButton.bind(this));
        this._utils = new TimeUtils();
        this._interval = { 
            hours: 1, 
            maxVisibleDataPoints: 13,
            start: this._utils.ceilMinutes(), 
            end: this._utils.ceilMinutes(this._utils.subtractHours()) 
        };
        console.log(this._interval);
    }

   _showCo2Diagram() {
       // build markup for diagram and display it
       const rygColor = this._getStatusColorCo2();
       const markup = `
        <div class="diagram">
            <div class="diagram__header">
              <div class="diagram__measure">
                <div class="diagram__ryg" style="background-color:${rygColor}"></div>
                <div class="diagram__value">${Math.trunc(this._room.measurements[0].co2)} ppm</div>
                <div class="diagram__uom">CO2</div>
              </div>
              <div class="diagram__gap"></div>
              <div class="diagram__datetime">
                <div class="datetime__btn"> 
                    <i class="fas fa-arrow-left fa-2x datetime__btn prev"></i>
                </div>
                <div class="datetime__btn"> 
                    <i class="fas fa-arrow-right fa-2x datetime__btn next"></i>
                </div>
              </div>
            </div>
            <div class="diagram__body">
                <canvas class="diagram__canvas"></canvas>
            </div>
        </div>
       `;
       this._diagramsList.insertAdjacentHTML('beforeend', markup);
       document.querySelector('.prev').addEventListener('click', () => this._showMoreDataPoints(-1));
       document.querySelector('.next').addEventListener('click', () => this._showMoreDataPoints(1));
       const datapoints = this._getDataPoints();
       this._drawDiagram(datapoints); 
   }

    _showMoreDataPoints(direction = 1) {
        // re-calculate time interval for which the measurements have to be displayed.
        // direction = 1 for next interval, -1 for previous interval
        if (this._interval.hours <= 24) {
            this._interval.start = this._utils.addHours(this._interval.start, this._interval.hours * direction);
            this._interval.end = this._utils.addHours(this._interval.end, this._interval.hours * direction);
        }
        if (this._interval.hours === 168) {
            this._interval.start = this._utils.startOfDay(this._utils.addDays(this._interval.start, 7 * direction));
            this._interval.end = this._utils.endOfDay(this._utils.addDays(this._interval.end, 7 * direction));
        }
        if (this._interval.hours > 168) {
            this._interval.end = this._utils.addMonths(this._utils.startOfDay(this._interval.end, -1), 1 * direction);
            this._interval.start = this._utils.endOfMonth(this._interval.end);
        }
        console.log('interval: ', this._interval);
        // get data points for new time interval
        const datapoints = this._getDataPoints();
        // re-draw the diagram
        this._drawDiagram(datapoints);
    }
}