import {Component, Input, OnInit} from '@angular/core';

import {Converter} from 'showdown';
import {MissionCreate} from '../../models/slotlist-backend/aliases';
import {MissionService} from '../../slotlist-backend/mission-service';
import {MissionDetails} from '../../../../generated/slotlist-backend';
import {Router} from '@angular/router';
import {SlugGeneratorService} from '../slug-generator.service';

@Component({
  templateUrl: './mission-editor.component.html',
  selector: 'app-mission-editor',
})
export class MissionEditorComponent implements OnInit {
  public mission: MissionCreate = {} as any;

  @Input() public tid: number;
  @Input() public slug = '';

  private epochString = '1970-01-01T00:00:00Z';

  private converter: Converter & { makeMarkdown: (string) => string };

  public constructor(
    private router: Router,
    private missionService: MissionService,
    private slugGeneratorService: SlugGeneratorService,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    const converter = new Converter() as any; // typings havent been updated yet
    converter.setFlavor('github');

    this.converter = converter;

    return this.reload();
  }

  public async reload(): Promise<void> {

    try {
      if (this.slug) {
        this.mission = await this.missionService.load(this.slug);
      } else {
        this.slug = this.slugGeneratorService.createSlug(this.mission);
        this.mission = this.emptyMissionCreate(this.slug);
      }
    } catch (e) {
      console.warn(`mission ${this.slug} could not be found in slotlist-backend: ${e.message}`);
    }
  }

  public async save(): Promise<void> {
    try {
      const foo: MissionDetails = await this.missionService.save(this.mission);
      this.router.navigate(['slotting', 'edit'], {queryParams: {tid: this.tid, matchid: foo.slug}});
    } catch (e) {
      window.console.error('couldnt save :(' + e.message);
    }
  }

  private htmlify(mission: MissionCreate): MissionCreate {
    const htmlified: MissionCreate = Object.create(mission);
    htmlified.detailedDescription = this.converter.makeHtml(mission.detailedDescription);

    return htmlified;
  }

  private emptyMissionCreate(slug: string): MissionCreate {
    return {
      title: '',
      slug: slug,
      description: '',
      detailedDescription: '',
      briefingTime: this.epochString,
      slottingTime: this.epochString,
      startTime: this.epochString,
      endTime: this.epochString,
      slotsAutoAssignable: true,
      requiredDLCs: ['Apex'],

    };
  }
}
