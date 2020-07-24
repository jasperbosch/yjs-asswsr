import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';
import {interval} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';
import {CHECKMARK_SVG} from '../shared/checkmark.const';

@Component({
  selector: 'app-opdracht7',
  templateUrl: './opdracht7.component.html',
  styleUrls: ['./opdracht7.component.scss']
})
export class Opdracht7Component implements OnInit, OnDestroy {

  countdown = 8 * 60;
  progress;
  subs;
  allesOK = false;

  words = ['STRIP', 'WERK', 'JONGEREN', 'STRIJK', 'LEES', 'SCHEMA', 'DRAAI', 'KOP', 'GROEP', 'ARM',
    'POT', 'DAG', 'HANG', 'GETAL', 'VERHAAL', 'TELEVISIE', 'PRIKKEL', 'KWARTET', 'CEL', 'VROUW',
    'VOETBAL', 'BAD', 'BOEK', 'LOOD', 'LOPER', 'DELING', 'HAND', 'TAFEL', 'MEESTER'];

  answer10 = '';

  cartoonWords = [];

  oplossing = [
    ['TAFEL', 'VOETBAL'],
    ['STRIJK', 'KWARTET'],
    ['BAD', 'MEESTER'],
    ['STRIP', 'VERHAAL'],
    ['HANG', 'JONGEREN'],
    ['CEL', 'DELING'],
    ['POT', 'LOOD'],
    ['KOP', 'LOPER'],
    ['PRIKKEL', 'ARM'],
    []
  ];

  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;
  @ViewChild('svg') svgRef: ElementRef;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(7);
    this.words = this.shuffle(this.words);
  }

  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      this.cartoonWords.push([]);
    }
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
    return list.data.length < 2;
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'opdracht8']);
  }

  controleer(): void {
    this.allesOK = true;
    let counter = 0;
    this.cartoonWords.forEach((word, index) => {
      const cWord = this.oplossing[index];
      if ((word[0] === cWord[0] && word[1] === cWord[1]) || (word[0] === cWord[1] && word[1] === cWord[0])) {
        counter++;
      } else {
        this.allesOK = false;
      }
    });
    if (this.answer10.toLowerCase() === 'kijk cijfers' || this.answer10.toLowerCase() === 'cijfers kijk') {
      //
    } else {
      counter--;
      this.allesOK = false;
    }
    console.log(counter + ' antwoorden goed.');
    if (this.allesOK) {
      this.svgRef.nativeElement.innerHTML = CHECKMARK_SVG;
    }
  }

  private sendAnswer(): void {
    // send time to server
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(7, tijd, this.allesOK);
  }

  shuffle(a: string[]): string[] {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

}
