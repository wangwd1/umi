import addBacon from './addBacon';
import addMetaInfo from './addMetaInfo';
import generateRenderConfig from './generateRenderConfig';

export default function(api) {
  if (!process.env.FD_RENDER) return;

  const { debug } = api.utils;
  const { config } = api.service;

  if (!config.exportStatic || !config.exportStatic.htmlSuffix) {
    throw new Error(
      `
云凤蝶发布的项目，请在 .umijs.rc 里配置：

"exportStatic": {
  "htmlSuffix": true
}
    `.trim(),
    );
  }

  api.register('modifyAFWebpackOpts', ({ memo }) => {
    memo.publicPath = '{{ publicPath }}';
    return memo;
  });

  api.register('modifyHTML', ({ memo, args }) => {
    const { route } = args;
    console.log('route', route);
    let path = route.path.slice(1);
    if (path === '') {
      path = 'index.html';
    }
    memo = addBacon(memo, path);
    memo = addMetaInfo(memo);
    return memo;
  });

  api.register('buildSuccess', () => {
    debug('generate render config...');
    generateRenderConfig(api.service);
    debug('generate render config complete');
  });
}
