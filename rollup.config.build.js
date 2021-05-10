import minify from 'rollup-plugin-babel-minify';
import resolve from "@rollup/plugin-node-resolve"

export default {
  input: './src/js/Game.js',
  plugins: [
    resolve(),
    // minify({ comments: false, sourceMap: true }),
  ],
  output: {
      format: 'iife',
      file: './static/assets/js/cube.js',
      indent: '\t',
      sourcemap: true,
  },
};
