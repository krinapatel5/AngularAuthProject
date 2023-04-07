import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public modalValue = new Subject();
  constructor() {}

  onModalClose(params: any) {
    this.modalValue.next(params);
  }

  getModalClose() {
    return this.modalValue;
  }
}
