import { NgModule }             from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { LoginComponent }		from './Login/login.component'
import { TasksComponent }		from './Tasks/tasks.component'
import { ProblemComponent }		from './Problem/problem.component'
import { SubmitComponent }		from './Submit/submit.component'

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'task/all', component: TasksComponent },
	{ path: 'task/:id', component: ProblemComponent },
	{ path: 'task/:id/submit', component: SubmitComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
