import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht7i',
  templateUrl: './opdracht7i.component.html',
  styleUrls: ['./opdracht7i.component.scss']
})
export class Opdracht7iComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht']);
  }


}
