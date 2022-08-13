import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Recipe } from '../create-recipe/create-recipe.component';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth-service';

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
  userid: string;
  ratings: Array<any>;
  newHistory: any;
  history: Array<any>;

  constructor(
    private router: Router, private http: HttpClient, public auth: AuthService
  ) { 
    this.CookingRobotAPIUrl = environment.CookingRobotAPIUrl;
    this.userid = this.auth.id;
    if(!this.userid)
      this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {

    this.http.get('http://ec2-50-16-143-51.compute-1.amazonaws.com/api/' + 'ratings')
    .subscribe((response: Array<any>) => {
      this.ratings = response;

      this.http.get('http://ec2-50-16-143-51.compute-1.amazonaws.com/api/' + 'recipes')
      .subscribe((response: Array<any>) => {
        this.recipes = response;
        response.forEach(r => {
          if(r.userid == '' || r.userid == this.auth.userid)
            this.recipeData.push({
              _id: r._id,
              name: r.name,
              description: r.description,
              cookingTime: r.cookingTime,
              isVeg: r.isVeg,
              userid: r.userid,
              rating: this.addRatings(r._id, )
            });
        });
        this.dataSource = new MatTableDataSource(this.recipeData);

        this.http.get('http://ec2-50-16-143-51.compute-1.amazonaws.com/api/' + 'histories/' + this.auth.userid)
        .subscribe((response: Array<any>) => {
          this.history = response.slice(0, 5);
        }, error => {
          console.log(error);
        });
      }, error => {
        console.log(error);
      });

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
    this.newHistory = {
      recipeid: this.selectedRecipe.name,
      userid: this.auth.userid
    };

    this.http.post('http://ec2-50-16-143-51.compute-1.amazonaws.com/api/' + 'histories', this.newHistory)
    .subscribe((response) => {
      this.router.navigate(['/cook', { id: this.selectedRecipe._id }]);
    }, error => {
      console.log(error);
    });
  }

  addRatings(id: string): string {
    let count = 0;
    let sum = 0;
    this.ratings.forEach(r => {
      if(r.recipeid == id) {
        sum = sum + r.rating;
        count++;
      }
    });

    return count > 0 ? (sum / count).toFixed(2) : '--';
  }

  deleteRecipe(): void {
    this.http.delete('http://ec2-50-16-143-51.compute-1.amazonaws.com/api/' + 'recipes/' + this.selectedRecipe._id)
    .subscribe((response) => {
      this.selectedRecipe = null;
      this.recipeData = [];
      this.loadPage();
    }, error => {
      console.log(error);
    });
  }

  editRecipe(): void {
    this.router.navigate(['create', { id: this.selectedRecipe._id, editMode: true }]);
  }
}

interface RecipeData {
  _id: string;
  name: string;
  description: string;
  cookingTime?: number;
  userid?: string;
  isVeg: boolean;
  rating: string;
}
