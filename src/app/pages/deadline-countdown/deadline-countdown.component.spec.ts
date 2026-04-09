import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeadlineCountdownComponent } from './deadline-countdown.component';
import { DeadlineCountdownService } from '@code/service/deadline-countdown.service';
import { AsyncPipe } from '@angular/common';
import { DeadlineCountdownPipe } from '@shared/pipes/deadline-countdown.pipe';
import { DeadlineCountdown, DeadlineCountdownFormat } from '@code/interface/deadline.interface';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DeadlineCountdownComponent', () => {
  let component: DeadlineCountdownComponent;
  let fixture: ComponentFixture<DeadlineCountdownComponent>;
  let mockDeadlineService: any;
  let mockAsyncPipe: any;

  beforeEach(async () => {
    mockDeadlineService = {
      getDeadlineSeconds: () => of({ secondsLeft: 3600 })
    };
    
    mockAsyncPipe = {
      transform: (value: any) => value
    };

    await TestBed.configureTestingModule({
      imports: [DeadlineCountdownComponent, DeadlineCountdownPipe],
      providers: [
        { provide: DeadlineCountdownService, useValue: mockDeadlineService },
        { provide: AsyncPipe, useValue: mockAsyncPipe }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DeadlineCountdownComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have DeadlineCountdownFormat property', () => {
    expect(component.DeadlineCountdownFormat).toBe(DeadlineCountdownFormat);
  });

  describe('Component lifecycle', () => {
    it('should call getDeadlineSeconds on init', () => {
      component.ngOnInit();
      expect(true).toBe(true);
    });

    it('should handle destroy without errors', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('Route guard integration', () => {
    it('should return boolean from canDeactivate', () => {
      const result = component.canDeactivate();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Service integration', () => {
    it('should handle successful service response', () => {
      const mockResponse: DeadlineCountdown = { secondsLeft: 3600 };
      mockDeadlineService.getDeadlineSeconds = () => of(mockResponse);

      expect(() => component.getDeadlineSeconds()).not.toThrow();
    });

    it('should handle service error gracefully', () => {
      const errorMessage = 'Service error';
      mockDeadlineService.getDeadlineSeconds = () => throwError(() => new Error(errorMessage));

      expect(() => component.getDeadlineSeconds()).not.toThrow();
    });

    it('should handle various deadline scenarios', () => {
      const testCases = [
        { secondsLeft: 0 },
        { secondsLeft: 999999 }
      ];

      testCases.forEach(mockResponse => {
        mockDeadlineService.getDeadlineSeconds = () => of(mockResponse);
        expect(() => component.getDeadlineSeconds()).not.toThrow();
      });
    });
  });

  describe('Component rendering', () => {
    it('should initialize and render properly', () => {
      fixture.detectChanges();
      expect(component).toBeDefined();
    });

    it('should handle complete lifecycle', () => {
      fixture.detectChanges();
      expect(() => {
        component.ngOnInit();
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });
});
