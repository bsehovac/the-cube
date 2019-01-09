class IconsConverter {

	constructor( options ) {

		options = Object.assign( {
			tagName: 'icon',
			className: 'icon',
			styles: false,
      icons: {},
			observe: false,
			convert: false,
		}, options || {} );

		this.tagName = options.tagName;
		this.className = options.className;
		this.icons = options.icons;

		this.svgTag = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		this.svgTag.setAttribute( 'class', this.className );

		if ( options.styles ) this.addStyles();
		if ( options.convert ) this.convertAllIcons();

		if ( options.observe ) {

			const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
			this.observer = new MutationObserver( mutations => { this.convertAllIcons(); } );
			this.observer.observe( document.documentElement, { childList: true, subtree: true } );

		}

		return this;

	}

	convertAllIcons() {

		document.querySelectorAll( this.tagName ).forEach( icon => { this.convertIcon( icon ); } );

	}

	convertIcon( icon ) {

		const svgData = this.icons[ icon.attributes[0].localName ];

		if ( typeof svgData === 'undefined' ) return;

		const svg = this.svgTag.cloneNode( true );
		const viewBox = svgData.viewbox.split( ' ' );

		svg.setAttributeNS( null, 'viewBox', svgData.viewbox );
		svg.style.width = viewBox[2] / viewBox[3] + 'em';
		svg.style.height = '1em';
		svg.innerHTML = svgData.content;

		icon.parentNode.replaceChild( svg, icon );

	}

	addStyles() {

		const style = document.createElement( 'style' );
    style.innerHTML = `.${this.className} { display: inline-block; font-size: inherit; overflow: visible; vertical-align: -0.125em; preserveAspectRatio: none; }`;
		document.head.appendChild( style );

	}

}

const Icons = new IconsConverter( {

  icons: {
    'settings': {
      viewbox: '0 0 512 512',
      content: '<path fill="currentColor" d="M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 0 1-14.832 2.254l-42.584-24.595a191.577 191.577 0 0 1-60.759 35.13v49.182a12.01 12.01 0 0 1-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 0 1-60.759-35.13l-42.584 24.595a12.016 12.016 0 0 1-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 0 1 0-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0 1 14.832-2.254l42.584 24.595a191.577 191.577 0 0 1 60.759-35.13V25.759a12.01 12.01 0 0 1 9.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0 1 60.759 35.13l42.584-24.595a12.016 12.016 0 0 1 14.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 0 1 0 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z" class=""></path>',
    },
    'back': {
      viewbox: '0 0 512 512',
      content: '<path transform="translate(512, 0) scale(-1,1)" fill="currentColor" d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z" class=""></path>',
    },
    'trophy': {
      viewbox: '0 0 576 512',
      content: '<path fill="currentColor" d="M552 64H448V24c0-13.3-10.7-24-24-24H152c-13.3 0-24 10.7-24 24v40H24C10.7 64 0 74.7 0 88v56c0 66.5 77.9 131.7 171.9 142.4C203.3 338.5 240 360 240 360v72h-48c-35.3 0-64 20.7-64 56v12c0 6.6 5.4 12 12 12h296c6.6 0 12-5.4 12-12v-12c0-35.3-28.7-56-64-56h-48v-72s36.7-21.5 68.1-73.6C498.4 275.6 576 210.3 576 144V88c0-13.3-10.7-24-24-24zM64 144v-16h64.2c1 32.6 5.8 61.2 12.8 86.2-47.5-16.4-77-49.9-77-70.2zm448 0c0 20.2-29.4 53.8-77 70.2 7-25 11.8-53.6 12.8-86.2H512v16zm-127.3 4.7l-39.6 38.6 9.4 54.6c1.7 9.8-8.7 17.2-17.4 12.6l-49-25.8-49 25.8c-8.8 4.6-19.1-2.9-17.4-12.6l9.4-54.6-39.6-38.6c-7.1-6.9-3.2-19 6.7-20.5l54.8-8 24.5-49.6c4.4-8.9 17.1-8.9 21.5 0l24.5 49.6 54.8 8c9.6 1.5 13.5 13.6 6.4 20.5z" class=""></path>',
    },
    'share': {
      viewbox: '0 0 36 50',
      content: '<path fill="currentColor" d="M19,4.414L19,32C19,32.552 18.552,33 18,33C17.448,33 17,32.552 17,32L17,4.414L10.707,10.707C10.317,11.098 9.683,11.098 9.293,10.707C8.902,10.317 8.902,9.683 9.293,9.293L18,0.586L26.707,9.293C27.098,9.683 27.098,10.317 26.707,10.707C26.317,11.098 25.683,11.098 25.293,10.707L19,4.414ZM34,18L26,18C25.448,18 25,17.552 25,17C25,16.448 25.448,16 26,16L36,16L36,50L0,50L0,16L10,16C10.552,16 11,16.448 11,17C11,17.552 10.552,18 10,18L2,18L2,48L34,48L34,18Z" />',
    },
    // 'audio': {
    //   viewbox: '0 0 26712 21370',
    //   content: '<g fill="currentColor"><path d="M11966 392l-4951 4950 -5680 0c-738,0 -1336,598 -1336,1336l0 8014c0,737 598,1336 1336,1336l5680 0 4951 4950c836,836 2280,249 2280,-944l0 -18696c0,-1194 -1445,-1780 -2280,-944z"/><path d="M18823 6407c-644,-352 -1457,-120 -1815,526 -356,646 -120,1458 526,1815 718,394 1165,1137 1165,1937 0,800 -446,1543 -1164,1937 -646,357 -882,1169 -526,1815 358,649 1171,879 1815,526 1571,-865 2547,-2504 2547,-4278 0,-1774 -976,-3413 -2548,-4277l0 0z"/><path d="M26712 10685c0,-3535 -1784,-6786 -4773,-8695 -623,-397 -1449,-213 -1843,415 -395,628 -210,1459 412,1857 2212,1413 3533,3814 3533,6423 0,2609 -1321,5010 -3533,6423 -623,397 -807,1228 -412,1856 362,577 1175,843 1843,415 2989,-1909 4773,-5159 4773,-8695z"/></g>',
    // },
    // 'settings': {
    //   viewbox: '0 0 627 627',
    //   content: '<g fill-rule="evenodd" clip-rule="evenodd"><path fill="darkgray" d="M386 114l64 37 103 -20 38 66 -69 79 0 74 69 80 -38 66 -103 -20 -64 37 -35 99c-25,0 -50,0 -76,0l-34 -99 -64 -37 -104 20 -38 -66 69 -80 0 -74 -69 -79 38 -66 104 20 64 -37 34 -100c26,0 51,0 76,0l35 100zm-73 94l91 53 0 105 -91 52 -91 -52 0 -105 91 -53z"/><path fill="#7C7C7D" d="M313 178l118 68 0 135 -118 68 -117 -68 0 -135 117 -68zm0 98l38 37 -38 38 -37 -38 37 -37z"/></g>',
    // },
    // 'back': {
    //   viewbox: '0 0 656 656',
    //   content: '<polygon fill="darkgray" points="254,547 15,328 254,110 254,228 511,228 641,563 425,428 254,428 "/>',
    // },
    // 'trophy': {
    //   viewbox: '0 0 599 599',
    //   content: '<polygon fill="#41AAC8" points="130,14 469,14 469,144 305,335 300,316 294,335 130,144 "/><rect fill="#368DA7" x="226" y="14" width="147" height="227"/><polygon fill="darkgray" points="300,135 494,248 494,473 300,585 105,473 105,248 "/><polygon fill="#7C7C7D" points="300,213 331,311 433,310 350,370 382,467 300,407 217,467 249,370 166,310 268,311 "/>',
    // }
  },

  convert: true,

} );

export { Icons };
