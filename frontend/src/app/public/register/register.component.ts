import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  currentUser: any;

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
  ) {
    this.currentUser = this.auth.isLoggedIn();
    this.registerForm = new FormGroup({
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

  async register(value): Promise<void> {
    this.ngxLoader.start();
    this.auth.register(value.email.trim(), value.password.trim()).subscribe(response => {
      if (response['success']) {
        this.router.navigate(['/loading']);
      } else {
        this.ngxLoader.stop();
        this.toastr.error(response['message'], response['title']);
      }
    });
  }
}
