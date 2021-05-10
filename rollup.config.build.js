import { terser } from 'rollup-plugin-terser';
import resolve from "@rollup/plugin-node-resolve"
import scss from 'rollup-plugin-scss'
import postcss from "postcss";
import autoprefixer from "autoprefixer";

export default {
  input: './src/js/Game.js',
  plugins: [
    resolve(),
    scss({sourceMap: true, sass: require('sass'),
      processor: css =>
        postcss([autoprefixer()]),
    }),
    terser(),
  ],
  output: {
      format: 'iife',
      file: './export/cube.js',
      indent: '\t',
      sourcemap: true,
  },
};
