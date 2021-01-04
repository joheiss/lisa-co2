import { ViewController } from './view.controller';
import { Quagga } from '@ericblade/quagga2';

export class BarcodeView extends ViewController {

    constructor(app, state) {
        super('.barcode');
        this._app = app;
        this._state = state;
    }

    startScanning() {
        Quagga.init({
            inputStream: {
                name: "Barcode",
                type: "LiveStream",
                target: this._result
            },
            decoder: {
                readers: ["code_128_reader"]
            }
         }, err => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Initialization finished. Ready to start.');
                Quagga.start();
            }
        );
    }

    stopScanning() {
        Quagga.stop();
    }
}