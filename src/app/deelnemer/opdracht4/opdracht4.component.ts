import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';
import {interval, timer} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-opdracht4',
  templateUrl: './opdracht4.component.html',
  styleUrls: ['./opdracht4.component.scss']
})
export class Opdracht4Component implements OnInit, AfterViewInit, OnDestroy {

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(4);
  }

  countdown = 7 * 60;
  progress;
  subs;

  @ViewChild('myCanvas') myCanvas: ElementRef;

  width = 691;
  height = 953;

  cursor;

  answer = false;


  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;

  lens: HTMLElement = document.createElement('DIV');

  img: HTMLImageElement;

  cx: number;
  cy: number;
  result: HTMLElement;

  move = true;

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
    timer(1000).subscribe(() => {
      this.imageZoom('lowietje', 'myresult');
    });
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'opdracht5i']);
  }

  private sendAnswer(): void {
    // send time to server
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(4, tijd, this.answer);
  }

  imageZoom(imgID, resultID): void {
    this.img = (document.getElementById(imgID) as HTMLImageElement);
    this.result = document.getElementById(resultID);
    /* Create lens: */
    this.lens.setAttribute('class', 'img-zoom-lens');
    /* Insert lens: */
    this.img.parentElement.insertBefore(this.lens, this.img);
    /* Calculate the ratio between result DIV and lens: */
    this.cx = this.result.offsetWidth / this.lens.offsetWidth;
    this.cy = this.result.offsetHeight / this.lens.offsetHeight;
    /* Set background properties for the result DIV */
    this.result.style.backgroundImage = 'url(\'' + this.img.src + '\')';
    this.result.style.backgroundSize = (this.img.width * this.cx) + 'px ' + (this.img.height * this.cy) + 'px';
    /* Execute a function when someone moves the cursor over the image, or the lens: */
    this.lens.addEventListener('mousemove', ev => this.moveLens(ev));
    this.lens.addEventListener('click', ev => this.checkXY(ev));
    this.img.addEventListener('mousemove', ev => this.moveLens(ev));
    this.img.addEventListener('click', ev => this.checkXY(ev));
    /* And also for touch screens: */
    this.lens.addEventListener('touchmove', ev => this.moveLens(ev));
    this.img.addEventListener('touchmove', ev => this.moveLens(ev));
  }

  moveLens(e): void {
    if (this.move) {
      /* Prevent any other actions that may occur when moving over the image */
      e.preventDefault();
      /* Get the cursor's x and y positions: */
      const pos = this.getCursorPos(e);
      /* Calculate the position of the lens: */
      let x = pos.x - (this.lens.offsetWidth / 2);
      let y = pos.y - (this.lens.offsetHeight / 2);
      /* Prevent the lens from being positioned outside the image: */
      if (x > this.img.width - this.lens.offsetWidth) {
        x = this.img.width - this.lens.offsetWidth;
      }
      if (x < 0) {
        x = 0;
      }
      if (y > this.img.height - this.lens.offsetHeight) {
        y = this.img.height - this.lens.offsetHeight;
      }
      if (y < 0) {
        y = 0;
      }
      /* Set the position of the lens: */
      this.lens.style.left = x + 'px';
      this.lens.style.top = y + 'px';
      /* Display what the lens "sees": */
      this.result.style.backgroundPosition = '-' + (x * this.cx) + 'px -' + (y * this.cy) + 'px';
    }
  }

  getCursorPos(e): any {
    let x = 0;
    let y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    const a = this.img.getBoundingClientRect();
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x, y};
  }

  checkXY(event): void {
    if (this.move) {
      const pos = this.getCursorPos(event);
      const w = this.img.width;
      const h = this.img.height;
      const wRatio = w / 596;
      const hRatio = h / 843;
      if (pos.x > 62 * wRatio && pos.x < 133 * wRatio && pos.y > 94 * hRatio && pos.y < 165 * hRatio) {
        this.answer = true;
      }
    }
    this.move = !this.move;
  }
}
