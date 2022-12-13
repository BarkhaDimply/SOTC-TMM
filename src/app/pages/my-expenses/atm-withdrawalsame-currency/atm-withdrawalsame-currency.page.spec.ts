import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AtmWithdrawalsameCurrencyPage } from './atm-withdrawalsame-currency.page';

describe('AtmWithdrawalsameCurrencyPage', () => {
  let component: AtmWithdrawalsameCurrencyPage;
  let fixture: ComponentFixture<AtmWithdrawalsameCurrencyPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtmWithdrawalsameCurrencyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AtmWithdrawalsameCurrencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
