// https://stackoverflow.com/a/50837219/1786727
import { Directive, Input, OnInit } from '@angular/core';
import { MatGridList } from '@angular/material';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

export interface IResponsiveColumnsMap {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

// Usage: <mat-grid-list [appResponsiveCols]="{xs: 2, sm: 2, md: 4, lg: 6, xl: 8}">
@Directive({
  selector: '[appResponsiveCols]',
})
export class ResponsiveColsDirective implements OnInit {
  private countBySize: IResponsiveColumnsMap = {xs: 2, sm: 2, md: 4, lg: 6, xl: 8};

  public get cols(): IResponsiveColumnsMap {
    return this.countBySize;
  }

  @Input('responsiveCols')
  public set cols(map: IResponsiveColumnsMap) {
    if (map && ('object' === (typeof map))) {
      this.countBySize = map;
    }
  }

  public constructor(
    private grid: MatGridList,
    private media: ObservableMedia
  ) {
    this.initializeColsCount();
  }

  public ngOnInit(): void {
    this.initializeColsCount();

    this.media.asObservable()
      .subscribe((changes: MediaChange) =>
        this.grid.cols = this.countBySize[changes.mqAlias]
      );
  }

  private initializeColsCount(): void {
    Object.keys(this.countBySize).some(
      (mqAlias: string): boolean => {
        const isActive = this.media.isActive(mqAlias);

        if (isActive) {
          this.grid.cols = this.countBySize[mqAlias];
        }

        return isActive;
      });
  }
}
