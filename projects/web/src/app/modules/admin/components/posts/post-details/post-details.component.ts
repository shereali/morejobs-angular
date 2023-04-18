import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {PostModel} from '../../../../../../../../common/includes/models/admin/post';
import {PostsService} from '../../../../../../../../common/includes/services/admin/posts.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailsComponent implements OnInit {
  isLoading = true;

  post: PostModel | any = {};

  constructor(
    private ts: ToastService,
    private spinner: SpinnerService,
    private ps: PostsService,
    public dialogRef: MatDialogRef<PostDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PostModel) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.spinner.show('post_details_spinner');
    this.ps.loadPost(this.data.id).then((res) => {
      if (res.success) {
        this.post = res.data;
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('post_details_spinner');
    });
  }

  closeModal(response = ''): void {
    this.dialogRef.close(response);
  }
}
