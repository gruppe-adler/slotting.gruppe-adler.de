export const environment = {
  production: true,
  ignoreMissingPermissions: true,
  api: {
    baseUrl: 'https://www.gruppe-adler.de/wp-json/wp/v2',
    arma3ServersNetKey: 'za5G3UkrmyIiI3ZtId5pibgBl66Bu0fMF',
    forumSocketUrl: 'https://forum.gruppe-adler.de/slotting',
    forumUrl: 'https://forum.gruppe-adler.de/api',
    slotlistBackendEndpoint: 'https://api.slotlist.info'
  },
  storageKeys: {
    showGroupColor: 'grad-slotting-showGroupColor',
    showMinified: 'grad-slotting-showMinified'
  },
  openIdAuthUrl: 'https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.return_to={return_url}&openid.realm={realm}'
};
