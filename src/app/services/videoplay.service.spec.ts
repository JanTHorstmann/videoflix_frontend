import { TestBed } from '@angular/core/testing';

import { VideoplayService } from './videoplay.service';

describe('VideoplayService', () => {
  let service: VideoplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
