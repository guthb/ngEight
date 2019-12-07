import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

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
        //will count up to two and just stop
        //if (count === 2) {
        if (count === 5) {
          observer.complete();
        }
        ///if error with observable it just dies, cancels it, nothing else happens
        if (count > 3) {
          observer.error(new Error('Count is greater 3!'));
        }
        count++;
      }, 1000)
    });

    // customIntervalObservable.pipe(map((data: number) => {
    //   return "Round:" + (data + 1);

    // }));

    //this.firstObservableSubcription = customIntervalObservable.subscribe(data => {
    this.firstObservableSubcription = customIntervalObservable.pipe(filter(data => {
      return data > 0;
    }), map((data: number) => {
      return "Round:" + (data + 1);
    })).subscribe(data => {


      // console.log('Round:', +(data + 1));
      console.log(data);

    }, error => {
      console.log(error);
      alert(error.message);
    }, () => {
      //handling a complete reaction, the completion handler does not fire with error
      console.log('Completed!');
    });
  }

  ngOnDestroy(): void {
    this.firstObservableSubcription.unsubscribe();
  }

}
