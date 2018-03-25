import { NgModule } from '@angular/core';
import { EditComponent } from './edit.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { EditService } from './edit.service';
import { CanEditGuard } from './can-edit.guard';
import { SlottingResolver } from '../slotting.resolver';
import { FormsModule } from '@angular/forms';
import { SlottingService } from '../slotting.service';

@NgModule({
  declarations: [
    EditComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: EditComponent,
        canActivate: [CanEditGuard],
        resolve: {
          data: SlottingResolver
        }
      }
    ])
  ],
  providers: [
    CanEditGuard,
    EditService,
    SlottingResolver,
    SlottingService
  ]
})
export class EditModule {}
