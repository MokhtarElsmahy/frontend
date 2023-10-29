import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalService } from '../../services/confirmation-modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() name;
  
  constructor(public activeModal: NgbActiveModal,
    public confirmationModalService: ConfirmationModalService) {}

  ngOnInit(): void {
  }

  setConfirmed(confirmed: boolean) {
    if(confirmed){
      this.confirmationModalService.setConfirmed(confirmed);
    }
  }
  Excute(confirmed: boolean) {
    if(confirmed)
     this.confirmationModalService.Execute(confirmed)
  }

}
