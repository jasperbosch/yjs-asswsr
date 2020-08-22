import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht6i',
  templateUrl: './opdracht6i.component.html',
  styleUrls: ['./opdracht6i.component.scss']
})
export class Opdracht6iComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht6']);
  }


}
