import { TestBed } from '@angular/core/testing';

import { SearchExperienciasService } from './search-experiencias.service';

describe('SearchExperienciasService', () => {
  let service: SearchExperienciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchExperienciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
