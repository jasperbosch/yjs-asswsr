import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht2i',
  templateUrl: './opdracht2i.component.html',
  styleUrls: ['./opdracht2i.component.scss']
})
export class Opdracht2iComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht2']);
  }

}
