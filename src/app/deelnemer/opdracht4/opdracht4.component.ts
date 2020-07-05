import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as paper from 'paper';

@Component({
  selector: 'app-opdracht4',
  templateUrl: './opdracht4.component.html',
  styleUrls: ['./opdracht4.component.scss']
})
export class Opdracht4Component implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') myCanvas: ElementRef;

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
    const dots = new paper.PointText(point);
    dots.content = '. . . . . .';
    dots.fontSize = 270;
    dots.strokeColor = new paper.Color(0, 0, 0);
    dots.strokeWidth = 5;
    dots.fillColor = new paper.Color(256, 256, 256);
    dots.point = new paper.Point(paper.view.center.x - (dots.bounds.width / 2), 30);
    dots.sendToBack();


    const tekstX = paper.view.center.x - (1050 / 2);
    const tekst = new paper.PointText(new paper.Point(tekstX, 300));
    tekst.name = 'autisme';
    tekst.content = 'autisme';
    tekst.fontSize = 300;
    tekst.strokeColor = new paper.Color(0, 0, 0);
    tekst.strokeWidth = 5;
    tekst.fillColor = new paper.Color(256, 256, 256);
    // tekst.point = new paper.Point(paper.view.center.x - (tekst.bounds.width / 2), 300);
    // tekst.selected = true;
    tekst.sendToBack();

    this.flipOn = tekst.bounds.y + (tekst.bounds.height / 2) + 100;

    this.cursor = new paper.Path.Circle({
      center: new paper.Point(10, 10),
      strokeColor: 'black',
      fillColor: 'gray',
      radius: 3,
    });

    tekst.onMouseDrag = this.onMouseDrag.bind(this);
    tekst.onMouseMove = this.onMouseMove.bind(this);
    tekst.onMouseDown = this.onMouseDown.bind(this);

    this.cursor.bringToFront();
  }


  onMouseMove(event: any): void {
    if (event.y) {
      const y = this.flipOn + (this.flipOn - event.y);
      if (this.cursor) {
        this.cursor.position = new paper.Point(event.x, y);
      }
    }
  }

  onMouseDown(event: any): void {
    if (event.target.name === 'autisme') {
      this.myPath = new paper.Path();
      this.myPath.strokeColor = 'black';
      this.myPath.strokeWidth = 5;
    }
  }

  onMouseDrag(event: any): void {
    if (event.target.name === 'autisme') {
      const y = this.flipOn + (this.flipOn - event.point.y) - 75; // Ik weet niet waar deze 75 vandaan komt...
      this.myPath.add(event.point.x, y);
    }
  }


}
