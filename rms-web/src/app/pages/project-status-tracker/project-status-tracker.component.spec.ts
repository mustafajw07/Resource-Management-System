import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatusTrackerComponent } from './project-status-tracker.component';

describe('ProjectStatusTrackerComponent', () => {
  let component: ProjectStatusTrackerComponent;
  let fixture: ComponentFixture<ProjectStatusTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStatusTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectStatusTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
