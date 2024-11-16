import { Routes } from '@angular/router';
import { LoginComponent } from './dashboard/authenticationforms/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './dashboard/authenticationforms/register/register.component';
import { ForgotpasswordComponent } from './dashboard/authenticationforms/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './dashboard/authenticationforms/resetpassword/resetpassword.component';
import { ConfirmEmailComponent } from './dashboard/authenticationforms/confirm-email/confirm-email.component';
import { ImprintComponent } from './guidelines/imprint/imprint.component';
import { PrivacyPolicyComponent } from './guidelines/privacy-policy/privacy-policy.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: RegisterComponent,
    },
    {
        path: 'forgotpassword',
        component: ForgotpasswordComponent,
    },
    {
        path: 'resetpassword',
        component: ResetpasswordComponent,
    },
    {
        path: 'confirm_email',
        component: ConfirmEmailComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],  // Only accessible when the user is logged in
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
    },
    {
        path: 'imprint',
        component: ImprintComponent,
    },
];
