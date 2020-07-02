import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-opdracht5',
  templateUrl: './opdracht5.component.html',
  styleUrls: ['./opdracht5.component.scss']
})
export class Opdracht5Component implements OnInit {

  words = ['STRIP', 'WERK', 'JONGEREN', 'STRIJK', 'LEES', 'SCHEMA', 'DRAAI', 'KOP', 'GROEP', 'ARM',
    'POT', 'DAG', 'HANG', 'GETAL', 'VERHAAL', 'TELEVISIE', 'PRIKKEL', 'KWARTET', 'CEL', 'VROUW',
    'VOETBAL', 'BAD', 'BOEK', 'LOOD', 'LOPER', 'DELING', 'HAND', 'TAFEL', 'MEESTER'];

  cartoonWords = [];

  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      this.cartoonWords.push([]);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
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
    return list.data.length < 2;
  }

}
