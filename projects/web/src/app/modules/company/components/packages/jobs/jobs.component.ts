import {Component, OnInit} from '@angular/core';
import {PackagesService} from '../../../../../../../../common/includes/services/employer/packages.service';
import {Package} from '../../../../../../../../common/includes/models/employer/package';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  submitAttempt = false;
  isLoading = false;
  public packageList: Array<Package> = [];
  packageType: {id: number; description: string} = {} as {id: number; description: string};
  public quantity = 0;

  orderForm: FormGroup | any;
  items: FormArray | undefined;

  constructor(
    private spinner: SpinnerService,
    public ps: PackagesService,
    private formBuilder: FormBuilder,
    public router: Router,
    public ts: ToastService) {

  }

  ngOnInit(): void {
    this.spinner.show('jobs_spinner');

    this.orderForm = this.formBuilder.group({
      total_payable: this.formBuilder.array([]),
      items: this.formBuilder.array([])
    });


    this.ps.initiate().then(res => {
      res.data.package_groups.forEach((data: any) => {
        data.packages.forEach((packageSingle: any) => {
          if (packageSingle) {
            this.items = this.orderForm.get('items') as FormArray;
            this.items.push(this.createItem({
              package_group_id: packageSingle.package_group_id,
              package_id: packageSingle.id,
              package_detail_id: packageSingle.details[0].id,
              quantity: 0,
              unit_price: packageSingle.details[0].price,
              sub_total: 0
            }));
          }
        });
      });
      this.packageList = res.data.package_groups;
      this.packageType = res.data.package_type;
    }).finally(() => {
      this.spinner.hide('jobs_spinner');
    });
  }

  createItem(value?: any): FormGroup {
    return this.formBuilder.group({
      package_group_id: value ? value.package_group_id : '',
      package_id: value ? value.package_id : '',
      package_detail_id: value ? value.package_detail_id : '',
      quantity: value ? value.quantity : 0,
      unit_price: value ? value.unit_price : 0,
      sub_total: value ? value.sub_total : 0,
    });
  }

  incrementQty(index: any): void {
    let qty = this.orderForm.get('items').value[index].quantity;
    this.orderForm.controls.items.controls[index].controls.quantity.patchValue(qty < 0 ? 0 : ++qty);
    this.getNetPrice(index);
  }

  updateQty(index: any): void {
    const qty = this.orderForm.get('items').value[index].quantity;
    this.orderForm.controls.items.controls[index].controls.quantity.patchValue(qty);
    this.getNetPrice(index);
  }

  decrementQty(index: any): void {
    let qty = this.orderForm.get('items').value[index].quantity;
    this.orderForm.controls.items.controls[index].controls.quantity.patchValue(qty > 0 ? --qty : 0);
    this.getNetPrice(index);
  }

  // Get Individual unit price wise net price
  getNetPrice(index: number): void {
    this.orderForm.controls.items.controls[index].controls.sub_total.setValue(
      Number(this.orderForm.get('items').value[index].quantity) * Number(this.orderForm.get('items').value[index].unit_price));
  }

  getControlIndex(id: number): number {
    return this.orderForm.get('items').value.findIndex((x: { package_id: number; }) => x.package_id === id);
  }

  getSubTotal(id: number): number {
    let total = 0;
    const result = this.orderForm.get('items').value.filter((x: { package_group_id: any; }) => x.package_group_id === id);
    result.forEach((val: any) => {
      total += val.sub_total;
    });
    return total;
  }

  getVat(id: number): number {
    return Math.round(this.getSubTotal(id) * 0.05);
  }

  totalPayable(id: number): number {
    return this.getSubTotal(id) + this.getVat(id);
  }

  submit(id: number): void {
    this.submitAttempt = true;
    this.spinner.show('place_order_btn_spinner');

    const form = this.orderForm.get('items').value.filter((x: {
      quantity: number;
      package_group_id: any;
    }) => x.package_group_id === id && x.quantity > 0);
    this.ps.subscribePackage(form).then(res => {
      if (res.success) {
        this.ts.show('success', 'Subscribed package successfully!');
      }
    }).finally(() => {
      this.submitAttempt = false;
      this.spinner.hide('place_order_btn_spinner');
      this.router.navigate(['/company/subscribe']);
    });
  }
}
