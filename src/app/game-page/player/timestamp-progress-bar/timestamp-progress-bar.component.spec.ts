import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampProgressBarComponent } from './timestamp-progress-bar.component';

describe('TimestampProgressBarComponent', () => {
  let component: TimestampProgressBarComponent;
  let fixture: ComponentFixture<TimestampProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimestampProgressBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimestampProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
