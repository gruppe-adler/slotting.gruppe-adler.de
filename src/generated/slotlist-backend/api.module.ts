import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from './configuration';

import { V1authService } from './api/v1auth.service';
import { V1communitiesService } from './api/v1communities.service';
import { V1missionSlotTemplatesService } from './api/v1missionSlotTemplates.service';
import { V1missionsService } from './api/v1missions.service';
import { V1notificationsService } from './api/v1notifications.service';
import { V1statusService } from './api/v1status.service';
import { V1usersService } from './api/v1users.service';

@NgModule({
  imports:      [ CommonModule, HttpClientModule ],
  declarations: [],
  exports:      [],
  providers: [
    V1authService,
    V1communitiesService,
    V1missionSlotTemplatesService,
    V1missionsService,
    V1notificationsService,
    V1statusService,
    V1usersService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        }
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import your base AppModule only.');
        }
    }
}
