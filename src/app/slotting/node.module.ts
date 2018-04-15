import { NgModule } from '@angular/core';
import { SlotComponent } from './slot.component';
import { NodeComponent } from './node.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from './shared/shared.service';
import { NgDragDropModule } from 'ng-drag-drop';

@NgModule({
  declarations: [
    SlotComponent,
    NodeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule.forChild(),
    NgDragDropModule.forRoot(),
  ],
  providers: [
    SharedService
  ],
  exports: [
    SlotComponent,
    NodeComponent
  ]
})
export class NodeModule {}
