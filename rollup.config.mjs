import { cpSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';
import { generateSW } from 'workbox-build';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = ! process.env.ROLLUP_WATCH;

const copy = ( targets ) => ( {
  name: 'copy',
  buildStart() {
    targets.forEach( ( [ from ] ) => {
      if ( ! statSync( from ).isDirectory() ) return;
      readdirSync( from, { recursive: true } ).forEach( file => this.addWatchFile( resolvePath( from, file ) ) );
    } );
  },
  writeBundle() {
    targets.forEach( ( [ from, to ] ) => cpSync( from, to, { recursive: true } ) );
  },
} );

const styles = ( input, output ) => {
  let result;
  return {
    name: 'styles',
    buildStart() {
      result = sass.compile( input, { style: production ? 'compressed' : 'expanded', silenceDeprecations: [ 'import' ] } );
      result.loadedUrls.forEach( url => this.addWatchFile( fileURLToPath( url ) ) );
    },
    writeBundle() {
      mkdirSync( dirname( output ), { recursive: true } );
      writeFileSync( output, result.css );
    },
  };
};

const serviceWorker = ( directory ) => ( {
  name: 'service-worker',
  async closeBundle() {
    const { count, size, warnings } = await generateSW( {
      globDirectory: directory,
      globPatterns: [ '**/*.{html,js,css,png,ico,webmanifest}' ],
      globIgnores: [ '**/twitter-card.png', '**/meta-image.png' ],
      swDest: `${directory}/sw.js`,
      inlineWorkboxRuntime: true,
      sourcemap: false,
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
    } );
    warnings.forEach( warning => this.warn( warning ) );
    console.log( `sw.js precaches ${count} files, ${( size / 1024 ).toFixed( 0 )} kB` );
  },
} );

export default {
  input: 'src/js/Game.js',
  plugins: [
    resolve(),
    copy( [
      [ 'public', 'build' ],
    ] ),
    styles( 'src/scss/styles.sass', 'build/assets/css/styles.css' ),
    production && terser( { format: { comments: false } } ),
    production && serviceWorker( 'build' ),
    ! production && serve( { contentBase: 'build', port: 3000, open: true } ),
    ! production && livereload( { watch: 'build' } ),
  ],
  output: {
    format: 'iife',
    file: 'build/assets/js/cube.js',
    sourcemap: ! production,
  },
  watch: {
    include: [ 'src/**', 'public/**' ],
    clearScreen: false,
  },
};
