import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';
import {interval} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';
import {CHECKMARK_SVG} from '../shared/checkmark.const';

@Component({
  selector: 'app-opdracht10',
  templateUrl: './opdracht10.component.html',
  styleUrls: ['./opdracht10.component.scss']
})
export class Opdracht10Component implements OnInit, OnDestroy {

  countdown = 6 * 60;
  progress;
  subs;
  oplossing = ['OK5', 'OK8', 'OK7', 'OK6'];
  allesOK = false;

  imgSrc = ['OK5', 'OK7', 'OK6', 'OK8'];

  imgDest = [[], [], [], []];


  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;
  @ViewChild('svg') svgRef: ElementRef;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(10);
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

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  /**
   * Maximaal 2 woorden per cartoon.
   */
  evenPredicate(item: CdkDrag, list: CdkDropList): boolean {
    return list.data.length < 1;
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'opdracht11']);
  }

  controleer(): void {
    this.allesOK = true;
    for (let i = 0; i < this.imgDest.length; i++) {
      if (this.imgDest[i][0] !== this.oplossing[i]) {
        this.allesOK = false;
        break;
      }
    }
    if (this.allesOK) {
      this.svgRef.nativeElement.innerHTML = CHECKMARK_SVG;
    } else {
      this.imgSrc = ['OK5', 'OK7', 'OK6', 'OK8'];
      this.imgDest = [[], [], [], []];
    }
  }

  private sendAnswer(): void {
    // send time to server
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(10, tijd, this.allesOK);
  }

}
