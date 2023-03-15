import { TestBed } from '@angular/core/testing';

import { CanActivateTasksGuard } from './can-activate-tasks.guard';

describe('CanActivateTasksGuard', () => {
  let guard: CanActivateTasksGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateTasksGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
