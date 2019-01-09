class Themes {

  constructor( game ) {

    this.game = game;
    this.theme = null;

    this.colors = {
      cube: {
        U: 0xfff7ff, // white
        D: 0xffef48, // yellow
        F: 0xef3923, // red
        R: 0x41aac8, // blue
        B: 0xff8c0a, // orange
        L: 0x82ca38, // green
        P: 0x08101a, // piece
        G: 0xd1d5db, // background
      },
      erno: {
        U: 0xffffff, // white
        D: 0xffd500, // yellow
        F: 0xc41e3a, // red
        R: 0x0051ba, // blue
        B: 0xff5800, // orange
        L: 0x009e60, // green
        P: 0x111111, // piece
        G: 0x8abdff, // background
      },
      dust: {
        U: 0xfff6eb, // white
        D: 0xe7c48d, // yellow
        F: 0x8f253e, // red
        R: 0x607e69, // blue
        B: 0xbe6f62, // orange
        L: 0x849f5d, // green
        P: 0x111111, // piece
        G: 0xE7C48D, // background
      },
      camo: {
        U: 0xfff6eb, // white
        D: 0xbfb672, // yellow
        F: 0x805831, // orange
        R: 0x718456, // green
        B: 0x37241c, // red
        L: 0x37431d, // blue
        P: 0x111111, // piece
        G: 0xBFB672, // background
      },
      rain: {
        U: 0xfafaff, // white
        D: 0xedb92d, // yellow
        F: 0xce2135, // red
        R: 0x449a89, // blue
        B: 0xec582f, // orange
        L: 0xa3a947, // green
        P: 0x111111, // piece
        G: 0x87b9ac, // background
      },
    };

  }

  setTheme( theme ) {

    if ( theme === this.theme ) return;

    this.theme = theme;

    const colors = this.colors[ this.theme ];

    this.game.cube.pieces.forEach( piece => {

      piece.userData.cube.material.color.setHex( colors.P );

    } );

    this.game.cube.edges.forEach( edge => {

      edge.material.color.setHex( colors[ edge.name ] );

    } );

    this.game.dom.rangeHandles.forEach( handle => {

      handle.style.background = '#' + colors.R.toString(16).padStart(6, '0');

    } );

    this.game.confetti.updateColors( colors );

    this.game.dom.back.style.background = '#' + colors.G.toString(16).padStart(6, '0');

  }

}

export { Themes };
