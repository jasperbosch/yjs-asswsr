import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';
import {interval} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-opdracht1',
  templateUrl: './opdracht1.component.html',
  styleUrls: ['./opdracht1.component.scss']
})
export class Opdracht1Component implements OnInit, OnDestroy {

  countdown = 3 * 60;
  progress;
  subs;

  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(1);
  }


  ngOnInit(): void {
    this.subs = interval(100).subscribe(result => {
      this.progress = (((this.countdown - (result / 10)) / this.countdown) * 100);
    });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  handleEvent(event): void {
    if (event.action === 'done') {
      this.sendAnswer();
      this.router.navigate(['deelnemer', 'corridor']);
    }
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'corridor']);
  }

  private sendAnswer(): void {
    // send time to server
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(1, tijd, undefined);
  }
}
