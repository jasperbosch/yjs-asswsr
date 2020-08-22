import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht5i',
  templateUrl: './opdracht5i.component.html',
  styleUrls: ['./opdracht5i.component.scss']
})
export class Opdracht5iComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht5']);
  }


}
