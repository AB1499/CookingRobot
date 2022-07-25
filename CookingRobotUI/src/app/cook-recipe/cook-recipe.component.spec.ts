import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookRecipeComponent } from './cook-recipe.component';

describe('CookRecipeComponent', () => {
  let component: CookRecipeComponent;
  let fixture: ComponentFixture<CookRecipeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookRecipeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
