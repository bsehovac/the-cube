import { Draggable } from './Draggable.js';

const RangeHTML = [

  '<div class="range">',
    '<div class="range__label"></div>',
    '<div class="range__track">',
      '<div class="range__track-line"></div>',
      '<div class="range__handle" role="slider" tabindex="0"><div></div></div>',
    '</div>',
    '<div class="range__list"></div>',
  '</div>',

].join( '\n' );

document.querySelectorAll( 'range' ).forEach( el => {

  const temp = document.createElement( 'div' );
  temp.innerHTML = RangeHTML;

  const range = temp.querySelector( '.range' );
  const rangeLabel = range.querySelector( '.range__label' );
  const rangeList = range.querySelector( '.range__list' );

  range.setAttribute( 'name', el.getAttribute( 'name' ) );
  rangeLabel.innerHTML = el.getAttribute( 'title' );

  range.querySelector( '.range__handle' ).setAttribute( 'aria-label', el.getAttribute( 'title' ) );

  if ( el.hasAttribute( 'color' ) ) {

    range.classList.add( 'range--type-color' );
    range.classList.add( 'range--color-' + el.getAttribute( 'name' ) );

  }

  if ( el.hasAttribute( 'list' ) ) {

    const items = el.getAttribute( 'list' ).split( ',' );

    rangeList.style.gridTemplateColumns = `repeat( ${items.length - 1}, 1fr )`;

    items.forEach( ( listItemText, index ) => {

      const listItem = document.createElement( 'div' );
      listItem.innerHTML = listItemText;
      listItem.style.gridColumn = index + 1;
      rangeList.appendChild( listItem );

    } );

  }

  el.parentNode.replaceChild( range, el );

} );

class Range {

  constructor( name, options ) {

    options = Object.assign( {
      range: [ 0, 1 ],
      value: 0,
      step: 0,
      onUpdate: () => {},
      onComplete: () => {},
    }, options || {} );

    this.element = document.querySelector( '.range[name="' + name + '"]' );
    this.track = this.element.querySelector( '.range__track' );
    this.handle = this.element.querySelector( '.range__handle' );
    this.list = [].slice.call( this.element.querySelectorAll( '.range__list div' ) );

    this.value = options.value;
    this.min = options.range[0];
    this.max = options.range[1];
    this.step = options.step;

    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;

    this.handle.setAttribute( 'aria-valuemin', Math.min( this.min, this.max ) );
    this.handle.setAttribute( 'aria-valuemax', Math.max( this.min, this.max ) );

    this.setValue( this.value );

    this.initDraggable();
    this.initKeyboard();
    this.initLabels();

  }

  initLabels() {

    this.element.querySelector( '.range__label' ).addEventListener( 'click', () => this.focus(), false );

    this.list.forEach( ( item, index ) => {

      item.addEventListener( 'click', () => {

        this.focus();

        if ( this.update( this.min + ( this.max - this.min ) * index / ( this.list.length - 1 ) ) )
          this.onComplete( this.value );

      }, false );

    } );

  }

  focus() {

    this.handle.focus( { preventScroll: true } );

  }

  update( value ) {

    const previous = this.value;

    this.setValue( value );

    if ( this.value === previous ) return false;

    this.onUpdate( this.value );

    return true;

  }

  initKeyboard() {

    this.handle.addEventListener( 'keydown', event => {

      const step = this.step >= 1 ? this.step : ( this.max - this.min ) / 20;

      const value = {
        ArrowLeft: this.value - step,
        ArrowDown: this.value - step,
        ArrowRight: this.value + step,
        ArrowUp: this.value + step,
        Home: this.min,
        End: this.max,
      }[ event.key ];

      if ( value === undefined ) return;

      event.preventDefault();

      if ( this.update( value ) ) this.onComplete( this.value );

    }, false );

  }

  setValue( value ) {

    this.value = this.round( this.limitValue( value ) );
    this.setHandlePosition();

  }

  initDraggable() {

    let current;

    this.draggable = new Draggable( this.track, { calcDelta: true } );

    this.draggable.onDragStart = ( position, event ) => {

      this.focus();
      this.track.setAttribute( 'data-drag', '' );

      if ( this.handle.contains( event.target ) ) {

        current = this.positionFromValue( this.value );

      } else {

        current = this.limitPosition( position.current.x - this.track.getBoundingClientRect().left );
        this.update( this.valueFromPosition( current ) );

      }

    }

    this.draggable.onDragMove = position => {

      current = this.limitPosition( current + position.delta.x );
      this.value = this.round( this.valueFromPosition( current ) );
      this.setHandlePosition();
      
      this.onUpdate( this.value );

    }

    this.draggable.onDragEnd = position => {

      this.track.removeAttribute( 'data-drag' );
      this.onComplete( this.value );

    }

  }

  round( value ) {

    if ( this.step < 1 ) return value;

    return Math.round( ( value - this.min ) / this.step ) * this.step + this.min;

  }

  limitValue( value ) {

    const max = Math.max( this.max, this.min );
    const min = Math.min( this.max, this.min );

    return Math.min( Math.max( value, min ), max );

  }

  limitPosition( position ) {

    return Math.min( Math.max( position, 0 ), this.track.offsetWidth );

  }

  percentsFromValue( value ) {

    return ( value - this.min ) / ( this.max - this.min );

  }

  valueFromPosition( position ) {

    return this.min + ( this.max - this.min ) * ( position / this.track.offsetWidth );

  }

  positionFromValue( value ) {

    return this.percentsFromValue( value ) * this.track.offsetWidth;

  }

  setHandlePosition() {

    this.handle.style.left = this.percentsFromValue( this.value ) * 100 + '%';

    const item = this.step >= 1 ? this.list[ Math.round( ( this.value - this.min ) / this.step ) ] : undefined;

    this.handle.setAttribute( 'aria-valuenow', Math.round( this.value ) );
    this.handle.setAttribute( 'aria-valuetext', item ? item.textContent.trim() : Math.round( this.value ) );

  }

}

export { Range };
