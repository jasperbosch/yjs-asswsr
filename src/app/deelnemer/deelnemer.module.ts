import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
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
import { Opdracht1iComponent } from './opdracht1i/opdracht1i.component';
import { Opdracht2iComponent } from './opdracht2i/opdracht2i.component';
import { Opdracht3iComponent } from './opdracht3i/opdracht3i.component';
import { Opdracht4iComponent } from './opdracht4i/opdracht4i.component';
import { Opdracht5iComponent } from './opdracht5i/opdracht5i.component';
import { Opdracht6iComponent } from './opdracht6i/opdracht6i.component';
import { Opdracht7iComponent } from './opdracht7i/opdracht7i.component';
import { Opdracht8iComponent } from './opdracht8i/opdracht8i.component';
import { Opdracht9iComponent } from './opdracht9i/opdracht9i.component';
import { Opdracht10iComponent } from './opdracht10i/opdracht10i.component';
import { Opdracht11iComponent } from './opdracht11i/opdracht11i.component';


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
    ProgressBarComponent,
    Opdracht1iComponent,
    Opdracht2iComponent,
    Opdracht3iComponent,
    Opdracht4iComponent,
    Opdracht5iComponent,
    Opdracht6iComponent,
    Opdracht7iComponent,
    Opdracht8iComponent,
    Opdracht9iComponent,
    Opdracht10iComponent,
    Opdracht11iComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    RouterModule.forChild(ROUTES),
    CountdownModule,
    FormsModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class DeelnemerModule {
}
