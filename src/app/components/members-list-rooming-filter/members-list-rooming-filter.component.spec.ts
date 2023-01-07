import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MembersListRoomingFilterComponent } from './members-list-rooming-filter.component';

describe('MembersListRoomingFilterComponent', () => {
  let component: MembersListRoomingFilterComponent;
  let fixture: ComponentFixture<MembersListRoomingFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersListRoomingFilterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MembersListRoomingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
