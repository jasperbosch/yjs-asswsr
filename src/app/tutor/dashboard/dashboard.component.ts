import {Component, OnInit} from '@angular/core';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {Student} from '../../domain/student.model';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  students: Student[] = [];
  range = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  faCheck = faCheck;

  constructor(private readonly asswsr: AsswsrService) {
    this.asswsr.students.subscribe(students => {
      this.students = students;
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

}
