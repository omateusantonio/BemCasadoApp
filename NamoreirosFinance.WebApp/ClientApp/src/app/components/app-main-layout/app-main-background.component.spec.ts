import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMainbackgroundComponent } from './app-main-background.component';

describe('AppMainbackgroundComponent', () => {
  let component: AppMainbackgroundComponent;
  let fixture: ComponentFixture<AppMainbackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppMainbackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMainbackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
