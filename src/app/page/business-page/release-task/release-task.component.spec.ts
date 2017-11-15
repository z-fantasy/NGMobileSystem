import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseTaskComponent } from './release-task.component';

describe('ReleaseTaskComponent', () => {
  let component: ReleaseTaskComponent;
  let fixture: ComponentFixture<ReleaseTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
