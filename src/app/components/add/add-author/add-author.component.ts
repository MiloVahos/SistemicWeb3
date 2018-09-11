import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Author } from '../../../interfaces/author.interface';
import { Observable } from 'rxjs';
import { timer } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html'
})
export class AddAuthorComponent {

  showSuccess$: Observable<boolean>;
  showError$: Observable<boolean>;

  author: Object = {
    name: '',
    email: '',
    membership: '',
    availability: false
  };

  membershipTypes = [{ type: 'Professor' },
                     { type: 'Undergraduate Student' },
                     { type: 'Master Student' },
                     { type: 'PhD Student' },
                     { type: 'Research Assitant' },
                     { type: 'External Researcher' }];

  AuthorsColRef: AngularFirestoreCollection<Author>;

  constructor(  private afs: AngularFirestore,
                private router: Router,
                private _authS: AuthService
              ) {

    this.AuthorsColRef = this.afs.collection<Author>('AUTHORS');
    if ( !this._authS.isUserEmailLoggedIn ) {
      this.router.navigate(['/']);
    }
  }

  guardar(forma: NgForm) {
    if ( forma.value.email != null ) {
      this.AuthorsColRef.doc(forma.value.name).set({
                  name: forma.value.name,
                  membership: forma.value.membership,
                  availability: forma.value.availability,
                  email: forma.value.email
                }).then((result) => {
                  this.showSuccess$ = timer(200).pipe( map(() => true), share() );
                })
                .catch((err) => {
                  this.showError$ = timer(200).pipe( map(() => true), share() );
                });
    } else {
      this.AuthorsColRef.doc(forma.value.name).set({
                  name: forma.value.name,
                  membership: forma.value.membership,
                  availability: forma.value.availability
                }).then((result) => {
                  this.showSuccess$ = timer(200).pipe( map(() => true), share() );
                })
                .catch((err) => {
                  this.showError$ = timer(200).pipe( map(() => true), share() );
                });
    }
    forma.reset();
  }
}
