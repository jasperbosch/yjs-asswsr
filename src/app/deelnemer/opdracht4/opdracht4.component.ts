import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as paper from 'paper';

@Component({
  selector: 'app-opdracht4',
  templateUrl: './opdracht4.component.html',
  styleUrls: ['./opdracht4.component.scss']
})
export class Opdracht4Component implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') myCanvas: ElementRef;

  dots: paper.PointText;
  cursor: paper.Path.Circle;

  flipOn = 260;
  myPath;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    paper.setup(this.myCanvas.nativeElement);
    paper.view.autoUpdate = true;

    const point = new paper.Point(710, 30);
    this.dots = new paper.PointText(point);
    this.dots.content = '. . . . . .';
    this.dots.fontSize = 270;
    this.dots.strokeColor = new paper.Color(0, 0, 0);
    this.dots.strokeWidth = 5;
    this.dots.fillColor = new paper.Color(256, 256, 256);

    const tekst = new paper.PointText(new paper.Point(600, 300));
    tekst.content = 'autisme';
    tekst.fontSize = 300;
    tekst.strokeColor = new paper.Color(0, 0, 0);
    tekst.strokeWidth = 5;
    tekst.fillColor = new paper.Color(256, 256, 256);

    this.cursor = new paper.Path.Circle({
      center: new paper.Point(10, 10),
      strokeColor: 'black',
      fillColor: 'gray',
      radius: 3,
    });

    tekst.onMouseDrag = this.onMouseDrag;
    tekst.onMouseMove = this.onMouseMove;
    tekst.onMouseDown = this.onMouseDown;
  }


  onMouseMove(event: any): void {
    const y = this.flipOn + (this.flipOn - event.y);
    if (this.cursor) {
      this.cursor.position = new paper.Point(event.x, y);
    }
  }

  onMouseDown(event: any): void {
    console.log('mousedown', event);
    this.myPath = new paper.Path();
    this.myPath.strokeColor = 'black';
    this.myPath.strokeWidth = 5;
  }

  onMouseDrag(event: any): void {
    const y = 250 + (250 - event.point.y);
    this.myPath.add(event.point.x, y);
  }


}
