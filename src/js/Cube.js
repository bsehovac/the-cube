import { RoundedBoxGeometry } from './plugins/RoundedBoxGeometry.js';
import { RoundedPlaneGeometry } from './plugins/RoundedPlaneGeometry.js';

class Cube {

	constructor( game ) {

		this.game = game;

		this.geometry = {
			pieceSize: 1 / 3,
			pieceCornerRadius: 0.12,
			edgeCornerRoundness: 0.15,
			edgeScale: 0.82,
			edgeDepth: 0.01,
		};

		this.holder = new THREE.Object3D();
		this.object = new THREE.Object3D();
		this.animator = new THREE.Object3D();
		this.holder.add( this.animator );
		this.animator.add( this.object );

		this.cubes = [];
		
		this.generatePositions();
		this.generateModel();

		this.pieces.forEach( piece => {

			this.cubes.push( piece.userData.cube );
			this.object.add( piece );

		} );

		this.holder.traverse( node => {

			if ( node.frustumCulled ) node.frustumCulled = false;

		} );

		this.game.world.scene.add( this.holder );

	}

	reset() {

		this.game.controls.edges.rotation.set( 0, 0, 0 );

		this.holder.rotation.set( 0, 0, 0 );
		this.object.rotation.set( 0, 0, 0 );
		this.animator.rotation.set( 0, 0, 0 );

		this.pieces.forEach( piece => {

			piece.position.copy( piece.userData.start.position );
			piece.rotation.copy( piece.userData.start.rotation );

		} );

	}

	generatePositions() {

		let x, y, z;

		this.positions = [];

		for ( x = 0; x < 3; x ++ ) {

			for ( y = 0; y < 3; y ++ ) {

		  	for ( z = 0; z < 3; z ++ ) {

		  		let position = new THREE.Vector3( x - 1, y - 1, z - 1 );
		  		let edges = [];

		  		if ( x == 0 ) edges.push(0);
		  		if ( x == 2 ) edges.push(1);
		  		if ( y == 0 ) edges.push(2);
		  		if ( y == 2 ) edges.push(3);
		  		if ( z == 0 ) edges.push(4);
		  		if ( z == 2 ) edges.push(5);

		  		position.edges = edges;

		  		this.positions.push( position );

		  	}

		  }

		}

	}

	generateModel() {

		this.pieces = [];
		this.edges = [];

		const pieceSize = 1 / 3;

		const mainMaterial = new THREE.MeshLambertMaterial();

		const pieceMesh = new THREE.Mesh(
			new RoundedBoxGeometry( pieceSize, this.geometry.pieceCornerRadius, 3 ),
			mainMaterial.clone()
		);

		const edgeGeometry = RoundedPlaneGeometry(
			pieceSize,
			this.geometry.edgeCornerRoundness,
			this.geometry.edgeDepth );

		this.positions.forEach( ( position, index ) => {

			const piece = new THREE.Object3D();
			const pieceCube = pieceMesh.clone();
			const pieceEdges = [];

			piece.position.copy( position.clone().divideScalar( 3 ) );
			piece.add( pieceCube );
			piece.name = index;
			piece.edgesName = '';

			position.edges.forEach( position => {

				const edge = new THREE.Mesh( edgeGeometry, mainMaterial.clone() );
				const name = [ 'L', 'R', 'D', 'U', 'B', 'F' ][ position ];
				const distance = pieceSize / 2;

				edge.position.set(
				  distance * [ - 1, 1, 0, 0, 0, 0 ][ position ],
				  distance * [ 0, 0, - 1, 1, 0, 0 ][ position ],
				  distance * [ 0, 0, 0, 0, - 1, 1 ][ position ]
				);

				edge.rotation.set(
				  Math.PI / 2 * [ 0, 0, 1, - 1, 0, 0 ][ position ],
				  Math.PI / 2 * [ - 1, 1, 0, 0, 2, 0 ][ position ],
			  	0
				);

				edge.scale.set(
					this.geometry.edgeScale,
					this.geometry.edgeScale,
					this.geometry.edgeScale
				);

				edge.name = name;

				piece.add( edge );
				pieceEdges.push( name );
				this.edges.push( edge );

			} );

			piece.userData.edges = pieceEdges;
			piece.userData.cube = pieceCube;

			piece.userData.start = {
				position: piece.position.clone(),
				rotation: piece.rotation.clone(),
			};

			this.pieces.push( piece );

		} );

	}

}

export { Cube };
