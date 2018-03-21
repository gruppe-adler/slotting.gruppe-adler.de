import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  template: `
    <h1>{{'events.name-dialog.heading' | translate}}</h1>
    <form style="text-align: center" (submit)="onSubmit()" [formGroup]="dialogForm">
      <mat-dialog-content>
        <p>
          {{'events.name-dialog.body' | translate}}
        </p>
        <mat-form-field style="width: 100%">
          <input matInput placeholder="{{'events.name-dialog.name-placeholder' | translate}}" formControlName="username">
          <mat-error *ngIf="dialogForm.controls.username.errors">{{'events.name-dialog.name-error' | translate}}</mat-error>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions style="display: flex; justify-content: center">
        <button mat-raised-button style="margin-right: 1rem" type="button" (click)="onCancel()">
          {{'events.name-dialog.button-abort' | translate}}
        </button>
        <button mat-raised-button color="accent" type="submit">{{'events.name-dialog.button-confirm' | translate}}</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: []
})
export class NameDialogComponent {
  public dialogForm = this.formBuilder.group({
    username: ['', Validators.required]
  });

  constructor(public dialogRef: MatDialogRef<NameDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
    this.dialogForm.controls.username.setValue(data);
  }

  /**
   * Called when form is submitted
   */
  public onSubmit(): void {
    console.log(this.dialogForm.controls.username.value);
    if (this.dialogForm.status === 'INVALID') {
      return;
    }
    this.dialogRef.close(this.dialogForm.controls.username.value);
  }

  /**
   * Called when form is cancelled
   */
  public onCancel(): void {
    this.dialogRef.close();
  }
}
