import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deadlineCountdown',
  standalone: true
})
export class DeadlineCountdownPipe implements PipeTransform {

  /**
   * Transform seconds into formatted time string
   * @param seconds - Number of seconds to format
   * @param format - Output format: 'countdown' or 'clock'
   * @returns Formatted time string
   */
  transform(seconds: number, format: 'countdown' | 'clock' = 'countdown'): string {
    // Handle invalid or negative values
    if (!seconds || seconds < 0) {
      return format === 'clock' ? '00:00:00' : 'Deadline reached!';
    }

    const totalSeconds = Math.floor(seconds);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (format === 'clock') {
      return this.formatAsClock(days, hours, minutes, secs);
    } else {
      return this.formatAsCountdown(days, hours, minutes, secs);
    }
  }

  private formatAsCountdown(days: number, hours: number, minutes: number, seconds: number): string {
    const parts: string[] = [];

    if (days > 0) {
      parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    }

    if (hours > 0 || days > 0) {
      parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    }

    if (minutes > 0 || hours > 0 || days > 0) {
      parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    }

    parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

    return parts.join(', ');
  }

  private formatAsClock(days: number, hours: number, minutes: number, seconds: number): string {
    const pad = (num: number): string => num.toString().padStart(2, '0');

    if (days > 0) {
      return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    } else {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
  }
}
