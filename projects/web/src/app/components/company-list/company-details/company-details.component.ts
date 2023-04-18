import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AvailableJobModel, UnfollowedCompanyModel} from '../../../../../../common/includes/models/following-company';
import {UnfollowedCompanyService} from '../../../../../../common/includes/services/unfollowed-company.service';
import {FollowingCompanyService} from '../../../../../../common/includes/services/following-company.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent implements OnInit {
  isLoading = true;
  isFollowed = false;
  openFrom: string | undefined = 'employee_list';

  availableJobs: Array<AvailableJobModel> = [];

  constructor(
    private fs: FollowingCompanyService,
    private ufs: UnfollowedCompanyService,
    public dialogRef: MatDialogRef<CompanyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UnfollowedCompanyModel
  ) {
    this.openFrom = data.open_from;
  }

  ngOnInit(): void {
    this.ufs.companyAvailableJobs(this.data.id)
      .then((res) => {
        if (res.success) {
          this.availableJobs = res.data.available_jobs;
          this.isFollowed = res.data.is_followed;
        }
      }).finally(() => {
      this.isLoading = false;
    });
  }

  unfollow(): void {
    this.fs.unfollowCompany(this.data.id)
      .then((res) => {
        if (res.success) {
          this.isFollowed = false;
          // this.handleResponse(res);
        }
      }).finally(() => {
      // this.followingCompanies.splice(index, 1);
      // this.pagination.total -= 1;
    });
  }

  follow(): void {
    this.fs.followCompany(this.data.id)
      .then((res) => {
        if (res.success) {
          this.isFollowed = true;
          // this.handleResponse(res);
        }
      }).finally(() => {
      // this.followingCompanies.splice(index, 1);
      // this.pagination.total -= 1;
    });
  }

  closeModal(response = ''): void {
    if (this.openFrom === 'employee_list') {
      this.dialogRef.close(response);
    } else {
      this.dialogRef.close(true);
    }
  }
}
