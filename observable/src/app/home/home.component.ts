import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private firstObservableSubcription: Subscription

  constructor() { }

  ngOnInit() {
    //interval(1000).subscribe(count => {
    // this.firstObservableSubcription = interval(1000).subscribe(count => {
    //   console.log(count);
    // });
    // adding custom observable
    const customIntervalObservable = Observable.create(observer => {
      let count = 0;
      setInterval(() => {

        observer.next(count);
        count++;
      }, 1000)
    });

    customIntervalObservable.subscribe(data => {
      console.log(data);
    })
  }

  ngOnDestroy(): void {
    this.firstObservableSubcription.unsubscribe();
  }

}
