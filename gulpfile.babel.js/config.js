import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import zlib from 'zlib';
import imagemin from 'gulp-imagemin';
import imageminOptipng from 'imagemin-optipng';

import { getData } from './get-data';
import { cacheDirectory, development, production } from './env';

export const publicPath = 'public';
export const htmlPath = 'src/templates';
export const fontsPath = 'src/fonts';
export const imagesPath = 'src/images';
export const stylesPath = 'src/styles';
export const scriptsPath = 'src/scripts';
export const svgStorePath = 'src/svgstore';
export const componentsPath = 'src/shared/components';
export const manifestConfig = {
  merge: true,
};
export const manifestPath = resolve(cacheDirectory, 'rev-manifest.json');

export const checkManifestPath = () => {
  if (!existsSync(manifestPath)) {
    writeFileSync(manifestPath, '{}');
  }
};

export const htmlFormatConfig = {
  indent_size: 2,
  indent_char: ' ',
  brace_style: 'expand',
  end_with_newline: true,
  preserve_newlines: true,
  indent_handlebars: true,
  indent_inner_html: false,
  max_preserve_newlines: 1,
  unformatted: [
    'abbr',
    'area',
    'b',
    'bdi',
    'bdo',
    'br',
    'cite',
    'textarea',
    'pre',
    'code',
    'data',
    'datalist',
    'del',
    'dfn',
    'em',
    'embed',
    'i',
    'ins',
    'kbd',
    'keygen',
    'map',
    'mark',
    'math',
    'meter',
    'noscript',
    'script',
    'object',
    'output',
    'progress',
    'q',
    'ruby',
    's',
    'samp',
    'small',
    'strong',
    'sub',
    'sup',
    'template',
    'time',
    'u',
    'var',
    'wbr',
    'text',
    'acronym',
    'address',
    'big',
    'dt',
    'ins',
    'strike',
    'tt',
  ],
};

export const testsPatterns = ['**/__tests__/**/*.(j|t)s?(x)', '**/?(*.)+(spec|test).(j|t)s?(x)'];

export const commonSVGO = [
  { sortAttrs: true },
  { removeDesc: true },
  { removeTitle: true },
  { removeDoctype: true },
  { removeViewBox: false },
  { removeMetadata: true },
  { removeComments: true },
  { removeEmptyText: true },
  { removeEmptyAttrs: true },
  { removeDimensions: true },
  { removeStyleElement: true },
  { removeUselessDefs: true },
  { removeXMLProcInst: true },
  { transformsWithOnePath: true },
  {
    cleanupNumericValues: {
      floatPrecision: 2,
    },
  },
  {
    convertColors: {
      names2hex: true,
      rgb2hex: true,
    },
  },
];

export const htmlminConfig = {
  minifyJS: true,
  minifyCSS: true,
  removeComments: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  processConditionalComments: true,
  removeAttributeQuotes: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
};

export const brotliConfig = {
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
  },
};

export const imageminConfig = [
  imagemin.gifsicle({
    interlaced: true,
    optimizationLevel: 3,
  }),
  imagemin.mozjpeg({
    interlaced: true,
    progressive: true,
  }),
  imagemin.optipng(
    {
      optimizationLevel: 5,
    },
    {
      use: imageminOptipng(),
    },
  ),
  imagemin.svgo({
    plugins: [
      ...commonSVGO,
      { cleanupIDs: true },
      { removeViewBox: false },
      { removeHiddenElems: true },
      { removeEditorsNSData: true },
      { removeEmptyContainers: true },
      { removeUselessStrokeAndFill: false },
      {
        removeAttrs: {
          attrs: ['id', 'class', 'data-name'],
        },
      },
    ],
  }),
];

export const pugConfig = plugins => ({
  data: getData(),
  plugins,
  basedir: [componentsPath, htmlPath, publicPath],
  debug: false,
  pretty: true,
  verbose: false,
});

export const nunjucksRenderConfig = {
  ext: '.html',
  web: { async: true },
  data: getData(),
  path: [componentsPath, htmlPath, publicPath],
  envOptions: {
    watch: development,
  },
};

export const webpConfig = {
  ...((production && {
    quality: 80,
    method: 6,
  }) ||
    {}),
};

export { environment } from './env/transform';
