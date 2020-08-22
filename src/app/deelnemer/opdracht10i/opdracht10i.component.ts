import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht10i',
  templateUrl: './opdracht10i.component.html',
  styleUrls: ['./opdracht10i.component.scss']
})
export class Opdracht10iComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht10']);
  }

}
