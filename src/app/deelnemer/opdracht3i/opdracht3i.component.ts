import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht3i',
  templateUrl: './opdracht3i.component.html',
  styleUrls: ['./opdracht3i.component.scss']
})
export class Opdracht3iComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht3']);
  }


}
