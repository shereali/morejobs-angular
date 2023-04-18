import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../../../common/includes/models/user';
import {AuthService} from '../../../../../../common/includes/services/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../../common/includes/services/toast.service';
import {environment} from '../../../../../../common/src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isPublic = false;
  apiUrl = environment.apiUrl;
  avatarUrl = 'assets/images/avatar.png';

  public user: User | undefined = undefined;

  constructor(
    private as: AuthService,
    public router: Router,
    public alert: ToastService) {
    this.user = this.as.getUser();

    if (this.user && this.user.image) {
      this.avatarUrl = this.apiUrl + '/' + this.user.image;
    }
  }

  ngOnInit(): void {

  }

  logout(): void {
    this.as.logOut().then(res => {
      if (res.success) {
        this.as.clearStorageForLogout();
        this.router.navigate(['/login']).then();
      }
    });
  }

  isEmptyObject(obj: any): boolean {
    if (Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }
}
