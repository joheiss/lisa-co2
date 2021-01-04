export class Menu {

    constructor(backHandler) {
        this._menuButton = document.querySelector('.menu');
        this._backButton = document.querySelector('.back');
        this._backButton.addEventListener('click', backHandler);
    }

    toggleBack() {
        this._backButton.classList.toggle('hidden');
    }

    toggleMenu() {
        this._menuButton.classList.toggle('hidden');
    }
}