import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaddingTypeComponent } from './padding-type.component';

describe('PaddingTypeComponent', () => {
  let component: PaddingTypeComponent;
  let fixture: ComponentFixture<PaddingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaddingTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaddingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
