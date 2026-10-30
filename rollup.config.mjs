import { cpSync } from 'node:fs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = ! process.env.ROLLUP_WATCH;

const copy = ( targets ) => ( {
  name: 'copy',
  writeBundle() {
    targets.forEach( ( [ from, to ] ) => cpSync( from, to, { recursive: true } ) );
  },
} );

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
