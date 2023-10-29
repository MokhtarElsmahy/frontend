import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { GlobalService } from './shared/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lib-gbh';

  constructor(private router: Router,private global: GlobalService){
    this.global.initLanguage();
    router.events.subscribe(
      (event) => {
          if ( event instanceof NavigationStart ) {
              // Handle Navigation Start
              this.global.clearMessages();
          }

          if ( event instanceof NavigationEnd ) {
              // Handle Navigation End
             
          }
      });

  }
  
}