import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectgameComponent } from './selectgame.component';

describe('SelectgameComponent', () => {
  let component: SelectgameComponent;
  let fixture: ComponentFixture<SelectgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectgameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
