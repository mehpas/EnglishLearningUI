import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { EnglishLearningComponent } from './EnglishLearning/english-learning.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'english-learning', component: EnglishLearningComponent }
];
