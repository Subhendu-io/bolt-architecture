import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/services/auth/auth.service';
import { ApiService } from '@app/services/api/api.service';

import { environment } from '@env/environment';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  currentUser: any;
  isDeveloper: boolean;
  isPreDeveloper: boolean;

  logo = environment.APP_LOGO;
  title = 'Developer | ' + environment.COMPANY_NAME;

  constructor(
    private location: Location,
    private element: ElementRef,
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
  ) {
    this.currentUser = this.auth.isLoggedIn();
    this.isDeveloper = this.auth.hasRole('DEVELOPER');
    this.isPreDeveloper = this.auth.hasRole('PREDEVELOPER');
  }

  ngOnInit() { }

}
