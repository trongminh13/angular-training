import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDatatableComponent } from './my-datatable.component';

describe('MyDatatableComponent', () => {
  let component: MyDatatableComponent;
  let fixture: ComponentFixture<MyDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
