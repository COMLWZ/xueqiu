import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CNComponent } from './cn.component';

describe('CNComponent', () => {
  let component: CNComponent;
  let fixture: ComponentFixture<CNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CNComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
