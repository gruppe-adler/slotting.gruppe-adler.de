import {Component, OnChanges, SimpleChanges, Input, OnInit} from '@angular/core';

import {Converter} from 'showdown';
import {MissionCreate} from '../../models/slotlist-backend/aliases';

@Component({
  templateUrl: './mission-editor.component.html',
  selector: 'app-mission-editor',
})
export class MissionEditorComponent implements OnChanges, OnInit {
  @Input() public mission: MissionCreate;
  public eventDescriptionMd = '';

  private converter: Converter & {makeMarkdown: (string) => string};

  public ngOnInit(): void {
    const converter =  new Converter() as any; // typings havent been updated yet
    converter.setFlavor('github');

    this.converter = converter;

    // this.eventDescriptionMd = this.converter.makeMarkdown(this.mission.detailedDescription || '');
  }
/*
  public ngOnChanges(changes: SimpleChanges): void {
    this.mission.detailedDescription = this.converter.makeHtml(this.eventDescriptionMd);
  }
  */
}
