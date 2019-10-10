import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model'

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})

export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = [
    new Recipe('a test recipe', 'this is a test', 'https://www.maxpixel.net/static/photo/2x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg'),

    new Recipe('a test recipe', 'this is a test', 'https://www.maxpixel.net/static/photo/2x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg')
  ];

  constructor() { }

  ngOnInit() {
  }

}
