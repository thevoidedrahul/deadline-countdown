import { Routes } from "@angular/router";

export const DeadlineCountdownRoutes: Routes = [
    {
        path: "",
        loadComponent: () => import("./deadline-countdown.component").then(com => com.DeadlineCountdownComponent)
    }
]