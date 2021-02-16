import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightProgressService } from '../../flight-progress.service';
import { LoadingService } from '../../loading.service';
import { PilotService } from '../../pilot.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  wrongCredentials = false;

  constructor(
    private _fb: FormBuilder,
    private _pilotService: PilotService,
    private _loadingService: LoadingService,
    private _router: Router,
    private _flightProgressService: FlightProgressService
    ) {
    this.loginForm = this._fb.group({
      email: ['example@example.com', [Validators.required, Validators.email]],
      password: ['password', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  async login() {
    this._loadingService.startLoading();
    try {
      await this._pilotService.login(this.loginForm.value.email, this.loginForm.value.password).toPromise()
      if (this._flightProgressService.isRecovery) {
        this._router.navigateByUrl('flight-progress')
      } else {
        this._router.navigateByUrl('home')
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.wrongCredentials = true;
      }
    }
    this._loadingService.stopLoading();
  }

}
