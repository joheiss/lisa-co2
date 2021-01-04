import { ViewController } from './view.controller';

export class RoomsView extends ViewController {

    constructor(app, state) {
        super('.rooms');
        this._app = app;
        this._state = state;
        this.MAX_PPM = 3000;
        this._init();
    }

    _getBubbleSize(room) {
        // determine size of bubble/circle for a given room, 
        // based on relation between room container size and last ppm value for the given room
        return Math.floor((room.measurements[0].co2 * this._getRoomElementSize() / this.MAX_PPM));
    }

     _getRoomElementSize() {
        // determine size of room container,
        // based on number of rooms available in app state
        const count = this._state.rooms.length;
        if (count === 1) return 395;
        if (count === 2) return 290;
        return 190;
    }

    _init() {
        this._button = document.querySelector('.rooms__btn');
        this._button.addEventListener('click', this._app.navigateToBarcode.bind(this._app));
        this._roomsList = document.querySelector('.rooms__list');
        this._roomsList.addEventListener('click', this._selectRoom.bind(this));
    }

    _selectRoom(e) {
        // handle room selection and navigate to room details view
        // use event delegation from parent element (room list)
        // and get the selected room from the data attribute of room container
        const el = e.target.closest('.room');
        if (!el) return;
        const id = el.dataset.id;
        this.room = this._state.rooms.find(r => r.id === id);
        this._app.navigateToDetails(id);
    }

    showRoomsList() {
        // display the list of rooms from the list of rooms in the app state
        // make sure the view is properly filled - based on the number of available rooms
        // for this, use special logic if only 1 room or only 2 rooms are present
        this._roomsList.innerHTML = '';
        this._state.rooms.forEach(r => this._showRoom(r, this._state.rooms.length));
        this._styleRoomElements();
        this._roomsList.style.justifyContent = 'center';
    }

    _showRoom(room, count) {
        // display room container in list of rooms
        // container size depends on number of rooms in the list
        // bubble size depends on measurement value for room
        const size = this._getBubbleSize(room);
        const markup = `
            <div class="room" data-id="${room.id}">
                <div class="circle" 
                    style="width:${size}px;height:${size}px;">
                    <div class="room__desc">
                        <p class="room__desc--id">${room.name}</p>
                        <p class="room__desc--name">${room.description}</p>
                    </div>
                </div>
            </div>
        `;
        this._roomsList.insertAdjacentHTML('beforeend', markup);
    }

    _styleRoomElements() {
        // style room container size and margins - based on number of rooms in list
        const els = document.querySelectorAll('.room');
        els.forEach(e => { 
            e.style.width = e.style.height = `${this._getRoomElementSize()}px`;
            if (els.length <= 2) e.style.marginRight = '1rem';
        });
    }
}