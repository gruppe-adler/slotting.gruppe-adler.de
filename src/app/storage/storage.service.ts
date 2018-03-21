import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class StorageService {
  @Output() acceptStatusChanged = new EventEmitter<boolean>();

  private readonly localStorageAcceptedKey = 'gruppe-adler.de-storage-accepted';
  private storage: Storage = sessionStorage;

  constructor() {
    this.setStorage();
  }

  public get(key: string): string {
    return this.storage.getItem(key);
  }

  public set(key: string, data: string): void {
    this.storage.setItem(key, data);
  }

  public getObject<T extends object>(key: string): T {
    return JSON.parse(this.storage.getItem(key)) as T;
  }

  public setObject(key: string, data: object): void {
    this.storage.setItem(key, JSON.stringify(data));
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  public isLocalStorageAccepted(): boolean {
    return localStorage.getItem(this.localStorageAcceptedKey) != null;
  }

  public setLocalStorageAccepted(accepted: boolean): void {
    if (accepted) {
      this.storage = localStorage;
      localStorage.setItem(this.localStorageAcceptedKey, 'true');
      this.copyStorage(sessionStorage, localStorage);
      sessionStorage.clear();
    } else {
      localStorage.removeItem(this.localStorageAcceptedKey);
      this.storage = sessionStorage;
      this.copyStorage(localStorage, sessionStorage);
      localStorage.clear();
    }

    this.acceptStatusChanged.emit(accepted);
  }

  private copyStorage(from: Storage, to: Storage): void {
    for (let i = 0; i < from.length; i++) {
      const key = from.key(i);
      const data = from.getItem(key);
      to.setItem(key, data);
    }
  }

  private setStorage() {
    this.storage = this.isLocalStorageAccepted() ? localStorage : sessionStorage;
    if (this.storage === sessionStorage) {
      localStorage.clear();
    }
  }
}
