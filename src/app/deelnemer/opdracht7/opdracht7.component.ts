import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as paper from 'paper';


@Component({
  selector: 'app-opdracht7',
  templateUrl: './opdracht7.component.html',
  styleUrls: ['./opdracht7.component.scss']
})
export class Opdracht7Component implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') myCanvas: ElementRef;
  @ViewChild('puzzle_image') puzzleImage: ElementRef;

  imgWidth = 800;
  imgHeight = 582;
  marge = 20;

  rasters: paper.Raster[] = [];

  constructor() {
  }

  ngOnInit(): void {
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

    const topLeft = new paper.Point(paper.view.center.x - (this.imgWidth / 2), 20);
    const rectSize = new paper.Size(this.imgWidth, this.imgHeight);
    const rect = new paper.Rectangle(topLeft, rectSize);
    const path = new paper.Path.Rectangle(rect);
    path.fillColor = new paper.Color('#e9e9ff');
    path.sendToBack();

    this.rasters[0].data = {x: 124 + topLeft.x, y: 140};
    this.rasters[1].data = {x: 172 + topLeft.x, y: 427};
    this.rasters[2].data = {x: 675 + topLeft.x, y: 466};
    this.rasters[3].data = {x: 674 + topLeft.x, y: 179};
    this.rasters[4].data = {x: 412 + topLeft.x, y: 125};
    this.rasters[5].data = {x: 438 + topLeft.x, y: 470};
    this.rasters[6].data = {x: 377 + topLeft.x, y: 288};

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
        event.target.position = new paper.Point(event.target.data.x, event.target.data.y);
      }
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

}
