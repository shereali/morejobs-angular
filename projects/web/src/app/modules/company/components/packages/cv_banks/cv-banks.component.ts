import {Component, OnInit} from '@angular/core';
import {PackagesService} from '../../../../../../../../common/includes/services/employer/packages.service';
import {Package} from '../../../../../../../../common/includes/models/employer/package';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterParams} from '../../../../../../../../common/includes/utilities/filterParams';

@Component({
  selector: 'app-cv-banks',
  templateUrl: './cv-banks.component.html',
  styleUrls: ['./cv-banks.component.scss'],
})

export class CVBanksComponent implements OnInit {
  submitAttempt = false;
  isLoading = false;
  defaultActiveTab = 0;
  packageTypeId: string | null = '0';
  public packageList: Array<Package> = [];
  public packageDetails: Array<{ id: number; quantity_to: number }> = [];
  packageType: { id: number; description: string } = {} as { id: number; description: string };
  monthRange: Array<number> = [];
  public quantity = 1;

  orderForm: FormGroup | any;
  items: FormArray | undefined;

  filterParams = new FilterParams();

  constructor(
    private spinner: SpinnerService,
    public ps: PackagesService,
    private formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public ts: ToastService) {
  }

  ngOnInit(): void {
    this.spinner.show('cv_banks_spinner');
    this.packageTypeId = this.route.snapshot.queryParamMap.get('package_type_id');

    this.orderForm = this.formBuilder.group({
      total_payable: this.formBuilder.array([]),
      items: this.formBuilder.array([])
    });


    this.ps.initiate(this.packageTypeId).then(res => {
      res.data.package_groups.forEach((data: any) => {
        data.packages.forEach((packageSingle: any) => {
          if (packageSingle) {
            if (this.defaultActiveTab === 0) {
              this.defaultActiveTab = packageSingle.package_group_id;
            }

            this.generateMonthRange(packageSingle.details);

            const [firstDuration] = this.monthRange;
            const filteredPackageDetail = packageSingle.details.filter((item: any) => item.duration === firstDuration);
            packageSingle.filtered_details = filteredPackageDetail;

            this.items = this.orderForm.get('items') as FormArray;
            this.items.push(this.createItem({
              package_group_id: packageSingle.package_group_id,
              package_id: packageSingle.id,
              package_detail_id: 0,
              quantity: 1,
              unit_price: 0,
              sub_total: 0
            }));
          }
        });
      });

      this.packageList = res.data.package_groups;
      this.packageType = res.data.package_type;
    }).finally(() => {
      this.spinner.hide('cv_banks_spinner');
    });
  }

  generateMonthRange(packageDetails: any): void {
    const durationArray = [];
    for (const item of packageDetails) {
      if (item) {
        durationArray.push(item.duration);
      }
    }

    this.monthRange = [...new Set(durationArray)].sort((one, two) => (one > two ? 1 : -1));
  }

  filterPackageDetailsBasedDuration(event: any): void {
    const selectedDuration = event.target.value;

    this.packageList.forEach((data: any) => {
      data.packages.forEach((packageSingle: any) => {
        if (packageSingle) {
          const filteredPackageDetail = packageSingle.details.filter((item: any) => item.duration === +selectedDuration);
          packageSingle.filtered_details = filteredPackageDetail;

          const controlIndex = this.getControlIndex(packageSingle.id);

          this.orderForm.controls.items.controls[controlIndex].controls.unit_price.patchValue(0);
          this.orderForm.controls.items.controls[controlIndex].controls.package_detail_id.patchValue(0);
          this.getNetPrice(controlIndex);
        }
      });
    });
  }

  updatePrice(packageId: number, event: any, packageDetails: any): void {
    const controlIndex = this.getControlIndex(packageId);
    const selectedPackageDetail = +event.target.value;
    const packageDetailList = packageDetails.filtered_details;
    const unitPrice = packageDetailList.find((x: any) => x.id === selectedPackageDetail)?.price || 0;

    this.orderForm.controls.items.controls[controlIndex].controls.unit_price.patchValue(unitPrice);
    this.getNetPrice(controlIndex);
  }

  createItem(value?: any): FormGroup {
    return this.formBuilder.group({
      package_group_id: value ? value.package_group_id : '',
      package_id: value ? value.package_id : '',
      package_detail_id: value ? value.package_detail_id : '',
      quantity: value ? value.quantity : 1,
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
