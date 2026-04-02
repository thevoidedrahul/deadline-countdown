import { Component, OnInit, signal, OnDestroy } from "@angular/core";
import { DeadlineCountdownService } from "@code/service/deadline-countdown.service";
import { interval, map, Observable, startWith, switchMap, takeWhile, catchError, EMPTY, Subject, takeUntil } from "rxjs";
import { DeadlineCountdownPipe } from "@shared/pipes/deadline-countdown.pipe";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "app-deadline-countdown",
    templateUrl: "./deadline-countdown.component.html",
    styleUrl: "./deadline-countdown.component.scss",
    standalone: true,
    imports: [AsyncPipe, DeadlineCountdownPipe]
})
export class DeadlineCountdownComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    protected loader = signal<boolean>(true);
    protected error = signal<string | null>(null);
    protected secondsLeft$ = new Observable<number>();

    constructor(private deadlineCountdownService: DeadlineCountdownService) {
    }

    ngOnInit(): void {
        this.getDeadlineSeconds();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getDeadlineSeconds() {
        this.secondsLeft$ = this.deadlineCountdownService.getDeadlineSeconds().pipe(
            switchMap(response => {
                this.loader.set(false);
                return interval(1000).pipe(
                    startWith(0),
                    map(tick => Math.max(0, response.secondsLeft - tick)),
                    takeWhile(sec => sec >= 0, true)
                );
            }),
            catchError(error => {
                console.error('Error fetching deadline:', error);
                this.error.set('Failed to load deadline information');
                this.loader.set(false);
                return EMPTY;
            }),
            takeUntil(this.destroy$)
        );
    }
}