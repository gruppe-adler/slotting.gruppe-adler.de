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
import { SlotComponent } from './components/slot.component';
import { NodeComponent } from './components/node.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { SlotAddComponent } from './components/slot-add.component';
import { ContextMenuComponent } from './components/context-menu.component';
import {SlotlistBackendModule} from '../slotlist-backend/slotlist-backend.module';
import {MissionEditorComponent} from './components/mission-editor.component';
import {UtilModule} from '../../../util/util.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    UtilModule,
    SlotlistBackendModule,
    NgDragDropModule.forRoot(),
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
  ],
  declarations: [
    EditComponent,
    MissionEditorComponent,
    SlotComponent,
    SlotAddComponent,
    NodeComponent,
    ContextMenuComponent
  ],
})
export class EditModule {}
