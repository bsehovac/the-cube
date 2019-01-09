class Scrambler {

	constructor( game ) {

		this.game = game;

		this.scrambleLength = 20;

		this.moves = [];
		this.conveted = [];
		this.pring = '';

	}

	scramble( scramble ) {

		let count = 0;
		this.moves = ( typeof scramble !== 'undefined' ) ? scramble.split( ' ' ) : [];

		if ( this.moves.length < 1 ) {

			const faces = 'UDLRFB';
			const modifiers = [ "", "'", "2" ];
			const total = ( typeof scramble === 'undefined' ) ? this.scrambleLength : scramble;

			// TODO: Other Cube Sizes Scramble

			while ( count < total ) {

				const move = faces[ Math.floor( Math.random() * 6 ) ] + modifiers[ Math.floor( Math.random() * 3 ) ];
				if ( count > 0 && move.charAt( 0 ) == this.moves[ count - 1 ].charAt( 0 ) ) continue;
				if ( count > 1 && move.charAt( 0 ) == this.moves[ count - 2 ].charAt( 0 ) ) continue;
				this.moves.push( move );
				count ++;

			}

		}

		this.callback = () => {};
		this.convert();
		this.print = this.moves.join( ' ' );

		return this;

	}

	convert( moves ) {

		this.converted = [];

		this.moves.forEach( move => {

			const face = move.charAt( 0 );
			const modifier = move.charAt( 1 );

			const axis = { D: 'y', U: 'y', L: 'x', R: 'x', F: 'z', B: 'z' }[ face ];
			const row = { D: -1, U: 1, L: -1, R: 1, F: 1, B: -1 }[ face ];

			const position = new THREE.Vector3();
			position[ { D: 'y', U: 'y', L: 'x', R: 'x', F: 'z', B: 'z' }[ face ] ] = row;

			const angle = ( Math.PI / 2 ) * - row * ( ( modifier == "'" ) ? - 1 : 1 );

			const convertedMove = { position, axis, angle, name: move };

			this.converted.push( convertedMove );
			if ( modifier == "2" ) this.converted.push( convertedMove );

		} );

	}

}

export { Scrambler };
