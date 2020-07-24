import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AsswsrService} from '../services/asswsr.service';

@Component({
  selector: 'app-naam-invoer',
  templateUrl: './naam-invoer.component.html',
  styleUrls: ['./naam-invoer.component.scss']
})
export class NaamInvoerComponent implements OnInit {

  naam: string;

  constructor(private readonly asswsr: AsswsrService, private readonly router: Router) {

    asswsr.userName.subscribe(name => {
      if (name === 'tutor') {
        this.router.navigate(['tutor', 'dashboard']);
      } else {
        this.router.navigate(['deelnemer', 'corridor']);
      }
    });

  }

  ngOnInit(): void {
  }

  verzend(): void {
    this.asswsr.sendName(this.naam);
  }
}
