import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatComponent } from '../format/format.component';


describe('OutputFormatComponent', () => {
  let component: FormatComponent;
  let fixture: ComponentFixture<FormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
