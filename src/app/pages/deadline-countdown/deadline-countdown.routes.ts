import { Routes } from "@angular/router";
import { reloadPreventGuard } from "@code/guard/reload-prevent.guard";

export const DeadlineCountdownRoutes: Routes = [
    {
        path: "",
        loadComponent: () => import("./deadline-countdown.component").then(com => com.DeadlineCountdownComponent),
        canDeactivate: [reloadPreventGuard]
    }
]