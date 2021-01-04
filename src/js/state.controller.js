import { TimeUtils } from './time.utilities';
import { v4 } from 'uuid';

export class State {
     
    constructor() {
        this._utils = new TimeUtils();
    }

    async getState() {
        return {
            rooms: await this._getRooms()
        };
    }

    async _getRooms() {
        // hier muss ein fetch hin
        return  [
            { id: v4(), name: 'H 2.16', description: 'Klasse 1a', 
                measurements: this.generateMeasurements(100000, 3)
            },  
            { id: v4(), name: 'H 2.17', description: 'Klasse 1b', 
                measurements: this.generateMeasurements(100000, 3)
            },
            { id: v4(), name: 'H 2.18', description: 'Klasse 1c', 
                measurements: this.generateMeasurements(100000, 3)
            },
            { id: v4(), name: 'H 1.11', desription: 'Klasse 2a', 
                measurements: this.generateMeasurements(100000, 3)
            },
            { id: v4(), name: 'H 1.12', description: 'Klasse 2b', 
                measurements: this.generateMeasurements(100000, 3)
            },
            { id: v4(), name: 'H 1.13', description: 'Klasse 2c', 
                measurements:this.generateMeasurements(100000, 3)
            },
            { id: v4(), name: 'H 3.12', description: 'Klasse 2b', 
                measurements: this.generateMeasurements(100000, 3)
            },
            { id: v4(), name: 'H 3.13', description: 'Klasse 2c', 
                measurements: this.generateMeasurements(100000, 3)
            }
        ];
    }

    generateMeasurements(count, minutes) {
        const time = new Date();
        const measurements = [];
        for(let i=0; i < count; i++) {
            measurements.push({ 
                time: this._utils.subtractMinutes(time, minutes * i),
                co2: Math.trunc(Math.random() * 3200 + 300), 
                temperature: Math.trunc(Math.random() * 15 + 18),
                humidity: Math.trunc(Math.random() * 60 + 30),
            });
        }
        return measurements;
    }
}