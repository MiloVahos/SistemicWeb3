import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent {

  chapters: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.chapters = db.collection('CHAPTERS').valueChanges();
  }

}
