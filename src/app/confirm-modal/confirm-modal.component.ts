import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() title: string;
  @Input() content: string;
  @Input() confirmCallback: Function;

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.confirmCallback();
    this.activeModal.close();
  }
}
