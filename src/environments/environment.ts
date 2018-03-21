// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api: {
    baseUrl: 'https://www.gruppe-adler.de/wp-json/wp/v2',
    arma3ServersNetKey: 'za5G3UkrmyIiI3ZtId5pibgBl66Bu0fMF',
    forumSocketUrl: 'http://localhost:4567/slotting', //'http://forum.gruppe-adler.de/slotting'
    forumUrl: 'http://localhost:4567/api' //'http://forum.gruppe-adler.de/api'
  },
  analytics: {
    analyticsId: '',
    analyticsStorageKey: 'gruppe-adler.de-ga',
    analyticsOptOutKey: 'gruppe-adler.de-ga-disable'
  }
};
