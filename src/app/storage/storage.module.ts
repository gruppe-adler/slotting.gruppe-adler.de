import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { StorageService } from './storage.service';
import { StorageNotificationComponent } from './storage-notification.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    StorageNotificationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserModule,
    TranslateModule.forChild(),
    BrowserAnimationsModule
  ],
  providers: [
    StorageService
  ],
  exports: [
    StorageNotificationComponent
  ]
})
export class StorageModule {
  constructor(@Optional() @SkipSelf() parentModule: StorageModule) {
    throwIfAlreadyLoaded(parentModule, 'StorageModule');
  }
}
