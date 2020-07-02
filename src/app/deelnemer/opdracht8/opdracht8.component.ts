import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opdracht8',
  templateUrl: './opdracht8.component.html',
  styleUrls: ['./opdracht8.component.scss']
})
export class Opdracht8Component {

  imgSrc = ['OK5', 'OK6', 'OK7', 'OK8'];

  imgDest = [[], [], [], []];

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

}
