import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht4i',
  templateUrl: './opdracht4i.component.html',
  styleUrls: ['./opdracht4i.component.scss']
})
export class Opdracht4iComponent implements OnInit {
  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht4']);
  }

}
