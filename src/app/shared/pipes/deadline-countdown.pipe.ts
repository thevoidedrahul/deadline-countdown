import { Pipe, PipeTransform } from '@angular/core';
import { DeadlineCountdownFormat, DeadlineTimeComponents } from '@code/interface/deadline.interface';

@Pipe({
  name: 'deadlineCountdown',
  standalone: true,
  pure: true
})
export class DeadlineCountdownPipe implements PipeTransform {

  private static readonly SECONDS_IN_MINUTE = 60;
  private static readonly SECONDS_IN_HOUR = 3600;
  private static readonly SECONDS_IN_DAY = 86400;

  private static readonly TIME_UNITS = {
    day: { singular: 'day', plural: 'days' },
    hour: { singular: 'hour', plural: 'hours' },
    minute: { singular: 'minute', plural: 'minutes' },
    second: { singular: 'second', plural: 'seconds' }
  } as const;

  /**
   * Transform seconds into formatted time string with performance optimizations
   * @param seconds - Number of seconds to format
   * @param format - Output format: 'countdown', 'clock', or 'compact'. Default format: 'countdown'
   * @returns Formatted time string
   */
  transform(seconds: number, format: DeadlineCountdownFormat = DeadlineCountdownFormat.Countdown): string {
    if (this.isInvalidInput(seconds)) {
      return this.getDefaultValue(format);
    }

    const totalSeconds = Math.floor(Math.abs(seconds));
    const timeComponents = this.calculateTimeComponents(totalSeconds);

    return this.formatByType(timeComponents, format);
  }

  private isInvalidInput(seconds: number): boolean {
    return seconds == null || isNaN(seconds) || !isFinite(seconds) || seconds < 0;
  }


  private getDefaultValue(format: DeadlineCountdownFormat): string {
    switch (format) {
      case 'clock':
        return '00:00:00';
      case 'compact':
        return '0s';
      default:
        return 'Deadline reached!';
    }
  }


  private calculateTimeComponents(totalSeconds: number): DeadlineTimeComponents {
    const days = Math.floor(totalSeconds / DeadlineCountdownPipe.SECONDS_IN_DAY);
    const remainingAfterDays = totalSeconds % DeadlineCountdownPipe.SECONDS_IN_DAY;

    const hours = Math.floor(remainingAfterDays / DeadlineCountdownPipe.SECONDS_IN_HOUR);
    const remainingAfterHours = remainingAfterDays % DeadlineCountdownPipe.SECONDS_IN_HOUR;

    const minutes = Math.floor(remainingAfterHours / DeadlineCountdownPipe.SECONDS_IN_MINUTE);
    const seconds = remainingAfterHours % DeadlineCountdownPipe.SECONDS_IN_MINUTE;

    return { days, hours, minutes, seconds };
  }

  private formatByType(components: DeadlineTimeComponents, format: DeadlineCountdownFormat): string {
    switch (format) {
      case 'clock':
        return this.formatAsClock(components);
      case 'compact':
        return this.formatAsCompact(components);
      default:
        return this.formatAsCountdown(components);
    }
  }

  private formatAsCountdown({ days, hours, minutes, seconds }: DeadlineTimeComponents): string {
    const parts: string[] = [];

    const pluralize = (value: number, unit: { singular: string; plural: string }): string => {
      return `${value} ${value === 1 ? unit.singular : unit.plural}`;
    }

    if (days > 0) {
      parts.push(pluralize(days, DeadlineCountdownPipe.TIME_UNITS.day));
    }
    if (hours > 0 || days > 0) {
      parts.push(pluralize(hours, DeadlineCountdownPipe.TIME_UNITS.hour));
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      parts.push(pluralize(minutes, DeadlineCountdownPipe.TIME_UNITS.minute));
    }

    parts.push(pluralize(seconds, DeadlineCountdownPipe.TIME_UNITS.second));

    return parts.join(', ');
  }

  private formatAsClock({ days, hours, minutes, seconds }: DeadlineTimeComponents): string {
    const pad = (num: number): string => num.toString().padStart(2, '0');

    if (days > 0) {
      return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  private formatAsCompact({ days, hours, minutes, seconds }: DeadlineTimeComponents): string {
    if (days > 0) {
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    if (minutes > 0) {
      return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    }
    return `${seconds}s`;
  }
}

