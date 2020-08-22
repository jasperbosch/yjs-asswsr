import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';

import * as paper from 'paper';
import {interval} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-opdracht4',
  templateUrl: './opdracht4.component.html',
  styleUrls: ['./opdracht4.component.scss']
})
export class Opdracht4Component implements OnInit, AfterViewInit, OnDestroy {

  countdown = 7 * 60;
  progress;
  subs;

  @ViewChild('myCanvas') myCanvas: ElementRef;

  zoom = 1;
  zoomDelta = 0.05;
  width = 691;
  height = 953;

  cursor;
  myPath;
  raster;

  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(4);
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
    paper.setup(this.myCanvas.nativeElement);
    paper.view.autoUpdate = true;

    const topLeft = new paper.Point(0, 0);

    this.raster = new paper.Raster('lowietje');
    this.raster.position = new paper.Point(topLeft.x + (691 / 2), 475);
    this.raster.size = new paper.Size(this.width, this.height);


    this.cursor = new paper.Path.Circle({
      center: new paper.Point(10, 10),
      strokeColor: 'red',
      fillColor: 'red',
      radius: 3,
    });

    this.myPath = new paper.Path();

    paper.view.onMouseMove = this.mouseMove.bind(this);
    paper.view.onMouseDown = this.mouseDown.bind(this);
    paper.view.onMouseDrag = this.mouseDrag.bind(this);

    this.cursor.bringToFront();

    paper.view.zoom = this.zoom;
  }

  mouseMove(event): void {
    // this.cursor.position = new paper.Point(event.point.x * (1 / this.zoom), event.point.y * (1 / this.zoom));
    this.cursor.position = new paper.Point(event.point.x, event.point.y);
  }

  mouseDown(event): void {
    this.myPath.remove();

    this.myPath = new paper.Path();
    this.myPath.strokeColor = 'red';
    this.myPath.strokeWidth = 5;
  }

  mouseDrag(event: any): void {
    this.myPath.add(event.point.x, event.point.y);
  }

  zoomIn(): void {
    if (this.zoom <= 1.30) {
      this.zoom = this.zoom + this.zoomDelta;
      this.height = this.height * this.zoom;
      this.width = this.width * this.zoom;
    }
  }

  zoomOut(): void {
    if (this.zoom - this.zoomDelta >= 1) {
      this.height = this.height * (1 / this.zoom);
      this.width = this.width * (1 / this.zoom);
      this.zoom = this.zoom - this.zoomDelta;
    }
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'opdracht5i']);
  }

  private sendAnswer(): void {
    // send time to server
    // const answer = (this.myCanvas.nativeElement as HTMLCanvasElement).toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const answer = (this.myCanvas.nativeElement as HTMLCanvasElement).toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(4, tijd, answer);
  }


}
