import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrossCurrencyByCardPage } from './cross-currency-by-card.page';

describe('CrossCurrencyByCardPage', () => {
  let component: CrossCurrencyByCardPage;
  let fixture: ComponentFixture<CrossCurrencyByCardPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossCurrencyByCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrossCurrencyByCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
