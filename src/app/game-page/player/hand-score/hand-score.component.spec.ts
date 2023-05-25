import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandScoreComponent } from './hand-score.component';

describe('HandScoreComponent', () => {
  let component: HandScoreComponent;
  let fixture: ComponentFixture<HandScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
