import { describe, it, expect, beforeEach } from 'vitest';
import { DeadlineCountdownPipe } from './deadline-countdown.pipe';
import { DeadlineCountdownFormat } from '@code/interface/deadline.interface';

describe('DeadlineCountdownPipe', () => {
  let pipe: DeadlineCountdownPipe;

  beforeEach(() => {
    pipe = new DeadlineCountdownPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Countdown Format', () => {
    it('should format seconds correctly', () => {
      expect(pipe.transform(30, DeadlineCountdownFormat.Countdown)).toBe('30 seconds');
      expect(pipe.transform(1, DeadlineCountdownFormat.Countdown)).toBe('1 second');
    });

    it('should format minutes correctly', () => {
      expect(pipe.transform(120, DeadlineCountdownFormat.Countdown)).toBe('2 minutes, 0 seconds');
      expect(pipe.transform(90, DeadlineCountdownFormat.Countdown)).toBe('1 minute, 30 seconds');
    });

    it('should format hours correctly', () => {
      expect(pipe.transform(3600, DeadlineCountdownFormat.Countdown)).toBe('1 hour, 0 minutes, 0 seconds');
      expect(pipe.transform(3661, DeadlineCountdownFormat.Countdown)).toBe('1 hour, 1 minute, 1 second');
      expect(pipe.transform(7200, DeadlineCountdownFormat.Countdown)).toBe('2 hours, 0 minutes, 0 seconds');
    });

    it('should format days correctly', () => {
      expect(pipe.transform(86400, DeadlineCountdownFormat.Countdown)).toBe('1 day, 0 hours, 0 minutes, 0 seconds');
      expect(pipe.transform(90061, DeadlineCountdownFormat.Countdown)).toBe('1 day, 1 hour, 1 minute, 1 second');
      expect(pipe.transform(172800, DeadlineCountdownFormat.Countdown)).toBe('2 days, 0 hours, 0 minutes, 0 seconds');
    });

    it('should handle zero and invalid values', () => {
      expect(pipe.transform(0, DeadlineCountdownFormat.Countdown)).toBe('0 seconds');
      expect(pipe.transform(-10, DeadlineCountdownFormat.Countdown)).toBe('Deadline reached!');
      expect(pipe.transform(NaN, DeadlineCountdownFormat.Countdown)).toBe('Deadline reached!');
      expect(pipe.transform(Infinity, DeadlineCountdownFormat.Countdown)).toBe('Deadline reached!');
    });
  });

  describe('Clock Format', () => {
    it('should format time in HH:MM:SS format', () => {
      expect(pipe.transform(3661, DeadlineCountdownFormat.Clock)).toBe('01:01:01');
      expect(pipe.transform(3600, DeadlineCountdownFormat.Clock)).toBe('01:00:00');
      expect(pipe.transform(61, DeadlineCountdownFormat.Clock)).toBe('00:01:01');
      expect(pipe.transform(1, DeadlineCountdownFormat.Clock)).toBe('00:00:01');
    });

    it('should format with days when applicable', () => {
      expect(pipe.transform(90061, DeadlineCountdownFormat.Clock)).toBe('1:01:01:01');
      expect(pipe.transform(86400, DeadlineCountdownFormat.Clock)).toBe('1:00:00:00');
      expect(pipe.transform(172800, DeadlineCountdownFormat.Clock)).toBe('2:00:00:00');
    });

    it('should handle invalid values', () => {
      expect(pipe.transform(0, DeadlineCountdownFormat.Clock)).toBe('00:00:00');
      expect(pipe.transform(-10, DeadlineCountdownFormat.Clock)).toBe('00:00:00');
      expect(pipe.transform(NaN, DeadlineCountdownFormat.Clock)).toBe('00:00:00');
    });
  });

  describe('Compact Format', () => {
    it('should format in compact style', () => {
      expect(pipe.transform(3661, DeadlineCountdownFormat.Compact)).toBe('1h 1m');
      expect(pipe.transform(61, DeadlineCountdownFormat.Compact)).toBe('1m 1s');
      expect(pipe.transform(1, DeadlineCountdownFormat.Compact)).toBe('1s');
      expect(pipe.transform(90061, DeadlineCountdownFormat.Compact)).toBe('1d 1h');
      expect(pipe.transform(86400, DeadlineCountdownFormat.Compact)).toBe('1d');
    });

    it('should handle invalid values', () => {
      expect(pipe.transform(0, DeadlineCountdownFormat.Compact)).toBe('0s');
      expect(pipe.transform(-10, DeadlineCountdownFormat.Compact)).toBe('0s');
      expect(pipe.transform(NaN, DeadlineCountdownFormat.Compact)).toBe('0s');
    });
  });

  describe('Default behavior and edge cases', () => {
    it('should use countdown format by default', () => {
      expect(pipe.transform(30)).toBe('30 seconds');
      expect(pipe.transform(90)).toBe('1 minute, 30 seconds');
    });

    it('should handle large numbers and decimals', () => {
      const largeNumber = 999999999;
      const result = pipe.transform(largeNumber, DeadlineCountdownFormat.Countdown);
      expect(result).toContain('days');
      
      expect(pipe.transform(30.9, DeadlineCountdownFormat.Countdown)).toBe('30 seconds');
      expect(pipe.transform(90.1, DeadlineCountdownFormat.Clock)).toBe('00:01:30');
    });
  });
});
