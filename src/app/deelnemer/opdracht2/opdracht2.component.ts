import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';
import {interval} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-opdracht2',
  templateUrl: './opdracht2.component.html',
  styleUrls: ['./opdracht2.component.scss']
})
export class Opdracht2Component implements OnInit, AfterViewInit, OnDestroy {

  countdown = 10 * 60;
  progress;
  subs;
  videoUrl = environment.ASSWSR_HTTP_URL + '/assets/img/vingeralfabet2.mp4';

  @ViewChild('content') content: ElementRef;
  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;

  showAlfabet = false;
  alfabetShown = false;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(2);
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

  ngAfterViewInit(): void {
    this.content.nativeElement.style.width = '426px';
  }


  toggleAlfabet(): void {
    this.showAlfabet = !this.showAlfabet;
    if (this.showAlfabet) {
      this.alfabetShown = true;
      this.content.nativeElement.style.width = '826px';
    } else {
      this.content.nativeElement.style.width = '426px';
    }
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'corridor']);
  }

  private sendAnswer(): void {
    const answer = {alfabetShown: this.alfabetShown};
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(2, tijd, answer);
  }


}
