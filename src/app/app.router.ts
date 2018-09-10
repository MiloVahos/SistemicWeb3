import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddBookComponent } from './components/add/add-book/add-book.component';
import { AddAuthorComponent } from './components/add/add-author/add-author.component';
import { AddChapterComponent } from './components/add/add-chapter/add-chapter.component';
import { AddJournalComponent } from './components/add/add-journal/add-journal.component';
import { AddConferenceComponent } from './components/add/add-conference/add-conference.component';
import { AddThesisComponent } from './components/add/add-thesis/add-thesis.component';
import { AddSoftwareComponent } from './components/add/add-software/add-software.component';
import { AddPrototypeComponent } from './components/add/add-prototype/add-prototype.component';

const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'addAuthor', component: AddAuthorComponent },
    { path: 'addBook', component: AddBookComponent },
    { path: 'addChapter', component: AddChapterComponent },
    { path: 'addJournal', component: AddJournalComponent },
    { path: 'addConference', component: AddConferenceComponent },
    { path: 'addThesis', component: AddThesisComponent },
    { path: 'addSoftware', component: AddSoftwareComponent },
    { path: 'addPrototype', component: AddPrototypeComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });

