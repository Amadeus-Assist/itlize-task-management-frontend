import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { TasksComponent } from './tasks/tasks.component';
import { canActivateTasks } from './shared/authguard/can-activate-tasks.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'tasks', component: MainComponent, canActivate: [canActivateTasks],
    children: [
      { path: '', component: TasksComponent },
      { path: ':id', component: DetailComponent }
    ]
  },
  {path: 'error', component: ErrorComponent},
  { path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
