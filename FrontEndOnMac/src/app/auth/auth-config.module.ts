import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
    imports: [
        AuthModule.forRoot({
        config: {
              authority: 'https://localhost:5700',
              redirectUrl: 'https://localhost:4200/home',
              postLogoutRedirectUri: 'https://localhost:4200/home', 
              clientId: 'AuthCodeFlow',
              scope: 'openid offline_access', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
              ignoreNonceAfterRefresh: true
          }
      })],
    exports: [AuthModule],
})
export class AuthConfigModule {}
