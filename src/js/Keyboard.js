const SIMPLE = {
  KeyR: [ 'R', 1, 1, 1 ],
  KeyL: [ 'L', 1, 1, 1 ],
  KeyU: [ 'U', 1, 1, 1 ],
  KeyD: [ 'D', 1, 1, 1 ],
  KeyF: [ 'F', 1, 1, 1 ],
  KeyB: [ 'B', 1, 1, 1 ],
  KeyM: [ 'L', 2, - 1, 1 ],
  KeyE: [ 'D', 2, - 1, 1 ],
  KeyS: [ 'F', 2, - 1, 1 ],
  KeyX: [ 'R', 1, 0, 1 ],
  KeyY: [ 'U', 1, 0, 1 ],
  KeyZ: [ 'F', 1, 0, 1 ],
};

const HANDS = {
  KeyQ: [ 'F', 1, 1, 1 ],
  KeyW: [ 'U', 1, 1, 1 ],
  KeyE: [ 'B', 1, 1, 1 ],
  KeyA: [ 'L', 1, 1, 1 ],
  KeyS: [ 'D', 1, 1, 1 ],
  KeyD: [ 'R', 1, 1, 1 ],
  KeyZ: [ 'L', 2, - 1, 1 ],
  KeyX: [ 'D', 2, - 1, 1 ],
  KeyC: [ 'F', 2, - 1, 1 ],
  KeyI: [ 'R', 1, 0, 1 ],
  KeyK: [ 'R', 1, 0, - 1 ],
  KeyJ: [ 'U', 1, 0, 1 ],
  KeyL: [ 'U', 1, 0, - 1 ],
  KeyO: [ 'F', 1, 0, 1 ],
  KeyU: [ 'F', 1, 0, - 1 ],
  ArrowUp: [ 'R', 1, 0, 1 ],
  ArrowDown: [ 'R', 1, 0, - 1 ],
  ArrowLeft: [ 'U', 1, 0, 1 ],
  ArrowRight: [ 'U', 1, 0, - 1 ],
};

const SPEEDCUBER = {
  KeyI: [ 'R', 1, 1, 1 ],
  KeyK: [ 'R', 1, 1, - 1 ],
  KeyW: [ 'B', 1, 1, 1 ],
  KeyO: [ 'B', 1, 1, - 1 ],
  KeyS: [ 'D', 1, 1, 1 ],
  KeyL: [ 'D', 1, 1, - 1 ],
  KeyD: [ 'L', 1, 1, 1 ],
  KeyE: [ 'L', 1, 1, - 1 ],
  KeyJ: [ 'U', 1, 1, 1 ],
  KeyF: [ 'U', 1, 1, - 1 ],
  KeyH: [ 'F', 1, 1, 1 ],
  KeyG: [ 'F', 1, 1, - 1 ],
  Semicolon: [ 'U', 1, 0, 1 ],
  KeyA: [ 'U', 1, 0, - 1 ],
  KeyU: [ 'R', 1, 2, 1 ],
  KeyR: [ 'L', 1, 2, - 1 ],
  KeyM: [ 'R', 1, 2, - 1 ],
  KeyV: [ 'L', 1, 2, 1 ],
  KeyT: [ 'L', 1, 0, - 1 ],
  KeyY: [ 'R', 1, 0, 1 ],
  KeyN: [ 'R', 1, 0, - 1 ],
  KeyB: [ 'L', 1, 0, 1 ],
  Period: [ 'R', 2, 2, 1 ],
  KeyX: [ 'L', 2, 2, - 1 ],
  Digit5: [ 'L', 2, 2, 1 ],
  Digit6: [ 'R', 2, 2, - 1 ],
  Digit1: [ 'F', 2, - 1, - 1 ],
  Digit2: [ 'U', 2, - 1, - 1 ],
  Digit9: [ 'U', 2, - 1, 1 ],
  Digit0: [ 'F', 2, - 1, 1 ],
  KeyP: [ 'F', 1, 0, 1 ],
  KeyQ: [ 'F', 1, 0, - 1 ],
  KeyZ: [ 'D', 1, 2, 1 ],
  KeyC: [ 'U', 1, 2, - 1 ],
  Comma: [ 'U', 1, 2, 1 ],
  Slash: [ 'D', 1, 2, - 1 ],
};

const LAYOUTS = {
  hands: { keys: HANDS, shift: true, rotations: false },
  simple: { keys: SIMPLE, shift: true, rotations: true },
  speedcuber: { keys: SPEEDCUBER, shift: false, rotations: false },
};

const LAYERS = {
  Digit2: 2,
  Digit3: 3,
  Digit4: 4,
};

class Keyboard {

  constructor( game ) {

    this.game = game;
    this.layout = 'hands';
    this.layer = 1;
    this.queue = [];
    this.moving = false;

    this.keydown = this.keydown.bind( this );
    this.next = this.next.bind( this );

    window.addEventListener( 'keydown', this.keydown, false );

  }

  keydown( event ) {

    if ( event.repeat || event.ctrlKey || event.altKey || event.metaKey ) return;
    if ( this.game.controls.enabled !== true ) return;

    const layout = LAYOUTS[ this.layout ];
    const move = layout.keys[ event.code ];

    if ( move === undefined ) {

      if ( layout.shift && LAYERS[ event.code ] !== undefined ) {

        this.layer = LAYERS[ event.code ];
        event.preventDefault();

      }

      return;

    }

    event.preventDefault();

    if ( ! layout.shift ) {

      this.queue.push( move );

    } else {

      let [ face, from, to, direction ] = move;

      if ( event.shiftKey && ( to !== 0 || layout.rotations ) ) direction = - direction;
      if ( from === 1 && to === 1 ) from = to = this.layer;

      this.layer = 1;
      this.queue.push( [ face, from, to, direction ] );

    }

    if ( ! this.moving ) this.next();

  }

  next() {

    if ( this.queue.length === 0 ) {

      this.moving = false;
      return;

    }

    const [ face, from, to, direction ] = this.queue.shift();
    const size = this.game.cube.size;
    const end = Math.min( to > 0 ? to : size + to, size );

    if ( from > end || ( from > 1 && end === size ) ) {

      this.next();
      return;

    }

    this.moving = this.game.controls.keyboardMove( face, from, end, direction, this.queue.length > 0, this.next );

    if ( ! this.moving ) this.queue.length = 0;

  }

}

export { Keyboard };
