import { Component, OnInit, OnDestroy } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model'
import { Subscription, Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import * as fromShopingList from './shopping-list.reducer'
import * as  ShoppingListActions from './shopping-list.actions';
//import { ShoppingListService } from './removed-shopping-list.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private igChangedSub: Subscription;

  constructor(
    //private shoppinglistService: ShoppingListService,
    private logginService: LoggingService,
    //private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) { }
    private store: Store<fromShopingList.AppState>) { }


  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppinglistService.getIngredients();
    // this.igChangedSub = this.shoppinglistService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );

    this.logginService.printLog('Hello from ShoppingListComponent ngOnInit')
  }

  onEditItem(index: number) {
    //this.shoppinglistService.startedEditing.next(index)
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {
    //this.igChangedSub.unsubscribe();
  }

}
