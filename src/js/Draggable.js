window.addEventListener( 'touchmove', () => {} );
document.addEventListener( 'touchmove',  event => { event.preventDefault(); }, { passive: false } );

class Draggable {

  constructor( element, options ) {

    this.position = {
      current: new THREE.Vector2(),
      start: new THREE.Vector2(),
      delta: new THREE.Vector2(),
      old: new THREE.Vector2(),
      drag: new THREE.Vector2(),
      // momentum: new THREE.Vector2(),
    };

    this.options = Object.assign( {
      calcDelta: false,
      // calcMomentum: false,
    }, options || {} );

    // if ( this.options.calcMomentum ) this.options.calcDelta = true;

    this.element = element;
    this.touch = null;

    this.drag = {

      start: ( event ) => {

        if ( event.type == 'mousedown' && event.which != 1 ) return;
        if ( event.type == 'touchstart' && event.touches.length > 1 ) return;

        this.getPositionCurrent( event );

        if ( this.options.calcDelta ) {

          this.position.start = this.position.current.clone();
          this.position.delta.set( 0, 0 );
          this.position.drag.set( 0, 0 );

        }

        // if ( this.options.calcMomentum ) {

        //     this.position.momentum.set( 0, 0 );

        // }

        this.touch = ( event.type == 'touchstart' );

        this.onDragStart( this.position );

        window.addEventListener( ( this.touch ) ? 'touchmove' : 'mousemove', this.drag.move, false );
        window.addEventListener( ( this.touch ) ? 'touchend' : 'mouseup', this.drag.end, false );

      },

      move: ( event ) => {

        if ( this.options.calcDelta ) {

          this.position.old = this.position.current.clone();

        }

        this.getPositionCurrent( event );

        if ( this.options.calcDelta ) {

          this.position.delta = this.position.current.clone().sub( this.position.old );
          this.position.drag = this.position.current.clone().sub( this.position.start );

        }

        // if ( this.options.calcMomentum ) {

        //   this.addMomentumPoint( this.position.delta );

        // }

        this.onDragMove( this.position );

      },

      end: ( event ) => {

        this.getPositionCurrent( event );

        // if ( this.options.calcMomentum ) this.getMomentum();

        this.onDragEnd( this.position );

        window.removeEventListener( ( this.touch ) ? 'touchmove' : 'mousemove', this.drag.move, false );
        window.removeEventListener( ( this.touch ) ? 'touchend' : 'mouseup', this.drag.end, false );

      },

    };

    this.onDragStart = () => {};
    this.onDragMove = () => {};
    this.onDragEnd = () => {};

    this.enable();

    return this;

  }

  enable() {

    this.element.addEventListener( 'touchstart', this.drag.start, false );
    this.element.addEventListener( 'mousedown', this.drag.start, false );

    return this;

  }

  disable() {

    this.element.removeEventListener( 'touchstart', this.drag.start, false );
    this.element.removeEventListener( 'mousedown', this.drag.start, false );

    return this;

  }

  getPositionCurrent( event ) {

    const dragEvent = event.touches
      ? ( event.touches[ 0 ] || event.changedTouches[ 0 ] )
      : event;

    this.position.current.set( dragEvent.pageX, dragEvent.pageY );

  }

  convertPosition( position ) {

    position.x = ( position.x / this.element.offsetWidth ) * 2 - 1;
    position.y = - ( ( position.y / this.element.offsetHeight ) * 2 - 1 );

    return position;

  }

  // addMomentumPoint( delta ) {

  //   const time = Date.now();

  //   while ( this.momentum.length > 0 ) {

  //     if ( time - this.momentum[0].time <= 200 ) break;
  //     this.momentum.shift();

  //   }

  //   if ( delta !== false ) this.momentum.push( { delta, time } );

  // }

  // getMomentum() {

  //   const points = this.momentum.length;
  //   const momentum = new THREE.Vector2();

  //   this.addMomentumPoint( false );

  //   this.momentum.forEach( ( point, index ) => {

  //     momentum.add( point.delta.multiplyScalar( index / points ) )

  //   } );

  //   return momentum;

  // }

}

export { Draggable };
