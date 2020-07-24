import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsswsrService} from '../../services/asswsr.service';

@Component({
  selector: 'app-corridor',
  templateUrl: './corridor.component.html',
  styleUrls: ['./corridor.component.scss']
})
export class CorridorComponent implements OnInit {

  constructor(private readonly asswsr: AsswsrService) {
    this.asswsr.studentStartOpdracht(0);
  }

  ngOnInit(): void {
  }

}
