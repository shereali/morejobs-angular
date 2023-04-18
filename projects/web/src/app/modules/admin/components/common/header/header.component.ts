import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../../../../../common/includes/services/auth.service';
import {Router} from '@angular/router';
import {environment} from '../../../../../../../../common/src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public apiUrl = environment.apiUrl;
  constructor(
    private as: AuthService,
    public router: Router,
  ) {
  }

  ngOnInit() {
  }

  logout(): void {
    this.as.logOut().then(res => {
      if (res.success) {
        this.router.navigate(['/login']).then();
      }
    });
  }

}
