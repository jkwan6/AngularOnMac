import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../../service/AuthenticationService/AuthenticationService';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OpenIdConfiguration, OidcClientNotification, UserDataResult, OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-nav-bar-menu',
  templateUrl: './nav-bar-menu.component.html',
  styleUrls: ['./nav-bar-menu.component.css']
})

export class NavBarMenuComponent implements OnInit {

  // Authentication Stuff
  configuration$!: Observable<OpenIdConfiguration>;
  userDataChanged$!: Observable<OidcClientNotification<any>>;
  userData$!: Observable<UserDataResult>;
  isAuthenticated = false;
  // Authentication Stuff

  vm = this;  // Variable used in the HTML Template
  isPressed: boolean = false;
  isLoggedIn!: boolean;

  showDelay = new FormControl(500);
  hideDelay = new FormControl(0);

  toggleStatus!: boolean;
  subscription: Subscription = new Subscription;
  constructor(
    public dialog: MatDialog,
    private sideNavService: SideNavService,
    private authStateService: AuthenticationService, // SS Auth stuff
    public oidcSecurityService: OidcSecurityService // Actual Auth Stuff
  ) { };

  ngOnInit(): void {
    this.subscription.add(
      this.sideNavService.sidebarToggleStatus$.subscribe(toggleStatus => this.toggleStatus = toggleStatus))
    this.subscription.add(
      this.authStateService.$authState.subscribe(results => this.isLoggedIn = results))

      this.configuration$ = this.oidcSecurityService.getConfiguration();
      this.userData$ = this.oidcSecurityService.userData$;
  
      this.oidcSecurityService.isAuthenticated$.subscribe(
        ({ isAuthenticated }) => {
          this.isAuthenticated = isAuthenticated;
  
          console.warn('authenticated: ', isAuthenticated);
        }
      );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  login() {
    this.oidcSecurityService.authorize();
  }



  onToggle() {
    if (this.toggleStatus) {
      this.sideNavService.changeSidebarStatus(false)
      this.toggleStatus = false;
    }
    else {
      this.sideNavService.changeSidebarStatus(true)
      this.toggleStatus = true;
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog)
  }
}


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'log-out-confirmation-dialog.html',
  styleUrls: ['./nav-bar-menu.component.css']
})
export class DialogAnimationsExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,
    private authStateService: AuthenticationService,
    public oidcSecurityService: OidcSecurityService // Actual Auth Stuff
  ) { }

  onLogOut() {
    this.authStateService.logout();
  }

  logoffAndRevokeTokens() {
    this.oidcSecurityService
      .logoffAndRevokeTokens()
      .subscribe((result) => console.log(result));
  }
}
