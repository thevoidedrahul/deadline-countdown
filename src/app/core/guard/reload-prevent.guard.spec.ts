import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { reloadPreventGuard } from './reload-prevent.guard';
import { CanComponentDeactivate } from '@code/interface/reload-prevent.interface';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('reloadPreventGuard', () => {
  let mockRouter: any;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockRouter = {
      navigate: () => Promise.resolve(true)
    };

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should be created', () => {
    expect(reloadPreventGuard).toBeTruthy();
  });

  describe('canDeactivate functionality', () => {
    it('should return true when component allows deactivation', () => {
      const mockComponent: CanComponentDeactivate = {
        canDeactivate: () => true
      };

      const result = reloadPreventGuard(mockComponent, mockRoute, mockState, mockState);

      expect(result).toBe(true);
    });

    it('should handle component without canDeactivate method', () => {
      const mockComponent = {} as CanComponentDeactivate;

      const result = reloadPreventGuard(mockComponent, mockRoute, mockState, mockState);

      expect(result).toBe(true);
    });

    it('should handle null and undefined components', () => {
      expect(reloadPreventGuard(null as any, mockRoute, mockState, mockState)).toBe(true);
      expect(reloadPreventGuard(undefined as any, mockRoute, mockState, mockState)).toBe(true);
    });

    it('should handle component that prevents deactivation', () => {
      const mockComponent: CanComponentDeactivate = {
        canDeactivate: () => false
      };

      const originalConfirm = window.confirm;
      window.confirm = () => false;

      const result = reloadPreventGuard(mockComponent, mockRoute, mockState, mockState);

      expect(typeof result).toBe('boolean');
      expect(result).toBe(false);

      window.confirm = originalConfirm;
    });
  });
});
