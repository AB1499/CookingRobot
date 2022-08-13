import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth-service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rate-recipe',
  templateUrl: './rate-recipe.component.html',
  styleUrls: ['./rate-recipe.component.css']
})
export class RateRecipeComponent implements OnInit {

  rating: number = 0;
  CookingRobotAPIUrl: string;
  userid: string;
  recipeid: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { 
    this.CookingRobotAPIUrl = environment.CookingRobotAPIUrl;
    this.userid = this.authService.id;
    if(!this.userid)
      this.router.navigate(['login']);
    this.recipeid = data.recipeid;
  }

  ngOnInit(): void {
  }

  changeRating(rating: number) {
    this.rating = rating;
  }

  submitRating() {
    const newRating: Rating = {
      rating: this.rating,
      recipeid: this.recipeid,
      userid: this.userid
    };
    this.http.post('http://ec2-50-16-143-51.compute-1.amazonaws.com/api/' + 'ratings', newRating)
    .subscribe((response) => {
      
    }, error => {
      console.log(error);
    });
  }
}

export interface Rating {
  recipeid: string;
  userid: string;
  rating: number;
}