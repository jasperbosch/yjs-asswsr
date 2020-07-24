import {Component} from '@angular/core';
import {AsswsrService} from './services/asswsr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'yjs-asswsr';

  userName;
  tutor = false;

  constructor(private readonly asswsr: AsswsrService) {

    asswsr.userName.subscribe(name => {
      this.userName = name;
      this.tutor = name === 'tutor';
    });

    asswsr.getUser();
  }
}
