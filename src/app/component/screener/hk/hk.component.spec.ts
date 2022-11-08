import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HKComponent } from './hk.component';

describe('HKComponent', () => {
  let component: HKComponent;
  let fixture: ComponentFixture<HKComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HKComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
