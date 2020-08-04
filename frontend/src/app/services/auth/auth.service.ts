import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { environment } from '@env/environment';
import { GlobalService } from '@app/services/global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public tokenData: any;
  public googleTokenData: any;
  public currentUser: any;
  public currentGoogleUser: any;

  regUser: any;
  regGoogleUser: any;
  regGoogleToken: any;

  public redirectUrl = '';
  private api = environment.API;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private globalService: GlobalService,
    private ngxLoader: NgxUiLoaderService,
  ) { }

  get(url: string) {
    return this.httpClient.get(this.api + url).toPromise();
  }
  post(url: string, data: any) {
    return this.httpClient.post(this.api + url, data).toPromise();
  }

  login(email: string, password: string): Observable<any> {
    const credential = {
      email: email.toLowerCase(),
      password: this.globalService.getEncrypted(password)
    };
    return this.httpClient.post(this.api + '/auth/login', credential)
      .pipe(catchError(err => {
        this.ngxLoader.stop();
        return throwError(err);
      }))
      .map(response => {
        if (response['user'] !== undefined && response['_jwt'] !== undefined) {
          this.tokenData = this.globalService.getDecrypted(response['_jwt']);
          localStorage.setItem('_td', response['_jwt']);

          this.currentUser = this.globalService.getJwtUser(this.tokenData['access_token']);
          localStorage.setItem('_cu', this.globalService.getEncrypted(this.currentUser));
        }
        return response;
      });
  }
  refreshToken(): Observable<any> {
    if (localStorage.getItem('_td')) {
      const tokenData = this.globalService.getDecrypted(localStorage.getItem('_td'));
      const token = {refresh_token: tokenData['refresh_token']};

      return this.httpClient.post(this.api + '/auth/token', this.globalService.getEncrypted(token));
    } else {
      return null;
    }
  }
  logout() {
    if (localStorage.getItem('_td')) {
      const tokenData = this.globalService.getDecrypted(localStorage.getItem('_td'));
      if (tokenData['refresh_token']) {
        this.destroySession(tokenData).then(response => {}).catch(err => {
          console.log(err);
        });
      }
    }
    localStorage.removeItem('_cu');
    localStorage.removeItem('_td');
    localStorage.removeItem('_cgub');
    localStorage.removeItem('_gwt');
    this.tokenData = undefined;
    this.currentUser = undefined;
    this.googleTokenData = undefined;
    this.currentGoogleUser = undefined;
    this.toastr.success('Successfully logout from AccountingSuite™.');
    this.router.navigate(['/login']);
    this.ngxLoader.stop();
    this.ngxLoader.stopBackground();
  }
  destroySession(tokenData: object) {
    const token = {refresh_token: tokenData['refresh_token']};
    return this.httpClient.post(this.api + '/auth/logout', this.globalService.getEncrypted(token)).toPromise();
  }

  oAuthLogin(provider: string, data: object): Observable<any> {
    return this.httpClient.post(this.api + '/auth/login/social/' + provider, data)
    .pipe(catchError(err => {
      this.ngxLoader.stop();
      this.router.navigate(['/login']);
      return throwError(err);
    }))
    .map(response => {
      if (response['user'] && response['_jwt']) {
        this.tokenData = this.globalService.getDecrypted(response['_jwt']);
        localStorage.setItem('_td', response['_jwt']);

        this.currentUser = this.globalService.getJwtUser(this.tokenData['access_token']);
        localStorage.setItem('_cu', this.globalService.getEncrypted(this.currentUser));

        this.currentGoogleUser = response['googleUser'];
        localStorage.setItem('_cgub', this.globalService.getEncrypted(this.currentUser));

        this.googleTokenData = this.globalService.getDecrypted(response['_gwt']);
        localStorage.setItem('_gwt', response['_gwt']);
      }
      return response;
    });
  }
  oAuthRegister(provider: string, data: object): Observable<any> {
    return this.httpClient.post(this.api + '/auth/register/social/' + provider, data)
    .pipe(catchError(err => {
      this.ngxLoader.stop();
      this.router.navigate(['/register']);
      return throwError(err);
    }))
    .map(response => {
      this.regUser = response['user'];
      this.regGoogleUser = response['googleUser'];
      this.regGoogleToken = response['_gwt'];
      return response;
    });
  }

  isLoggedIn() {
    if (localStorage.getItem('_cu') != null) {
      const currentUser = this.currentUser ? this.currentUser : this.globalService.getDecrypted(localStorage.getItem('_cu'));
      return currentUser ? currentUser : false;
    }
    return false;
  }
  getToken() {
    if (localStorage.getItem('_td') != null) {
      const tokenData = this.tokenData ? this.tokenData : this.globalService.getDecrypted(localStorage.getItem('_td'));
      return tokenData ? tokenData.access_token : false;
    }
    return false;
  }
  hasRole(role: string): boolean {
    const user = this.isLoggedIn();
    if (user && user['roles']) {
      for (const userRole of user['roles']) {
        if (userRole.role === role) {
          return true;
        }
      }
    }
    return false;
  }
}
