import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  currentUser: any;

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
  ) {
    this.currentUser = this.auth.isLoggedIn();
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      remember_me: new FormControl(''),
    });
    if (this.currentUser) {
      this.router.navigate(['/console']);
    }
  }

  ngOnInit(): void {
  }

  async login(value): Promise<void> {
    this.toastr.warning('This is a long aassage for everyone', 'This is a small title');
    // this.ngxLoader.start();
    // this.auth.login(value.email.trim(), value.password.trim()).subscribe(response => {
    //   if (response['success']) {
    //     this.router.navigate(['/loading']);
    //   } else {
    //     this.ngxLoader.stop();
    //     this.toastr.error(response['message'], response['title']);
    //   }
    // });
  }
}
