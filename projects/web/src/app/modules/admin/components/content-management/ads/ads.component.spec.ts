import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdsComponent } from './ads.component';

describe('CategoriesComponent', () => {
  let component: AdsComponent;
  let fixture: ComponentFixture<AdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
