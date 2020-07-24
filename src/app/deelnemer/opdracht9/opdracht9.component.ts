import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {faCheck, faPlus} from '@fortawesome/free-solid-svg-icons';
import {CountdownComponent} from 'ngx-countdown';
import {interval} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-opdracht9',
  templateUrl: './opdracht9.component.html',
  styleUrls: ['./opdracht9.component.scss']
})
export class Opdracht9Component implements OnInit, AfterViewInit, OnDestroy {

  countdown = 3 * 60;
  progress;
  subs;

  prevEvent;
  baseX;
  baseY;

  faCheck = faCheck;
  faPlus = faPlus;

  words = ['badkamer', 'plant', 'bloem', 'vaas', 'amaryllis', 'handdoek', 'handdoeken', 'kraan', 'bad', 'boek', 'boeken', 'spiegel',
    'spiegels', 'tegels', 'radiator', 'verwarming', 'design radiator', 'zeep', 'zeepdispenser', 'lichtknop', 'lichtknopje', 'knop',
    'knopje', 'kast', 'kastje', 'chivon', 'douche', 'douchedeur', 'afvoer', 'afvoerputje', 'lamp', 'lampen'];

  answers: string[] = [];
  aantalOK = 0;
  item;

  @ViewChild('keyhole') keyhole: ElementRef;
  @ViewChild('bathroom') bathroom: ElementRef;
  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(9);
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
    this.bathroom.nativeElement.style.display = 'block';
    this.keyhole.nativeElement.style.width = this.bathroom.nativeElement.style.width;
  }


  onMouseMove(event: MouseEvent): void {
    if (this.prevEvent) {
      if (this.prevEvent !== event) {
        // var x = parseInt(document.querySelector('.keyhole').style.backgroundPositionX);
        // x = x + event.screenX - prevEvent.screenX;
        let x = event.x - this.baseX - 1200;
        if (x < -1200) {
          x = -1200;
        }
        if (x > 0) {
          x = 0;
        }
        this.keyhole.nativeElement.style.backgroundPositionX = x + 'px';

        // var y = parseInt(document.querySelector('.keyhole').style.backgroundPositionY);
        // y = y + event.screenY - prevEvent.screenY;
        let y = event.y - this.baseY - 1200;
        if (y < -1200) {
          y = -1200;
        }
        if (y > 0) {
          y = 0;
        }
        this.keyhole.nativeElement.style.backgroundPositionY = y + 'px';
      }
    } else {
      const c = document.querySelector('.img').getBoundingClientRect();
      this.baseX = c.x;
      this.baseY = c.y;
    }
    this.prevEvent = event;
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'opdracht10']);
  }

  private sendAnswer(): void {
    // send time to server
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(9, tijd, this.aantalOK);
  }

  addItem(): void {
    if (this.item !== '') {
      if (this.answers.indexOf(this.item) < 0) {
        this.answers.push(this.item);
        this.aantalOK++;
      }
      this.item = '';
    }
    document.querySelector('input').focus();
  }


}
