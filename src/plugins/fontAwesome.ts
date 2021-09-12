import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV, faExternalLinkAlt, faPencilAlt, faShare, faSitemap, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { App } from '@vue/runtime-core';

library.add(faSitemap);
library.add(faExternalLinkAlt);
library.add(faPencilAlt);
library.add(faTrashAlt);
library.add(faShare);
library.add(faEllipsisV);

export default (app: App): void => {
    app.component('font-awesome-icon', FontAwesomeIcon);
};
