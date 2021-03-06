import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';
import ignore from "rollup-plugin-ignore";

const extensions = ['.mjs', '.js', '.ts', '.json'];

export default {
    input: './src/main.ts',
    external: ['modules/index.js'],
    plugins: [
        // Allows node_modules resolution
        resolve({ extensions }),

        // Compile TypeScript
        typescript(),

        json(),

        // Resolve CommonJS modules
        commonJS({ extensions }),

        // Transpile to ES5
        babel({
            extensions,
            babelHelpers: 'bundled',
        }),
        ignore(['nakama-runtime'])
    ],
    output: {
        file: pkg.main,
    },
};