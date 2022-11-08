import { ComponentFixture, TestBed } from '@angular/core/testing';

import { USComponent } from './us.component';

describe('USComponent', () => {
  let component: USComponent;
  let fixture: ComponentFixture<USComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ USComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(USComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
