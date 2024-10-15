import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewvideoComponent } from './previewvideo.component';

describe('PreviewvideoComponent', () => {
  let component: PreviewvideoComponent;
  let fixture: ComponentFixture<PreviewvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewvideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
