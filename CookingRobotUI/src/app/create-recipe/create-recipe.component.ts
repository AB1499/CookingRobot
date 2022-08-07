import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css']
})
export class CreateRecipeComponent implements OnInit {

  CookingRobotAPIUrl: string;
  createForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  newRecipe: Recipe;
  cookingTime: number;
  steps: Array<Step>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  userid: string;
  isEditMode: boolean = false;
  selectedId: string;
  recipeName: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.CookingRobotAPIUrl = environment.CookingRobotAPIUrl;
    this.steps = [ this.getNewStep() ]; 
    this.userid = this.authService.id;
    if(!this.userid)
      this.router.navigate(['login']);

    this.isEditMode = this.route.snapshot.paramMap.get('editMode') == "true" ? true : false;
    this.selectedId = this.route.snapshot.paramMap.get('id');

    if(this.isEditMode)
    {
      this.http.get(this.CookingRobotAPIUrl + 'recipes/' + this.selectedId)
      .subscribe((response) => {
        let recipe = response[0];
        this.recipeName = recipe.name;
        this.createForm = this.formBuilder.group({
          name: [recipe.name, Validators.required],
          description: [recipe.description, Validators.required],
          isVeg: [recipe.isVeg],
          cookingTime: [Number(recipe.cookingTime), Validators.required]
        });
        this.steps = recipe.steps;
      }, error => {
        console.log(error);
      });
    }
    else 
    {
      this.createForm = this.formBuilder.group({
        name: [null, Validators.required],
        description: [null, Validators.required],
        isVeg: [false],
        cookingTime: [null, Validators.required]
      });
    }
  }

  ngOnInit(): void {
  }

  create(): void {
    if (!this.createForm.valid) {
      this.snackBar.open('Fill all the details', '',
        {
          duration: 2000,
          panelClass: ['my-snackbar'],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      return;
    }

    this.newRecipe = {
      name: this.createForm.value.name,
      description: this.createForm.value.description,
      cookingTime: this.createForm.value.cookingTime,
      isVeg: this.createForm.value.isVeg,
      userid: this.auth.userid,
      steps: this.steps
    };

    this.http.post(this.CookingRobotAPIUrl + 'recipes', this.newRecipe)
    .subscribe((response) => {
      this.snackBar.open('Added recipe', '',
        {
          duration: 2000,
          panelClass: ['my-snackbar'],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      this.router.navigate(['home']);
    }, error => {
      console.log(error);
      this.snackBar.open('Please fill all valid recipe details', '',
        {
          duration: 3000,
          panelClass: ['my-snackbar'],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
    });
  }

  update(): void {
    this.http.delete(this.CookingRobotAPIUrl + 'recipes/' + this.selectedId)
    .subscribe((response) => {
      this.newRecipe = {
        name: this.createForm.value.name,
        description: this.createForm.value.description,
        cookingTime: this.createForm.value.cookingTime,
        isVeg: this.createForm.value.isVeg,
        userid: this.auth.userid,
        steps: this.steps
      };
  
      this.http.post(this.CookingRobotAPIUrl + 'recipes', this.newRecipe)
      .subscribe((response) => {
        this.snackBar.open('Updated recipe', '',
          {
            duration: 2000,
            panelClass: ['my-snackbar'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        this.router.navigate(['home']);
      }, error => {
        console.log(error);
        this.snackBar.open('Please fill all valid recipe details', '',
          {
            duration: 3000,
            panelClass: ['my-snackbar'],
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
      });
    }, error => {
      console.log(error);
    });
  }

  getNewStep(): Step {
    return {
      name: 'New step name',
      description: 'New step description',
      isRobotStep: false,
      ingredients: [ this.getNewIngredient() ],
      utensils: [],
      stepTimeTaken: 0
    };
  }

  getNewIngredient(): Ingredient {
    return {
      name: 'Ingredient name',
      amountPerServing: 0,
      quantityUnit: 'g'
    };
  }

  addStep(): void {
    this.steps = [ ...this.steps, this.getNewStep() ];
  }

  addIngredient(step: Step): void {
    step.ingredients = [ ...step.ingredients, this.getNewIngredient() ];
  }

  add(step: Step, event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      step.utensils.push(value);
    }

    // Clear the input value
    if (event.input) {
      event.input.value = '';
    }
  }

  remove(step: Step, utensil: string): void {
    const index = step.utensils.indexOf(utensil);

    if (index >= 0) {
      step.utensils.splice(index, 1);
    }
  }
}


interface Ingredient{
  name: string;
  amountPerServing: number;
  quantityUnit: string;
}

interface Step {
  name: string;
  description: string;
  isRobotStep: boolean;
  ingredients: Array<Ingredient>;
  utensils: Array<string>;
  stepTimeTaken: number;
}

export interface Recipe {
  _id?: string;
  name: string;
  description: string;
  cookingTime?: number;
  userid?: string;
  isVeg: boolean;
  steps: Array<Step>;
}