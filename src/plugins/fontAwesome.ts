import { library } from '@fortawesome/fontawesome-svg-core';
import { faExternalLinkAlt, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { App } from '@vue/runtime-core';

library.add(faSitemap);
library.add(faExternalLinkAlt);

export default (app: App): void => {
    app.component('font-awesome-icon', FontAwesomeIcon);
};
