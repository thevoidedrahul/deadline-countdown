import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-pages",
    templateUrl: "./pages.component.html",
    styleUrl: "./pages.component.scss",
    standalone: true,
    imports: [RouterOutlet]
})
export class PagesComponent { }
