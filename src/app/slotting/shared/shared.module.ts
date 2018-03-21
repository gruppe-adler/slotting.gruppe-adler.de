import { NgModule } from '@angular/core';
import { SharedComponent } from './shared.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { SharedResolver } from './shared.resolver';
import { SharedService } from './shared.service';
import { NodeComponent } from '../node.component';
import { SlotComponent } from '../slot.component';
import { NameDialogComponent } from './name-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SlottingService } from '../slotting.service';
import { NodeModule } from '../node.module';

@NgModule({
  declarations: [
    SharedComponent,
    NameDialogComponent
  ],
  entryComponents: [
    NameDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    NodeModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: SharedComponent,
        resolve: {
          data: SharedResolver
        }
      }
    ])
  ],
  providers: [
    SharedResolver,
    SharedService,
    SlottingService
  ],
  exports: [
    NodeComponent,
    SlotComponent
  ]
})
export class SharedModule {}
