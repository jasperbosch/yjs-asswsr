import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht11i',
  templateUrl: './opdracht11i.component.html',
  styleUrls: ['./opdracht11i.component.scss']
})
export class Opdracht11iComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht11']);
  }


}
