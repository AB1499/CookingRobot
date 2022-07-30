import { Routes } from '@angular/router';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CookRecipeComponent } from './cook-recipe/cook-recipe.component';

export const appRoutes: Routes = [

    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'create', component: CreateRecipeComponent },
    { path: 'cook', component: CookRecipeComponent },
    { path: '**', redirectTo: '', pathMatch: 'full'}
];