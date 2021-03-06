import { src, dest } from 'gulp';
import rev from 'gulp-rev';
import size from 'gulp-size';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import gulpIf from 'gulp-if';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import sassGlob from 'gulp-sass-glob';
import sourcemaps from 'gulp-sourcemaps';
import modifyCssUrls from 'gulp-modify-css-urls';
import replaceTask from 'gulp-replace-task';

import { rootPath, staticPathStyles, nodeModulesPath, production, development } from '../env';
import { componentsPath, stylesPath, manifestPath, manifestConfig } from '../config';
import { postCSSCallback } from '../postcss.callback';
import { stream } from './webserver';

export const stylesWatchGlob = [`${stylesPath}/**/*.s?(a|c)?ss`, `${componentsPath}/**/*.s?(a|c)?ss`];

export default () =>
  src([...stylesWatchGlob, `!${stylesPath}/**/_*.*`])
    .pipe(gulpIf(development, sourcemaps.init()))
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(concat('main.css'))
    .pipe(
      sass({
        includePaths: [stylesPath, nodeModulesPath],
      }),
    )
    .pipe(
      modifyCssUrls({
        modify(url) {
          if (url && /static\//.test(url)) {
            url = url.replace('static/', '');
          }

          if (url && /images\//.test(url)) {
            url = url.replace('images/', 'img/');
          }

          url = url.replace(/^(\.\/|\.\.\/)|\/$/g, '').replace(/^\/|\/$/g, '');

          return url;
        },
        prepend: '../',
        append: '',
      }),
    )
    .pipe(postcss(postCSSCallback))
    .pipe(plumber.stop())
    .pipe(
      replaceTask({
        patterns: [
          {
            match: 'timestamp',
            replacement: new Date().getTime(),
          },
        ],
      }),
    )
    .pipe(gulpIf(production, rev()))
    .pipe(gulpIf(development, sourcemaps.write('./')))
    .pipe(dest(staticPathStyles))
    .pipe(gulpIf(production, rev.manifest(manifestPath, manifestConfig)))
    .pipe(gulpIf(production, dest(rootPath)))
    .pipe(
      size({
        title: 'styles',
        showFiles: true,
        showTotal: true,
      }),
    )
    .pipe(stream());
