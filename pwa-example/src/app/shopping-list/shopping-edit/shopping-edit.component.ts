import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, from } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model'
import { ShoppingListService } from '../shopping-list.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list.actions';
import * as fromShopingList from '../shopping-list.reducer';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})

export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) shoppingListForm: NgForm;
  subcription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppinglistService: ShoppingListService,
    //private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
    private store: Store<fromShopingList.AppState>
  ) { }

  ngOnInit() {
    this.subcription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false;
      }
    });
    // this.subcription = this.shoppinglistService.startedEditing
    //   .subscribe(
    //     (index: number) => {
    //       this.editedItemIndex = index;
    //       this.editMode = true;
    //       this.editedItem = this.shoppinglistService.getIngredient(index);
    //       this.shoppingListForm.setValue({
    //         name: this.editedItem.name,
    //         amount: this.editedItem.amount
    //       })
    //     });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      //this.shoppinglistService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient({ index: this.editedItemIndex, ingredient: newIngredient }))
    } else {
      //this.shoppinglistService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());

  }

  onDelete() {
    //this.shoppinglistService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeletIngredient(this.editedItemIndex))

    this.onClear();
  }

  ngOnDestroy() {
    this.subcription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

}
