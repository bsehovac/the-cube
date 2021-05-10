import { terser } from 'rollup-plugin-terser';
import resolve from "@rollup/plugin-node-resolve"
import scss from 'rollup-plugin-scss'

export default {
  input: './src/js/Game.js',
  plugins: [
    resolve(),
    scss({sourceMap: true, sass: require('sass')}),
    terser(),
  ],
  output: {
      format: 'iife',
      file: './export/cube.js',
      indent: '\t',
      sourcemap: true,
  },
};
