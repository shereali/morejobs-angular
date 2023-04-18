import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JobViewResumeComponent } from './job-view-resume.component';

describe('JobViewResumeComponent', () => {
  let component: JobViewResumeComponent;
  let fixture: ComponentFixture<JobViewResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobViewResumeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JobViewResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
