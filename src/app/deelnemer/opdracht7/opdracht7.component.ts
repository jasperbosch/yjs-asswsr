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

    this.rasters[0].position = new paper.Point(200, 150);
    this.rasters[1].position = new paper.Point(200, 500);
    this.rasters[2].position = new paper.Point(200, 900);
    this.rasters[3].position = new paper.Point(500, 200);
    this.rasters[4].position = new paper.Point(500, 500);
    this.rasters[5].position = new paper.Point(500, 900);
    this.rasters[6].position = new paper.Point(800, 250);


    paper.project.activeLayer.children[0].selected = true;

    const kids = paper.project.activeLayer.children;
    // tslint:disable-next-line:prefer-for-of
    for (let x = 0; x < 7; x++) {
      kids[x].onMouseDown = this.onMouseDown.bind(this);
      kids[x].onDoubleClick = this.onDoubleClick.bind(this);
      kids[x].onMouseDrag = this.onMouseDrag.bind(this);
    }

  }

  onMouseDrag(event): void {
    console.log(event);
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
