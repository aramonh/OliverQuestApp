import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditQuestPage } from './edit-quest.page';

describe('EditQuestPage', () => {
  let component: EditQuestPage;
  let fixture: ComponentFixture<EditQuestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditQuestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditQuestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
