import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoslideshowComponent } from './videoslideshow.component';

describe('VideoslideshowComponent', () => {
  let component: VideoslideshowComponent;
  let fixture: ComponentFixture<VideoslideshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoslideshowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoslideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
