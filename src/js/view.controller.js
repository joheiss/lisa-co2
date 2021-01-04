export class ViewController {

    constructor(selector) {
        this._container = document.querySelector(selector);
    }

    get container() {
        return this._container;
    }

    hide() {
        this._container.classList.add('hidden');
    }

    show() {
        this._container.classList.remove('hidden');
    }
}