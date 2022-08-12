import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RatioTileStyler } from '@angular/material/grid-list/tile-styler';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Recipe } from '../create-recipe/create-recipe.component';
import { RateRecipeComponent } from '../rate-recipe/rate-recipe.component';


@Component({
  selector: 'app-cook-recipe',
  templateUrl: './cook-recipe.component.html',
  styleUrls: ['./cook-recipe.component.css']
})
export class CookRecipeComponent implements OnInit {

  selectedId: string;
  CookingRobotAPIUrl: string;
  recipe: Recipe;
  noOfServings: number = 1;

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.CookingRobotAPIUrl = environment.CookingRobotAPIUrl;
    this.selectedId = this.route.snapshot.paramMap.get('id');
    this.loadPage();
  }

  loadPage(): void {
    this.http.get(config.apiUrl + 'recipes/' + this.selectedId)
    .subscribe((response: Array<any>) => {
      this.recipe = response[0];
    }, error => {
      console.log(error);
    });
  }

  goToRecipes(): void {
    this.router.navigate(['home']);
  }

  openRatingDialog(): void {
    const dialogRef = this.dialog.open(RateRecipeComponent, {
      data: {
        recipeid: this.selectedId
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}