import { Routes } from "@angular/router";

export const PagesRoutes: Routes = [
    {
        path: "",
        loadComponent: () => import("./pages.component").then(com => com.PagesComponent),
        children: [
            {
                path: "",
                redirectTo: "deadline-countdown",
                pathMatch: "full"
            }
            ,
            {
                path: "deadline-countdown",
                loadChildren: () => import("./deadline-countdown").then(route => route.DeadlineCountdownRoutes)
            }
        ]
    }
]