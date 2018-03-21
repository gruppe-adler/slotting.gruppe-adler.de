import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  template: '<div class="container"><img [src]="data"><button mat-icon-button class="close-icon" (click)="dialogRef.close()"><mat-icon>close</mat-icon></button></div>',
  styles: [
    '.container { display: inline-block; position: relative }',
    '.close-icon { position: absolute; right: 1rem; top: 1rem }',
    'button { background: black; }',
    'mat-icon { color: white; }'
  ]
})
export class LightboxComponent {
  constructor(public dialogRef: MatDialogRef<LightboxComponent>, @Inject(MAT_DIALOG_DATA) public data: string) { }
}
