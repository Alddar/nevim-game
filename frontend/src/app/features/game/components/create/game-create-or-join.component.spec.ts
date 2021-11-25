import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCreateOrJoinComponent } from './game-create-or-join.component';

describe('CreateComponent', () => {
  let component: GameCreateOrJoinComponent;
  let fixture: ComponentFixture<GameCreateOrJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameCreateOrJoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCreateOrJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
