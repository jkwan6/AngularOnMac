import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SideNavService } from './service/SideNavService/SideNavService';
import { OidcSecurityService } from 'angular-auth-oidc-client';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(
    private sideNavService: SideNavService,
    public oidcSecurityService: OidcSecurityService) { }
  subscription!: Subscription;
  ngOnInit(): void {

    this.oidcSecurityService
    .checkAuth()
    .subscribe(({ isAuthenticated, userData, accessToken }) => {
      console.log('app authenticated', isAuthenticated);
      console.log(`Current access token is '${accessToken}'`);
    });


    let sideBarContainer: HTMLDivElement = document.querySelector('.LayoutFlexContainer')!;
    this.subscription = this.sideNavService.$themeLocalStorage.subscribe(results => {
      console.log(`results: ${results}`)
      if (results) {
        sideBarContainer.classList.add('dark-theme');
      }
      else {
        sideBarContainer.classList.remove('dark-theme');
      }
    })
  }



}
