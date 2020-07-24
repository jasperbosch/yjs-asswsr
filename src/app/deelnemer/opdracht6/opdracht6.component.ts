import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';
import * as paper from 'paper';
import {interval} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-opdracht6',
  templateUrl: './opdracht6.component.html',
  styleUrls: ['./opdracht6.component.scss']
})
export class Opdracht6Component implements OnInit, AfterViewInit, OnDestroy {

  countdown = 5 * 60;
  progress;
  subs;

  @ViewChild('myCanvas') myCanvas: ElementRef;
  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;

  cursor: paper.Path.Circle;

  flipOn = 360;
  myPath;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(6);
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

    this.flipOn = tekst.bounds.y + (tekst.bounds.height / 2) + 50;

    this.cursor = new paper.Path.Circle({
      center: new paper.Point(10, 10),
      strokeColor: 'blue',
      fillColor: 'blue',
      radius: 3
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
      this.myPath.strokeColor = 'silver';
      this.myPath.strokeWidth = 5;
      // this.myPath.opacity = 0.5;
      this.myPath.blendMode = 'difference';
    }
  }

  onMouseDrag(event: any): void {
    if (event.target.name === 'autisme') {
      const y = this.flipOn + (this.flipOn - event.point.y) - 50; // Ik weet niet waar deze 75 vandaan komt...
      this.myPath.add(event.point.x, y);
    }
    console.log(this.myPath.strokeColor._canvasStyle);
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'opdracht7']);
  }

  private sendAnswer(): void {
    // send time to server
    const answer = (this.myCanvas.nativeElement as HTMLCanvasElement).toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(6, tijd, answer);
  }

}
