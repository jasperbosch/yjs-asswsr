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

  // words = ['badkamer', 'plant', 'bloem', 'vaas', 'amaryllis', 'handdoek', 'handdoeken', 'kraan', 'bad', 'boek', 'boeken', 'spiegel',
  //   'spiegels', 'tegels', 'radiator', 'verwarming', 'design radiator', 'zeep', 'zeepdispenser', 'lichtknop', 'lichtknopje', 'knop',
  //   'knopje', 'kast', 'kastje', 'chivon', 'douche', 'douchedeur', 'afvoer', 'afvoerputje', 'lamp', 'lampen'];

  words = ['badkamer'];

  answers: string[] = [];
  aantalOK = 0;
  item;
  hole;
  holeScope;
  holeSize = 30;
  width = 815;
  height = 612;

  // @ViewChild('keyhole') keyhole: ElementRef;
  @ViewChild('hole') myHole: ElementRef;
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


    this.holeScope = new paper.PaperScope();
    this.holeScope.setup(this.myHole.nativeElement);

    this.holeScope.activate();
    this.myHole.nativeElement.width = this.width;
    this.myHole.nativeElement.style.width = this.width + 'px';
    this.myHole.nativeElement.height = this.height;
    this.myHole.nativeElement.style.height = this.height + 'px';

    const c1 = new this.holeScope.Path.Rectangle(new this.holeScope.Rectangle(0, 0, this.width, this.height));
    c1.fillColor = new this.holeScope.Color('#000000');
    this.hole = new this.holeScope.Path.Circle(new this.holeScope.Point(100, 100), this.holeSize);
    this.hole.fillColor = new this.holeScope.Color('#000000');
    this.hole.blendMode = 'xor';

    this.bathroom.nativeElement.style.display = 'block';
  }


  onMouseMove(event: MouseEvent): void {
    if (this.prevEvent) {
      if (this.prevEvent !== event) {
        let x = event.x;
        if (x < this.holeSize) {
          x = this.holeSize;
        }
        if (x > (this.width - this.holeSize)) {
          x = this.width - this.holeSize;
        }
        let y = event.y - 35;
        if (y < 0) {
          y = 0;
        }
        if (y > (this.height - this.holeSize)) {
          y = this.height - this.holeSize;
        }
        if (this.hole) {
          this.hole.position = new this.holeScope.Point(x, y);
        }

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
    this.router.navigate(['deelnemer', 'opdracht10i']);
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
