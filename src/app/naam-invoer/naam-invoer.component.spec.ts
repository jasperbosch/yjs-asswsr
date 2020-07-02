import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaamInvoerComponent } from './naam-invoer.component';

describe('NaamInvoerComponent', () => {
  let component: NaamInvoerComponent;
  let fixture: ComponentFixture<NaamInvoerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaamInvoerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaamInvoerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
