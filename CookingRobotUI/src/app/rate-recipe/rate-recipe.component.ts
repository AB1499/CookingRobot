import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rate-recipe',
  templateUrl: './rate-recipe.component.html',
  styleUrls: ['./rate-recipe.component.css']
})
export class RateRecipeComponent implements OnInit {

  rating: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  changeRating(rating: number) {
    this.rating = rating;
  }
}
