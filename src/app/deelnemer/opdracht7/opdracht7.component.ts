import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class Opdracht7Component implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('carousel') carousel: ElementRef;

  countdown = 8 * 60;
  progress;
  subs;
  allesOK = false;
  aantalGoed = 0;
  checked = false;

  imgWidth = 520;

  current = 0;

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
    [],
    ['STRIP', 'BOEK']
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

  ngAfterViewInit(): void {
    this.imgWidth = this.carousel.nativeElement.querySelector('div').clientWidth;
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
    this.router.navigate(['deelnemer', 'opdracht8i']);
  }

  controleer(): void {
    this.checked = true;
    this.allesOK = true;
    this.aantalGoed = 0;
    this.cartoonWords.forEach((word, index) => {
      const cWord = this.oplossing[index];
      if ((word[0] === cWord[0] && word[1] === cWord[1]) || (word[0] === cWord[1] && word[1] === cWord[0])) {
        this.aantalGoed++;
      } else {
        if (index === 3) {
          // igv cartoon4 zijn 2 antwoorden goed, StripVerhaal(3) en StripBoek(10)
          const ccWord = this.oplossing[10];
          if ((word[0] === ccWord[0] && word[1] === ccWord[1]) || (word[0] === ccWord[1] && word[1] === ccWord[0])) {
            this.aantalGoed++;
          } else {
            this.allesOK = false;
          }
        } else {
          this.allesOK = false;
        }
      }
    });
    if (this.answer10.toLowerCase() === 'kijk cijfers' || this.answer10.toLowerCase() === 'cijfers kijk' || this.answer10.toLowerCase() === 'kijkcijfers') {
      //
    } else {
      this.aantalGoed--;
      this.allesOK = false;
    }
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

  prev(): void {
    this.current--;
    if (this.current < 0) {
      this.current = 0;
    }
    this.carousel.nativeElement.style.transform = `translate(-${this.current * this.imgWidth}px,0)`;
  }

  next(): void {
    this.current++;
    if (this.current > 9) {
      this.current = 9;
    }
    this.carousel.nativeElement.style.transform = `translate(-${this.current * this.imgWidth}px,0)`;
  }

}
