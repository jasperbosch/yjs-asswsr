import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opdracht1i',
  templateUrl: './opdracht1i.component.html',
  styleUrls: ['./opdracht1i.component.scss']
})
export class Opdracht1iComponent implements OnInit {

  constructor(private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['deelnemer', 'opdracht1']);
  }

}
