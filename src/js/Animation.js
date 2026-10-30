class AnimationEngine {

  constructor() {

    this.animations = new Set();
    this.update = this.update.bind( this );
    this.raf = 0;
    this.time = 0;
    this.delta = 0;
    this.maxDelta = 100;
    this.onRender = null;

  }

  update( time ) {

    this.delta = Math.min( Math.max( time - this.time, 0 ), this.maxDelta );
    this.time = time;

    this.raf = ( this.animations.size > 0 || this.onRender ) ? requestAnimationFrame( this.update ) : 0;

    for ( const animation of this.animations ) animation.update( this.delta, this.time );

    if ( this.onRender ) this.onRender();

  }

  request() {

    if ( this.raf !== 0 ) return;

    this.time = performance.now();
    this.raf = requestAnimationFrame( this.update );

  }

  add( animation ) {

    this.animations.add( animation );
    this.request();

  }

  remove( animation ) {

    this.animations.delete( animation );

  }

}

const animationEngine = new AnimationEngine();

class Animation {

  constructor( start ) {

    if ( start === true ) this.start();

  }

  start() {

    animationEngine.add( this );

  }

  stop() {

    animationEngine.remove( this );

  }

  update( delta, time ) {}

}

export { Animation, animationEngine };
