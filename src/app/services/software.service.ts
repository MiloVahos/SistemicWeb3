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
        let flag = 0;
        for ( let i = 0; i < this.softwareList.length; i++ ) {
          if ( this.softwareList[i].id === soft.id ) {
            flag++;
          }
        }
        if ( flag === 0 ) {
          this.softwareList.push(soft);
        }
      });
    });
  }

  getSoftware() {
    return this.softwareList;
  }
}
