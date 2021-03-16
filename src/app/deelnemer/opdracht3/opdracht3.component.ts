import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CountdownComponent} from 'ngx-countdown';
import {interval, timer} from 'rxjs';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-opdracht3',
  templateUrl: './opdracht3.component.html',
  styleUrls: ['./opdracht3.component.scss']
})
export class Opdracht3Component implements OnInit, OnDestroy {

  countdown = 4 * 60;
  progress;
  subs;
  antwoord = '';

  numberA = 0;
  numberB = 0;
  answer = 0;
  answerList = [];
  operator = '';
  operators = ['+', '-', '*'];
  rightAnswers = 0;

  answers = [];

  playing = false;

  @ViewChild('cd', {static: false}) private countdownC: CountdownComponent;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {
    this.asswsr.studentStartOpdracht(3);
  }

  ngOnInit(): void {
    this.subs = interval(100).subscribe(result => {
      this.progress = (((this.countdown - (result / 10)) / this.countdown) * 100);
    });
    this.newPuzzle();
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }


  newPuzzle(): void {
    this.operator = this.operators[this.random(2)];
    this.numberA = this.random(9);
    this.numberB = this.random(9);
    if (this.numberA < this.numberB) {
      this.numberA += this.numberB;
    }
    switch (this.operator) {
      case '+':
        this.answer = this.numberA + this.numberB;
        break;
      case '-':
        this.answer = this.numberA - this.numberB;
        break;
      case '*':
        this.answer = this.numberA * this.numberB;
        break;
    }

    const pre = this.random(9);
    const post = this.random(9);


    this.answers = [];
    this.answerList = [];
    for (let i = 0; i < pre; i++) {
      const tmp = this.answer - this.random(pre * 2) - 1;
      if (tmp > 0 && this.answers.indexOf(tmp) < 0 && tmp !== this.answer) {
        this.answers.push(tmp);
      }
    }
    this.answers.push(this.answer);
    for (let i = 0; i < post; i++) {
      const tmp = this.answer + this.random(post * 2) + 1;
      if (this.answers.indexOf(tmp) < 0 && tmp !== this.answer) {
        this.answers.push(tmp);
      }
    }
  }

  private random(seed: number): number {
    return Math.round(Math.random() * seed);
  }

  handleEvent(event): void {
    if (event.action === 'done') {
      this.sendAnswer();
      this.router.navigate(['deelnemer', 'corridor']);
    }
  }

  klaar(): void {
    this.sendAnswer();
    // redirect
    this.router.navigate(['deelnemer', 'opdracht4i']);
  }

  private sendAnswer(): void {
    // send time to server
    const tijd = this.countdown - (this.countdownC.left / 1000);
    this.asswsr.sendAnswer(3, tijd, this.antwoord);
  }

  drop(event: CdkDragDrop<number[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    if (this.answerList.length === 1 && this.answerList[0] === this.answer) {
      this.rightAnswers++;
      timer(1000).subscribe(() => this.newPuzzle());
    }
  }


}
