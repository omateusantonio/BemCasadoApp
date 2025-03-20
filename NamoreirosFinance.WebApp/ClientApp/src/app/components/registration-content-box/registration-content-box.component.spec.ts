import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationContentBoxComponent } from './registration-content-box.component';

describe('RegistrationContentBoxComponent', () => {
  let component: RegistrationContentBoxComponent;
  let fixture: ComponentFixture<RegistrationContentBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationContentBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationContentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
