import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimbriefComponent } from './simbrief.component';

describe('SimbriefComponent', () => {
  let component: SimbriefComponent;
  let fixture: ComponentFixture<SimbriefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimbriefComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimbriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
