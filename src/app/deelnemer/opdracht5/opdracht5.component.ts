import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';
import * as paper from 'paper';
import {interval} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';
import {CHECKMARK_SVG} from '../shared/checkmark.const';


@Component({
  selector: 'app-opdracht5',
  templateUrl: './opdracht5.component.html',
  styleUrls: ['./opdracht5.component.scss']
})
export class Opdracht5Component implements OnInit, AfterViewInit, OnDestroy {

  countdown = 7 * 60;
  progress;
  subs;
  allesOK = false;
  allesOOK = false;

  @ViewChild('myCanvas') myCanvas: ElementRef;
  @ViewChild('puzzle_image') puzzleImage: ElementRef;
  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;
  @ViewChild('svg') svgRef: ElementRef;

  imgWidth = 800;
  imgHeight = 582;
  marge = 20;

  rasters: paper.Raster[] = [];

  topLeftX;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(5);
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

    this.rasters.push(new paper.Raster('puzzel1'));
    this.rasters.push(new paper.Raster('puzzel2'));
    this.rasters.push(new paper.Raster('puzzel3'));
    this.rasters.push(new paper.Raster('puzzel4'));
    this.rasters.push(new paper.Raster('puzzel5'));
    this.rasters.push(new paper.Raster('puzzel6'));
    this.rasters.push(new paper.Raster('puzzel7'));

    const topLeft = new paper.Point(Math.round(paper.view.center.x - (this.imgWidth / 2)), 20);
    const rectSize = new paper.Size(this.imgWidth, this.imgHeight);
    const rect = new paper.Rectangle(topLeft, rectSize);
    const path = new paper.Path.Rectangle(rect);
    path.fillColor = new paper.Color('#e9e9ff');
    path.sendToBack();

    this.rasters[0].data = {x: 124 + topLeft.x, y: 140, ox: 673 + topLeft.x, oy: 480};
    this.rasters[1].data = {x: 172 + topLeft.x, y: 427, ox: 626 + topLeft.x, oy: 193};
    this.rasters[2].data = {x: 675 + topLeft.x, y: 466, ox: 124 + topLeft.x, oy: 154};
    this.rasters[3].data = {x: 674 + topLeft.x, y: 179, ox: 124 + topLeft.x, oy: 443};
    this.rasters[4].data = {x: 412 + topLeft.x, y: 125, ox: 386 + topLeft.x, oy: 496};
    this.rasters[5].data = {x: 438 + topLeft.x, y: 470, ox: 360 + topLeft.x, oy: 150};
    this.rasters[6].data = {x: 377 + topLeft.x, y: 288, ox: 421 + topLeft.x, oy: 332};

    // tslint:disable-next-line:prefer-for-of
    for (let x = 0; x < this.rasters.length; x++) {
      this.rasters[x].position = new paper.Point(
        Math.random() * ((paper.view.center.x - 100) * 2) + 100,
        Math.random() * ((paper.view.center.y - 100) * 2) + 100
      );
      const rotation = Math.floor(Math.random() * 4) * 90;
      this.rasters[x].rotate(rotation);
    }


    paper.project.activeLayer.children[0].selected = true;

    const kids = paper.project.activeLayer.children;
    // tslint:disable-next-line:prefer-for-of
    for (let x = 0; x < kids.length; x++) {
      if (kids[x] instanceof paper.Raster) {
        kids[x].onMouseDown = this.onMouseDown.bind(this);
        kids[x].onDoubleClick = this.onDoubleClick.bind(this);
        kids[x].onMouseDrag = this.onMouseDrag.bind(this);
        kids[x].onMouseUp = this.onMouseUp.bind(this);
      }
    }

  }

  onMouseUp(event): void {
    if (Math.abs(event.target.rotation) === 0) {
      if (Math.abs(event.point.x - event.target.data.x) < this.marge &&
        Math.abs(event.point.y - event.target.data.y) < this.marge) {
        // Trek het puzzelstuk naar de juiste positie.
        event.target.position = new paper.Point(event.target.data.x, event.target.data.y);
        // Controleer of alle puzzelstukjes op hun plaats liggen.
        this.checkPuzzle();
        event.target.selected = false;
      }
    } else if (Math.abs(event.target.rotation) === 180) {
      const m = event.point.x - ((this.imgWidth - event.target.data.x) + this.topLeftX) - event.target.width;
      if (Math.abs(event.point.x - event.target.data.ox) < this.marge &&
        Math.abs(event.point.y - event.target.data.oy) < this.marge) {
        // Trek het puzzelstuk naar de juiste positie.
        event.target.position = new paper.Point(event.target.data.ox, event.target.data.oy);
        // Controleer of alle puzzelstukjes op hun plaats liggen.
        this.checkPuzzle();
        event.target.selected = false;
      }
    }
  }

  checkPuzzle(): void {
    this.allesOK = true;
    this.allesOOK = true;
    this.rasters.forEach(raster => {
      if ((raster.data.x * 10) !== Math.round(raster.position.x * 10) || (raster.data.y * 10) !== Math.round(raster.position.y * 10)) {
        this.allesOK = false;
      }
      if ((raster.data.ox * 10) !== Math.round(raster.position.x * 10) || (raster.data.oy * 10) !== Math.round(raster.position.y * 10)) {
        this.allesOOK = false;
      }
    });
    if (this.allesOK || this.allesOOK) {
      this.svgRef.nativeElement.innerHTML = CHECKMARK_SVG;
    } else {
      this.svgRef.nativeElement.innerHTML = '';
    }
  }

  onMouseDrag(event): void {
    event.target.position = event.point;
  }

  onMouseDown(event): void {
    this.unselectAll();
    event.target.selected = true;
    event.target.bringToFront();
  }

  onDoubleClick(event): void {
    event.target.rotate(90);
  }

  unselectAll(): void {
    const kids = paper.project.activeLayer.children;
    // tslint:disable-next-line:prefer-for-of
    for (let x = 0; x < kids.length; x++) {
      kids[x].selected = false;
    }
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'opdracht6i']);
  }

  private sendAnswer(): void {
    // send time to server
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(5, tijd, this.allesOK || this.allesOOK);
  }


}
