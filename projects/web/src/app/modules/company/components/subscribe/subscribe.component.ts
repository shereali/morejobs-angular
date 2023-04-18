import { Component, OnInit } from '@angular/core';
import { Package } from 'projects/common/includes/models/employer/package';
import { PackagesService } from 'projects/common/includes/services/employer/packages.service';
import {SubscribedPackage} from '../../../../../../../common/includes/models/employer/subscribed-package';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
})
export class SubscribeComponent implements OnInit {
  public packageList: Array<SubscribedPackage> = [];

  constructor(public ps: PackagesService, public toast: ToastService) { }
  ngOnInit(): void {
    this.getPackageList();
  }
  getPackageList(): void {
    this.ps.subscribedList().then(res => {
      this.packageList = res.data;
    });
  }
  cancelSubscription(id: number): void{
    this.ps.cancelSubscription({id}).then(res => {
      if (res.success){
        this.toast.success('Successfully Cancelled');
        this.getPackageList();
      }else{
        this.toast.success('You can not cancel the subscription now.');
      }
    });
  }

}
