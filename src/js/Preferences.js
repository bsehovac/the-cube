import { Range } from './Range.js';

class Preferences {

  constructor( game ) {

    this.game = game;

  }

  init() {

    const getProgressInRange = ( value, start, end ) => {

      return Math.min( Math.max( (value - start) / (end - start), 0 ), 1 );
      
    }

    this.ranges = {

      flip: new Range( 'flip', {
        value: this.game.controls.flipConfig,
        range: [ 0, 2 ],
        step: 1,
        onUpdate: value => {

          this.game.controls.flipConfig = value;

        },
        onComplete: () => this.game.storage.savePreferences(),
      } ),

      scramble: new Range( 'scramble', {
        value: this.game.scrambler.scrambleLength,
        range: [ 20, 30 ],
        step: 5,
        onUpdate: value => {

          this.game.scrambler.scrambleLength = value;

        },
        onComplete: () => this.game.storage.savePreferences()
      } ),

      fov: new Range( 'fov', {
        value: this.game.world.fov,
        range: [ 2, 45 ],
        onUpdate: value => {

          this.game.world.fov = value;
          this.game.world.resize();

        },
        onComplete: () => this.game.storage.savePreferences()
      } ),

      theme: new Range( 'theme', {
        value: { cube: 0, erno: 1, dust: 2, camo: 3, rain: 4 }[ this.game.themes.theme ],
        range: [ 0, 4 ],
        step: 1,
        onUpdate: value => {

          const theme = [ 'cube', 'erno', 'dust', 'camo', 'rain' ][ value ]
          this.game.themes.setTheme( theme );

        },
        onComplete: () => this.game.storage.savePreferences()
      } ),

    };
    
  }

}

export { Preferences };
