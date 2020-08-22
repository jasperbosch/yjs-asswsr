import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht8i',
  templateUrl: './opdracht8i.component.html',
  styleUrls: ['./opdracht8i.component.scss']
})
export class Opdracht8iComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht8']);
  }


}
