import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeddialogComponent } from './feeddialog.component';

describe('FeeddialogComponent', () => {
  let component: FeeddialogComponent;
  let fixture: ComponentFixture<FeeddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeddialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeeddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
