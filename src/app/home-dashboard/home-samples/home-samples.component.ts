import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';


@Component({
  selector: 'app-samples-dashborad',
  templateUrl: './home-samples.component.html',
  styleUrls: ['./home-samples.component.scss']
})
export class HomeSamplesComponent implements OnInit {
  //public Editor = ClassicEditor;
  public Editor = DecoupledEditor;
  dtOptions: DataTables.Settings = {};

  public onReady( editor ) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
  }

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
  }
 
}

open() {
  const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'lg' });
}

}
