import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CvBankListComponent } from './cv-bank-list.component';

describe('ApplicantsComponent', () => {
  let component: CvBankListComponent;
  let fixture: ComponentFixture<CvBankListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvBankListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CvBankListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
