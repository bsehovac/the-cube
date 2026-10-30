import { Animation } from './Animation.js';

class Timer extends Animation {

	constructor( game ) {

		super( false );

		this.game = game;
		this.running = false;
		this.reset();

		document.addEventListener( 'visibilitychange', () => {

			if ( document.hidden && this.running ) this.save();

		} );
		
	}

	start( continueGame ) {

		this.startTime = continueGame ? ( Date.now() - this.deltaTime ) : Date.now();
		this.deltaTime = 0;
		this.convert();

		this.running = true;
		super.start();

	}

	reset() {

		this.startTime = 0;
		this.currentTime = 0;
		this.deltaTime = 0;
		this.converted = '0:00';

	}

	stop() {

		this.currentTime = Date.now();
		this.deltaTime = this.currentTime - this.startTime;
		this.convert();
		this.save();

		this.running = false;
		super.stop();

		return { time: this.converted, millis: this.deltaTime };

	}

	update() {

		const old = Math.floor( this.deltaTime / 1000 );

		this.currentTime = Date.now();
		this.deltaTime = this.currentTime - this.startTime;

		if ( Math.floor( this.deltaTime / 1000 ) != old ) {

			this.convert();
			this.setText();

		}

	}

	save() {

		localStorage.setItem( 'theCube_time', this.deltaTime );

	}

	convert() {

		const seconds = parseInt( ( this.deltaTime / 1000 ) % 60 );
		const minutes = parseInt( ( this.deltaTime / ( 1000 * 60 ) ) );

		this.converted = minutes + ':' + ( seconds < 10 ? '0' : '' ) + seconds;

	}

	setText() {

		this.game.dom.texts.timer.textContent = this.converted;

	}

}

export { Timer };
