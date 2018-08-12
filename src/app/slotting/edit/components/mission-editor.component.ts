import {Component, Input, OnInit} from '@angular/core';

import {Converter} from 'showdown';
import {MissionCreate} from '../../models/slotlist-backend/aliases';
import {MissionService} from '../../slotlist-backend/mission-service';
import {MissionDetails} from '../../../../generated/slotlist-backend';

@Component({
  templateUrl: './mission-editor.component.html',
  selector: 'app-mission-editor',
})
export class MissionEditorComponent implements OnInit {
  public mission: MissionCreate = {} as any;

  @Input() public forumMatchId: string;

  private converter: Converter & {makeMarkdown: (string) => string};

  public constructor(private missionService: MissionService) {
  }

   public async ngOnInit(): Promise<void> {
    const converter =  new Converter() as any; // typings havent been updated yet
    converter.setFlavor('github');

    this.converter = converter;

    try {
      this.mission = await this.missionService.load(this.forumMatchId);
    } catch (e) {
      console.warn(`mission ${this.forumMatchId} could not be found in slotlist-backend: ${e.message}`);
    }
   }

  public async saveMission() {
    const foo: MissionDetails = await this.missionService.save(this.mission, this.forumMatchId);
    window.console.info(foo);
  }

  private htmlify(mission: MissionCreate): MissionCreate {
    const htmlified: MissionCreate = Object.create(mission);
    htmlified.detailedDescription = this.converter.makeHtml(mission.detailedDescription);

    return htmlified;
  }

/*
  public ngOnChanges(changes: SimpleChanges): void {
    this.mission.detailedDescription = this.converter.makeHtml(this.eventDescriptionMd);
  }
  */
/*
{
        title: missionDetails.title,
        slug: missionDetails.slug,
        description: missionDetails.description,
        detailedDescription: missionDetails.detailedDescription,
        briefingTime: missionDetails.briefingTime,
        slottingTime: missionDetails.slottingTime,
        startTime: missionDetails.startTime,
        endTime: missionDetails.endTime,
        slotsAutoAssignable: missionDetails.slotsAutoAssignable,
        requiredDLCs: missionDetails.requiredDLCs,
      };
 */
}
