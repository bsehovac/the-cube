import { terser } from 'rollup-plugin-terser';
import resolve from "@rollup/plugin-node-resolve"

export default {
  input: './src/js/Game.js',
  plugins: [
    resolve(),
    terser(),
  ],
  output: {
      format: 'iife',
      file: './static/assets/js/cube.js',
      indent: '\t',
      sourcemap: true,
  },
};
