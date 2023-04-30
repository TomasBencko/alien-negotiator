import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelpModalComponent } from './help-modal/help-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'alien-negotiator';

  constructor(public dialog: MatDialog) {}

  openHelpModal(): void {
    this.dialog.open(HelpModalComponent);
  }

  refreshPage() {
    window.location.href = '/';
  }
}
