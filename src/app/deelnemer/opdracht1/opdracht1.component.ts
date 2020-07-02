import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-opdracht1',
  templateUrl: './opdracht1.component.html',
  styleUrls: ['./opdracht1.component.scss']
})
export class Opdracht1Component implements OnInit {

  prevEvent;
  baseX;
  baseY;

  @ViewChild('keyhole') keyhole: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
  }

  onMouseMove(event: MouseEvent): void {
    if (this.prevEvent) {
      if (this.prevEvent !== event) {
        // var x = parseInt(document.querySelector('.keyhole').style.backgroundPositionX);
        // x = x + event.screenX - prevEvent.screenX;
        let x = event.x - this.baseX - 1200;
        if (x < -1150) {
          x = -1150;
        }
        if (x > -35) {
          x = -35;
        }
        this.keyhole.nativeElement.style.backgroundPositionX = x + 'px';

        // var y = parseInt(document.querySelector('.keyhole').style.backgroundPositionY);
        // y = y + event.screenY - prevEvent.screenY;
        let y = event.y - this.baseY - 1200;
        if (y < -1150) {
          y = -1150;
        }
        if (y > -336) {
          y = -336;
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

}
