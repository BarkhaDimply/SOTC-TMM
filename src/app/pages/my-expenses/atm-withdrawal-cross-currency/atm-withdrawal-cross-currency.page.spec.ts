import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AtmWithdrawalCrossCurrencyPage } from './atm-withdrawal-cross-currency.page';

describe('AtmWithdrawalCrossCurrencyPage', () => {
  let component: AtmWithdrawalCrossCurrencyPage;
  let fixture: ComponentFixture<AtmWithdrawalCrossCurrencyPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtmWithdrawalCrossCurrencyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AtmWithdrawalCrossCurrencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
