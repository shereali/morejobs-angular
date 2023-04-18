import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DegreesComponent } from './degrees.component';

describe('DegreesComponent', () => {
  let component: DegreesComponent;
  let fixture: ComponentFixture<DegreesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DegreesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DegreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
