import { NgModule } from '@angular/core';
import {ApiModule} from '../../../generated/slotlist-backend';
import {SlotlistBackendMigrationService} from './slotlist-backend-migration.service';
import {HttpClientModule} from '@angular/common/http';
import {AuthProviderService} from './auth-provider.service';
import {EventService} from './event-service';
import {MissionService} from './mission-service';
import {SlotGroupService} from './slot-group.service';

@NgModule({
  declarations: [
    // components
  ],
  entryComponents: [
  ],
  imports: [
    ApiModule,
    HttpClientModule,
  ],
  providers: [
    AuthProviderService,
    EventService,
    MissionService,
    SlotGroupService,
    SlotlistBackendMigrationService,
  ],
  exports: [
    // components
  ],
})
export class SlotlistBackendModule {}
