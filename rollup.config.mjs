import { cpSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';
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

export default {
  input: 'src/js/Game.js',
  plugins: [
    resolve(),
    copy( [
      [ 'public', 'build' ],
      [ 'node_modules/upup/dist/upup.min.js', 'build/upup.min.js' ],
      [ 'node_modules/upup/dist/upup.min.js.map', 'build/upup.min.js.map' ],
      [ 'node_modules/upup/dist/upup.sw.min.js', 'build/upup.sw.min.js' ],
      [ 'node_modules/upup/dist/upup.sw.min.js.map', 'build/upup.sw.min.js.map' ],
    ] ),
    styles( 'src/scss/styles.sass', 'build/assets/css/styles.css' ),
    production && terser( { format: { comments: false } } ),
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
