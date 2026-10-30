import { Animation, animationEngine } from './Animation.js';
import { Easing } from './Easing.js';

class Tween extends Animation {

  constructor( options ) {

    super( false );

    this.duration = options.duration || 500;
    this.easing = options.easing || ( t => t );
    this.onUpdate = options.onUpdate || ( () => {} );
    this.onComplete = options.onComplete || ( () => {} );

    this.delay = options.delay || 0;
    this.yoyo = options.yoyo === true;

    this.progress = 0;
    this.value = 0;
    this.delta = 0;

    this.getFromTo( options );

    super.start();

    this.startTime = animationEngine.time + this.delay;

    this.onUpdate( this );

  }

  update( delta, time ) {

    const elapsed = time - this.startTime;

    if ( elapsed < 0 ) return;

    const old = this.value;

    this.progress = elapsed / this.duration;

    if ( this.yoyo ) this.updateYoyo();
    else if ( this.progress < 1 ) this.value = this.easing( this.progress );
    else {

      this.progress = 1;
      this.value = 1;

    }

    this.delta = this.value - old;

    if ( this.values !== null ) this.updateFromTo();

    this.onUpdate( this );

    if ( ! this.yoyo && this.progress === 1 ) {

      this.onComplete( this );
      super.stop();

    }

  }

  updateYoyo() {

    const cycle = Math.floor( this.progress );

    this.progress -= cycle;
    if ( cycle % 2 === 1 ) this.progress = 1 - this.progress;

    this.value = this.easing( this.progress );

  }

  updateFromTo() {

    this.values.forEach( key => {

      this.target[ key ] = this.from[ key ] + ( this.to[ key ] - this.from[ key ] ) * this.value;

    } );

  }

  getFromTo( options ) {

    if ( ! options.target || ! options.to ) {

      this.values = null;
      return;

    }

    this.target = options.target || null;
    this.from = options.from || {};
    this.to = options.to || null;
    this.values = [];

    if ( Object.keys( this.from ).length < 1 )
      Object.keys( this.to ).forEach( key => { this.from[ key ] = this.target[ key ]; } );

    Object.keys( this.to ).forEach( key => { this.values.push( key ) } );

  }

}

export { Tween, Easing };
