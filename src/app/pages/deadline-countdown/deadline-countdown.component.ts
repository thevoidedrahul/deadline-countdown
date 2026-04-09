import { Component, OnInit, signal, OnDestroy, HostListener } from "@angular/core";
import { DeadlineCountdownService } from "@code/service/deadline-countdown.service";
import { interval, map, Observable, startWith, switchMap, takeWhile, catchError, EMPTY, Subject, takeUntil } from "rxjs";
import { DeadlineCountdownPipe } from "@shared/pipes/deadline-countdown.pipe";
import { AsyncPipe } from "@angular/common";
import { DeadlineCountdownFormat } from "@code/interface/deadline.interface";
import { CanComponentDeactivate } from '@code/interface/reload-prevent.interface';

@Component({
    selector: "app-deadline-countdown",
    templateUrl: "./deadline-countdown.component.html",
    styleUrl: "./deadline-countdown.component.scss",
    standalone: true,
    imports: [AsyncPipe, DeadlineCountdownPipe],
    providers: [AsyncPipe]
})
export class DeadlineCountdownComponent implements OnInit, OnDestroy, CanComponentDeactivate {
    readonly DeadlineCountdownFormat: typeof DeadlineCountdownFormat;
    private destroy$ = new Subject<void>();
    protected loader = signal<boolean>(true);
    protected error = signal<string | null>(null);
    protected secondsLeft$ = new Observable<number>();

    constructor(private deadlineCountdownService: DeadlineCountdownService, private asyncPipe: AsyncPipe) {
        this.DeadlineCountdownFormat = DeadlineCountdownFormat;
    }

    ngOnInit(): void {
        this.getDeadlineSeconds();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    @HostListener("window:beforeunload")
    canDeactivate(): boolean {
        const secondsLeft = this.asyncPipe.transform(this.secondsLeft$);
        return (secondsLeft ?? 0) > 0;
    }

    getDeadlineSeconds() {
        this.secondsLeft$ = this.deadlineCountdownService.getDeadlineSeconds().pipe(
            switchMap(response => {
                this.loader.set(false);
                return interval(1000).pipe(
                    startWith(-1),
                    map(tick => {
                        const secondsLeft = Math.max(0, response.secondsLeft - (tick + 1));
                        return secondsLeft;
                    }),
                    takeWhile(sec => sec > 0, true)
                );
            }),
            catchError(error => {
                this.error.set(error.message);
                this.loader.set(false);
                return EMPTY;
            }),
            takeUntil(this.destroy$)
        );
    }
}
