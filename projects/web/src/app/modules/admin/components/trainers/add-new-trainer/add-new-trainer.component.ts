import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TrainersService} from '../../../../../../../../common/includes/services/admin/trainers.service';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {TrainerModel} from '../../../../../../../../common/includes/models/admin/trainer';

@Component({
  selector: 'app-add-new-trainer',
  templateUrl: './add-new-trainer.component.html',
  styleUrls: ['./add-new-trainer.component.scss'],
})
export class AddNewTrainerComponent {
  isLoading = true;
  submitAttempt = false;
  mode = 'create';
  myForm: FormGroup = {} as FormGroup;

  initialData: {
    category_types: Array<{ id: number; title_en: string }>,
    tags: Array<{ id: number; title_en: string }>
  } = {
    category_types: [],
    tags: [],
  };

  constructor(
    private trainerService: TrainersService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddNewTrainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrainerModel) {
    if (data) {
      this.mode = 'edit';
    }
    this.prepareForm(data);
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('trainer_save_btn_spinner');
      this.trainerService.save(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('trainer_save_btn_spinner');
      });
    }
  }

  private prepareForm(data: TrainerModel | undefined): void {
    this.myForm = this.fb.group({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
      about: new FormControl('', Validators.required),
      id: new FormControl(null),
    });

    if (data) {
      this.myForm.get('first_name')?.setValue(data.first_name);
      this.myForm.get('last_name')?.setValue(data.last_name);
      this.myForm.get('designation')?.setValue(data.designation);
      this.myForm.get('about')?.setValue(data.about);
      this.myForm.get('id')?.setValue(data.id);
    }
  }

  closeModal(res = ''): any {
    this.dialogRef.close(res);
  }
}
