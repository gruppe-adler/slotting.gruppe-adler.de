import { Injectable } from '@angular/core';

function _window(): any {
  return window;
}

@Injectable()
export class WindowRef {
  get nativeWindow(): any {
    return _window();
  }

  isMobile(): boolean {
    return this.nativeWindow.innerWidth <= 800;
  }
}
