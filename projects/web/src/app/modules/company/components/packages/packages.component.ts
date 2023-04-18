import {Component, OnInit} from '@angular/core';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {PackagesService} from '../../../../../../../common/includes/services/employer/packages.service';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent implements OnInit {
  packageTypes: Array<{ id: number; title: string; frontend_url: string }> = [];
  isLoading = true;

  constructor(
    public router: Router,
    private spinner: SpinnerService,
    public pt: PackagesService,
    public ts: ToastService
  ) {
  }

  ngOnInit(): void {
    this.initiatePackageTypes();
  }

  initiatePackageTypes(): void {
    this.spinner.show('package_type_spinner');
    this.pt.initiatePackageTypes().then(res => {
      if (res.success) {
        this.packageTypes = res.data;
      } else {
        this.ts.apiMessage(res);
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('package_type_spinner');
    });
  }

  isLinkActive(url: string): boolean {
    const queryParamsIndex = this.router.url.indexOf('?');
    const baseUrl = queryParamsIndex === -1 ? this.router.url : this.router.url.slice(0, queryParamsIndex);
    return baseUrl.includes(url);
  }

}
