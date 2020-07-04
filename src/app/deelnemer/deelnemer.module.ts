import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ROUTES} from './deelnemer.routes';
import {Opdracht1Component} from './opdracht1/opdracht1.component';
import {Opdracht4Component} from './opdracht4/opdracht4.component';
import {Opdracht5Component} from './opdracht5/opdracht5.component';
import {Opdracht8Component} from './opdracht8/opdracht8.component';
import { Opdracht7Component } from './opdracht7/opdracht7.component';


@NgModule({
  declarations: [Opdracht1Component, Opdracht4Component, Opdracht5Component, Opdracht8Component, Opdracht7Component],
  imports: [
    CommonModule,
    DragDropModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class DeelnemerModule {
}
