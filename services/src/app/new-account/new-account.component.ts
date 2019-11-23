import { Component, EventEmitter, Output } from '@angular/core';
import { LoggingService } from '../logging.service';  //this is the incorrect manual way
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  // providers: [LoggingService]
})
export class NewAccountComponent {
  //@Output() accountAdded = new EventEmitter<{ name: string, status: string }>();

  constructor(private loggingService: LoggingService, private accountsSerice: AccountsService) { }

  onCreateAccount(accountName: string, accountStatus: string) {
    // this.accountAdded.emit({
    //   name: accountName,
    //   status: accountStatus
    // });
    // this is the incorrect way to manually build service
    // const service = new LoggingService();
    // service.logStatusChange(accountStatus)
    //console.log('A server status changed, new status: ' + accountStatus);
    this.accountsSerice.addAccount(accountName, accountStatus);
    // this.loggingService.logStatusChange(accountStatus);
  }
}
