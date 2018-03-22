// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api: {
    baseUrl: 'https://www.gruppe-adler.de/wp-json/wp/v2',
    arma3ServersNetKey: 'za5G3UkrmyIiI3ZtId5pibgBl66Bu0fMF',
    forumSocketUrl: 'http://forum.gruppe-adler.de/slotting', // 'http://localhost:4567/slotting'
    forumUrl: 'http://forum.gruppe-adler.de/api' // 'http://localhost:4567/api'
  },
  analytics: {
    analyticsId: '',
    analyticsStorageKey: 'gruppe-adler.de-ga',
    analyticsOptOutKey: 'gruppe-adler.de-ga-disable'
  }
};
