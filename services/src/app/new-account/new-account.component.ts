import { Component, EventEmitter, Output } from '@angular/core';
import { LoggingService } from '../logging.service';  //this is the incorrect manual way

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  providers: [LoggingService]
})
export class NewAccountComponent {
  @Output() accountAdded = new EventEmitter<{ name: string, status: string }>();

  constructor(private loggingService: LoggingService) { }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountAdded.emit({
      name: accountName,
      status: accountStatus
    });
    // this is the incorrect way to manually build service
    // const service = new LoggingService();
    // service.logStatusChange(accountStatus)
    //console.log('A server status changed, new status: ' + accountStatus);
    this.loggingService.logStatusChange(accountStatus);
  }
}
