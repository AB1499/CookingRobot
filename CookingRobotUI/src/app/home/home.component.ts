import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Recipe } from '../create-recipe/create-recipe.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class HomeComponent implements OnInit {
  CookingRobotAPIUrl: string;
  recipes: Array<Recipe>;
  displayedColumns: string[] = ['name', 'description', 'userid', 'isVeg', 'cookingTime', 'rating'];
  selectedRecipe: Recipe;
  recipeData: RecipeData[] = [];
  dataSource: MatTableDataSource<any>;

  constructor(
    private router: Router, private http: HttpClient
  ) { 
    this.CookingRobotAPIUrl = environment.CookingRobotAPIUrl;
  }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.http.get(this.CookingRobotAPIUrl + 'recipes')
    .subscribe((response: Array<any>) => {
      this.recipes = response;
      response.forEach(r => {
        this.recipeData.push({
          _id: r._id,
          name: r.name,
          description: r.description,
          cookingTime: r.cookingTime,
          isVeg: r.isVeg,
          userid: r.userid,
          rating: 0
        });
      });
      this.dataSource = new MatTableDataSource(this.recipeData);
      // this.dataSource = this.recipeData;
    }, error => {
      console.log(error);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectRecipe(recipe: RecipeData): void {
    this.selectedRecipe = this.recipes.find(r => r._id === recipe._id);
  }

  cookRecipe(recipe: RecipeData): void {
    this.router.navigate(['/cook', { id: this.selectedRecipe._id }]);
  }
}

interface RecipeData {
  _id: string;
  name: string;
  description: string;
  cookingTime?: number;
  userid?: string;
  isVeg: boolean;
  rating: number;
}