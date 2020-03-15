import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import livereload from 'rollup-plugin-livereload';
import {terser} from 'rollup-plugin-terser';
import smelte from 'smelte/rollup-plugin-smelte';
import path from 'path';
import dotenv from 'dotenv';
import {autoPreprocess} from 'svelte-preprocess/dist/autoProcess';

const mode = process.env.NODE_ENV;
dotenv.config({path: path.join(__dirname, mode ? `.env.${mode}` : '.env')});

const development = mode === 'development';
const production = !mode || mode === 'production';
const apiBaseUrl = process.env.API_BASE_URL || '';

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    replace({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.API_BASE_URL': JSON.stringify(apiBaseUrl),
    }),
    svelte({
      dev: development,
      css: css => {
        css.write('public/build/bundle.css');
      },
      preprocess: autoPreprocess(),
    }),
    smelte({
      purge: production,
      output: 'public/global.css',
      whitelist: [],
      whitelistPatterns: [],
      tailwind: {
        colors: {
          primary: '#b027b0',
          secondary: '#009688',
          error: '#f44336',
          success: '#4caf50',
          alert: '#ff9800',
          blue: '#2196f3',
          dark: '#212121',
        },
        darkMode: true,
      },
    }),

    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),

    development && serve(),
    development && livereload('public'),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        });
      }
    },
  };
}
