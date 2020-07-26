import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {environment} from '../../environments/environment';
import {Message} from '../domain/message.model';
import {Student} from '../domain/student.model';

@Injectable({
  providedIn: 'root'
})
export class AsswsrService {

  ASSWSR_URL = environment.ASSWSR_WS_URL;

  userName = new Subject<string>();
  students = new Subject<Student[]>();

  studentUuid;
  studentNaam;

  // students = [];

  private socket$: WebSocketSubject<Message>;

  constructor(private readonly router: Router) {
    this.socket$ = new WebSocketSubject(this.ASSWSR_URL);

    this.socket$
      .subscribe(
        (message) => {
          // console.log('Message: ', message);
          switch (message.soort) {
            case 'USERINPUT':
              this.router.navigate(['/']);
              break;
            case 'CONFIRM':
              this.studentUuid = message.content.id;
              this.studentNaam = message.content.name;
              this.userName.next(this.studentNaam);
              sessionStorage.setItem('id', message.content.id);
              break;
            case 'STUDENTS':
              this.students.next(message.content);
              break;
            case 'START':
              const nummer = message.content;
              if (nummer === -1) {
                this.studentUuid = undefined;
                this.studentNaam = undefined;
                this.userName.next(this.studentNaam);
                sessionStorage.removeItem('id');
                this.router.navigate(['']);
              } else if (nummer === 0) {
                this.router.navigate(['deelnemer', 'corridor']);
              } else {
                this.router.navigate(['deelnemer', 'opdracht' + nummer]);
              }
              break;
          }
        },
        (err) => console.error(err),
        () => {
          // console.warn('Completed!')
        }
      );
  }

  getUser(): void {
    this.socket$.next(new Message('init', 'GETUSER', sessionStorage.getItem('id'), false));
  }

  sendName(name: string): void {
    this.socket$.next(new Message(name, 'SIGNON', name, false));
  }

  startOpdracht(opdrachtNr: number): void {
    this.socket$.next(new Message('tutor', 'START', opdrachtNr, false));
  }

  stopOpdracht(opdrachtNr: number): void {
    this.socket$.next(new Message('tutor', 'STOP', opdrachtNr, false));
  }

  sendAnswer(opdrachtNr: number, tijd: number, answer: any): void {
    this.socket$.next(new Message(this.studentUuid, 'ANSWER', {opdrachtNr, tijd, answer}, false));
  }

  studentStartOpdracht(opdrachtNr: number): void {
    this.socket$.next(new Message(this.studentUuid, 'SSTART', opdrachtNr, false));
  }

  studentStoptOpdracht(opdrachtNr: number): void {
    this.socket$.next(new Message(this.studentUuid, 'SSTOP', opdrachtNr, false));
  }

  resetAll(): void {
    this.socket$.next(new Message('tutor', 'RESETALL', '', false));
  }

  removeStudent(student): void {
    this.socket$.next(new Message('tutor', 'REMOVE', student, false));
  }
}
