import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-opdracht1',
  templateUrl: './opdracht1.component.html',
  styleUrls: ['./opdracht1.component.scss']
})
export class Opdracht1Component implements OnInit, AfterViewInit {

  prevEvent;
  baseX;
  baseY;

  @ViewChild('keyhole') keyhole: ElementRef;
  @ViewChild('bathroom') bathroom: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
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
        let x = event.x - this.baseX - 1000;
        if (x < -960) {
          x = -960;
        }
        if (x > -230) {
          x = -230;
        }
        this.keyhole.nativeElement.style.backgroundPositionX = x + 'px';

        // var y = parseInt(document.querySelector('.keyhole').style.backgroundPositionY);
        // y = y + event.screenY - prevEvent.screenY;
        let y = event.y - this.baseY - 1000;
        if (y < -960) {
          y = -960;
        }
        if (y > -430) {
          y = -430;
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
