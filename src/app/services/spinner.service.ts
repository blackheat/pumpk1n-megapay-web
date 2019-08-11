import { Injectable, EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  listener: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

}
