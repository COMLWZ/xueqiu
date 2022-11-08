import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockScreenerComponent } from './stock-screener.component';

describe('StockScreenerComponent', () => {
  let component: StockScreenerComponent;
  let fixture: ComponentFixture<StockScreenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockScreenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockScreenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
