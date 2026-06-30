import { Routes } from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { UserManagementComponent } from './UserManagement/user-management.component';
import { EnglishLearningLayoutComponent } from './EnglishLearning/english-learning-layout.component';
import { EnglishStudiesComponent } from './EnglishLearning/english-studies.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'english-learning',
    component: EnglishLearningLayoutComponent,
    children: [
      { path: '', redirectTo: 'english-studies', pathMatch: 'full' },
      { path: 'english-studies', component: EnglishStudiesComponent },
      { path: 'user-management', component: UserManagementComponent }
    ]
  }
];
