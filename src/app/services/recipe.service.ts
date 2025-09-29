import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe, RecipeData } from '../models/recipe.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<RecipeData>('recipes.json').pipe(
      map(data => data.recipes)
    );
  }

  getRecipesByProductId(productId: number): Observable<Recipe[]> {
    return this.http.get<RecipeData>('recipes.json').pipe(
      map(data => data.recipes.filter(recipe => recipe.linked_product_id === productId))
    );
  }

  getRecipeById(recipeId: number): Observable<Recipe | undefined> {
    return this.http.get<RecipeData>('recipes.json').pipe(
      map(data => data.recipes.find(recipe => recipe.id === recipeId))
    );
  }
}
