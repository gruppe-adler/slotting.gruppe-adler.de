import { NgModule } from '@angular/core';
import {ApiModule} from '../../../generated/slotlist-backend';
import {SlotlistBackendRepository} from './slotlist-backend.repository';
import {HttpClientModule} from '@angular/common/http';
import {AuthProviderService} from './auth-provider.service';
import {EventService} from './event-service';

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
    SlotlistBackendRepository,
  ],
  exports: [
    // components
  ],
})
export class SlotlistBackendModule {}
