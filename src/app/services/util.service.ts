import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  handelOldAPIVersion() {
    alert('Please update version')
  }

  toOptions(data: any[] = [], valueKey = 'id', nameKey = 'name'){
    return data.map((item)=>({value: item[valueKey], name: item[nameKey]}))
  }
}
