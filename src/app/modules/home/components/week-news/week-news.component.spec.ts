import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekNewsComponent } from './week-news.component';

describe('WeekNewsComponent', () => {
  let component: WeekNewsComponent;
  let fixture: ComponentFixture<WeekNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekNewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
