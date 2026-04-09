export interface DeadlineCountdown {
    secondsLeft: number;
}

export interface DeadlineTimeComponents {
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
}

export enum DeadlineCountdownFormat {
    Clock = 'clock',
    Compact = 'compact',
    Countdown = 'countdown'
}
