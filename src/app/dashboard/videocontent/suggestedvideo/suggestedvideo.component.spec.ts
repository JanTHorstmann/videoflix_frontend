import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedvideoComponent } from './suggestedvideo.component';

describe('SuggestedvideoComponent', () => {
  let component: SuggestedvideoComponent;
  let fixture: ComponentFixture<SuggestedvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestedvideoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuggestedvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
