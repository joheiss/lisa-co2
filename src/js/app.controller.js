import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Menu } from './menu.controller';
import { RoomsView } from './rooms.view';
import { BarcodeView } from './barcode.view';
import { DetailsView } from './details.view';
import { State } from './state.controller';

export class App {
    
    constructor() {
        this._init();
    }

    async _init() {
        this._state = await (new State()).getState();
        this._menu = new Menu(this._navigateBack.bind(this));
        this.setTitle('Meine Räume');
        this._roomsView = new RoomsView(app, this._state);
        this._barcodeView = new BarcodeView(app, this._state);
        this._detailsView = new DetailsView(app, this._state);
        this._roomsView.showRoomsList();

    }
    
    _navigateBack() {
        // navigate back to app view
        // hide other views, setup menu icons and title
        this._roomsView.show();
        this._barcodeView.hide();
        this._detailsView.hide();
        this._menu.toggleMenu();
        this._menu.toggleBack();
        this.setTitle('Meine Räume');
    }

    navigateToBarcode() {
        // navigate to barcode scanning view
        // hide other views, setup menu icons and title
        this._roomsView.hide();
        this._barcodeView.show();
        this._menu.toggleMenu();
        this._menu.toggleBack();
        this.setTitle('Neuer Raum');
    }

    navigateToDetails(id) {
        // navigate to room details view
        // hide other views, setup menu icons
        this._roomsView.hide();
        this._detailsView.showDetails(id);
        this._detailsView.show();
        this._menu.toggleMenu();
        this._menu.toggleBack();
    }

    setTitle(title, subtitle = '') {
        // set title and subtitle for current view
        let el = document.querySelector('.title__text');
        el.textContent = title;
        el = document.querySelector('.subtitle__text');
        el.textContent = subtitle;
    }

}

const app = new App();