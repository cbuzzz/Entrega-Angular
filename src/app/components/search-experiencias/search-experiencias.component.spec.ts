import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchExperienciasComponent } from './search-experiencias.component';

describe('SearchExperienciasComponent', () => {
  let component: SearchExperienciasComponent;
  let fixture: ComponentFixture<SearchExperienciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchExperienciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchExperienciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
