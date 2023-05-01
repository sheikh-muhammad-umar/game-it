import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigngameComponent } from './assigngame.component';

describe('AssigngameComponent', () => {
  let component: AssigngameComponent;
  let fixture: ComponentFixture<AssigngameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigngameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigngameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
