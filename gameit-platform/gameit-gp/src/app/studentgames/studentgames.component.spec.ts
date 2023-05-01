import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentgamesComponent } from './studentgames.component';

describe('StudentgamesComponent', () => {
  let component: StudentgamesComponent;
  let fixture: ComponentFixture<StudentgamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentgamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentgamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
