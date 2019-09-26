import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  // private user: User;
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService) { }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.user = null;
        this.afAuth.auth.signOut();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(result => {
        // this.authSuccessfully();
        this.uiService.loadingStateChanged.next(false);
      })
      .catch(error => {
        // console.log(error);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 4000);
      });
  }

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password)
      .then(result => {
        console.log(result);
        this.uiService.loadingStateChanged.next(false);
        // this.authSuccessfully();
      })
      .catch(error => {
        // console.log(error);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 4000);
      });
  }

  logout() {
    // this.trainingService.cancelSubscriptions();
    // this.user = null;
    this.afAuth.auth.signOut();
    // this.authChange.next(false);
    // this.router.navigate(['/login']);
    // this.isAuthenticated = false;
  }

  // getUser() {
  //   return { ...this.user };
  // }

  isAuth() {
    // return this.user != null;
    return this.isAuthenticated;
  }

  // private authSuccessfully() {
  // this.isAuthenticated = true;
  // this.authChange.next(true);
  // this.router.navigate(['/training']);
  // }

}
