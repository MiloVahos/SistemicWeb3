import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.css']
})
export class SoftwareComponent {

  softwares: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.softwares = db.collection('SOFTWARE').valueChanges();
  }

}
