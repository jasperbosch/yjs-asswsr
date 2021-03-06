import {Component, OnInit} from '@angular/core';
import {faCheck, faFrown, faHourglass, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Student} from '../../domain/student.model';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  students: Student[] = [];
  displayedColumns: string[] = ['name', 'wacht', 'opdracht1', 'opdracht2', 'opdracht3', 'opdracht4', 'opdracht5', 'opdracht6',
    'opdracht7', 'opdracht8', 'opdracht9', 'opdracht10', 'opdracht11', 'util'];
  range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  faCheck = faCheck;
  faTimes = faTimes;
  faFrown = faFrown;
  faTrash = faTrash;
  faHourglass = faHourglass;

  constructor(private readonly asswsr: AsswsrService) {
    this.asswsr.students.subscribe(students => {
      this.students = students.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    });
  }

  ngOnInit(): void {
  }

  start(nummer: number): void {
    this.asswsr.startOpdracht(nummer);
  }

  reset(): void {
    this.asswsr.resetAll();
  }

  removeStudent(student): void {
    this.asswsr.removeStudent(student);
  }

}
