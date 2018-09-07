import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Software } from '../interfaces/software.interface';

@Injectable({
  providedIn: 'root'
})
export class SoftwareService {

  private softwareList: Software[] = [];
  private software: Observable<any[]>;

  constructor(db: AngularFirestore) {

    this.software = db.collection('SOFTWARE').valueChanges();

    this.software.subscribe(software => {
      software.forEach(soft =>  {
        this.softwareList.push(soft);
      });
    });
  }

  getSoftware() {
    return this.softwareList;
  }
}
