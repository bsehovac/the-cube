import * as THREE from 'three';
import { Tween, Easing } from './Tween.js';

class Background {

	constructor( game ) {

		this.game = game;

		this.color = new THREE.Color( 0xd1d5db );
		this.tween = null;

		this.mesh = new THREE.Mesh(
			new THREE.PlaneGeometry( 2, 2 ),
			new THREE.ShaderMaterial( {
				uniforms: {
					color: { value: this.color },
				},
				vertexShader: `
					varying vec2 vUv;
					void main() {
						vUv = uv;
						gl_Position = vec4( position.xy, 1.0, 1.0 );
					}
				`,
				fragmentShader: `
					uniform vec3 color;
					varying vec2 vUv;
					void main() {
						gl_FragColor = vec4( mix( color, vec3( 1.0 ), clamp( vUv.y * 2.0, 0.0, 1.0 ) ), 1.0 );
					}
				`,
				depthTest: false,
				depthWrite: false,
			} )
		);

		this.mesh.frustumCulled = false;
		this.mesh.renderOrder = - 1;

		this.game.world.scene.add( this.mesh );

	}

	setColor( color ) {

		const to = new THREE.Color( color );

		if ( this.tween ) this.tween.stop();

		this.tween = new Tween( {
			target: this.color,
			to: { r: to.r, g: to.g, b: to.b },
			duration: 500,
			easing: Easing.Sine.InOut(),
			onComplete: () => { this.tween = null; },
		} );

	}

}

export { Background };
