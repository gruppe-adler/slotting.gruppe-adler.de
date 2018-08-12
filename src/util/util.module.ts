import {NgModule} from '@angular/core';
import {ResponsiveColsDirective} from './response-cols-directive';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    FlexLayoutModule,
  ],
  declarations: [
    ResponsiveColsDirective,
  ],
  exports: [
    ResponsiveColsDirective,
  ]
})
export class UtilModule {}
