import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CipherModeComponent } from './cipher-mode.component';

describe('CipherModeComponent', () => {
  let component: CipherModeComponent;
  let fixture: ComponentFixture<CipherModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CipherModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CipherModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
