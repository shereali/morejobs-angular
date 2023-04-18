import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CvBankComponent } from './cv-bank.component';

describe('CvBankComponent', () => {
  let component: CvBankComponent;
  let fixture: ComponentFixture<CvBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvBankComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CvBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
