import { Component, OnInit } from '@angular/core';
import { SlottingService } from '../slotting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditService } from './edit.service';
import { NodeComponent } from './components/node.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-slotting-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  public constructor(
    private router: Router,

  ) {}
  ngOnInit(): void {
  }

  public back(): void {
    console.log('back();'); // TODO
  }
}
