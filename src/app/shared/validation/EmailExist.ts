import { Directive,Component, OnInit, Input } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { of ,Observable, pipe} from 'rxjs';
import { HttpRequestService } from '../../shared/services/http-request.service';
import { GenericVm } from '../../shared/models/system/generic-vm';



import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from '../services/global.service';


@Directive({
    selector: '[EmailExist][ngModel],[EmailExist][FormControl]',
    providers: [
        {provide: NG_ASYNC_VALIDATORS, useExisting: EmailExist, multi: true}
    ]
})
export class EmailExist implements AsyncValidator {
    config: any;
   
    Exist:boolean;
    httpOptions: { headers: HttpHeaders; };
    @Input('userId')
    id: string ;
    constructor(private httRequest: HttpRequestService, public globals: GlobalService) {
        this.httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
      }
     
    validate(control: AbstractControl):  Observable<ValidationErrors |null>{
        return this.httRequest.GetRequest('user/isUserExist/'+control.value+'/'+this.id)
          .pipe(
            map(res => {
              //console.log((res as GenericVm<boolean>).data);
              if ( (res as GenericVm<boolean>).data) {
                // return error (key: value)
                return { 'Exist': true};
              }
              return null;
             
            })
          );
      }
     


   
  

 
}