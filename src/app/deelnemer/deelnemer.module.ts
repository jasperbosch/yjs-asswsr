import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CountdownModule} from 'ngx-countdown';

import {CorridorComponent} from './corridor/corridor.component';
import {ROUTES} from './deelnemer.routes';
import {Opdracht1Component} from './opdracht1/opdracht1.component';
import {Opdracht10Component} from './opdracht10/opdracht10.component';
import {Opdracht11Component} from './opdracht11/opdracht11.component';
import {Opdracht2Component} from './opdracht2/opdracht2.component';
import {Opdracht3Component} from './opdracht3/opdracht3.component';
import {Opdracht4Component} from './opdracht4/opdracht4.component';
import {Opdracht5Component} from './opdracht5/opdracht5.component';
import {Opdracht6Component} from './opdracht6/opdracht6.component';
import {Opdracht7Component} from './opdracht7/opdracht7.component';
import {Opdracht8Component} from './opdracht8/opdracht8.component';
import {Opdracht9Component} from './opdracht9/opdracht9.component';
import {ProgressBarComponent} from './progress-bar/progress-bar.component';


@NgModule({
  declarations: [
    CorridorComponent,
    Opdracht1Component,
    Opdracht2Component,
    Opdracht3Component,
    Opdracht4Component,
    Opdracht5Component,
    Opdracht6Component,
    Opdracht7Component,
    Opdracht8Component,
    Opdracht9Component,
    Opdracht10Component,
    Opdracht11Component,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    RouterModule.forChild(ROUTES),
    CountdownModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class DeelnemerModule {
}
