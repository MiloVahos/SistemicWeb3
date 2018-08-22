import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Author } from '../../../interfaces/author.interface';


@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html'
})
export class AddAuthorComponent {

  success: boolean;
  danger: boolean;

  author: Object = {
    name: null,
    email: null,
    membership: null,
    availability: false
  };

  membershipTypes = [{ type: 'Professor' },
                     { type: 'Undergraduate Student' },
                     { type: 'Master Student' },
                     { type: 'PhD Student' },
                     { type: 'Research Assitant' },
                     { type: 'External Researcher' }];

  AuthorsColRef: AngularFirestoreCollection<Author>;

  constructor(private afs: AngularFirestore) {

    this.AuthorsColRef = this.afs.collection<Author>('AUTHORS');

  }

  guardar(forma: NgForm) {
    if ( forma.value.email != null ) {
      this.AuthorsColRef.doc(forma.value.name).set({
                  name: forma.value.name,
                  membership: forma.value.membership,
                  availability: forma.value.availability,
                  email: forma.value.email
                }).then(function(docRef) {
                  forma.reset();
                });
    } else {
      this.AuthorsColRef.doc(forma.value.name).set({
                  name: forma.value.name,
                  membership: forma.value.membership,
                  availability: forma.value.availability
                }).then(function(docRef) {
                  forma.reset();
                });
    }

  }
}
