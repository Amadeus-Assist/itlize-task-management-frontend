import { EventEmitter, Injectable } from '@angular/core';
import { IAlert } from '../interfaces/ialert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alterEmitter: EventEmitter<IAlert> = new EventEmitter();
  constructor() { }

  emitAlert(alert: IAlert) {
    this.alterEmitter.emit(alert);
  }
}
