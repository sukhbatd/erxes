module.exports = {
  srcDir: __dirname,
  name: 'dealmap',
  port: 3038,
  scope: 'dealmap',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3038/remoteEntry.js',
    scope: 'dealmap',
    module: './routes'
  },
  menus: [
    {
      text: 'Dealmaps',
      to: '/dealmaps',
      image: '/images/icons/erxes-18.svg',
      location: 'settings',
      scope: 'dealmap'
    }
  ]
};
