import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueStatisticComponent } from './revenue-statistic.component';

describe('RevenueStatisticComponent', () => {
  let component: RevenueStatisticComponent;
  let fixture: ComponentFixture<RevenueStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
