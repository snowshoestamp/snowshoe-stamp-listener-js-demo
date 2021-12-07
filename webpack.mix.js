const mix = require('laravel-mix');

mix.sass('src/index.scss', 'build/css')
    .js('src/index.js', 'build/js');
