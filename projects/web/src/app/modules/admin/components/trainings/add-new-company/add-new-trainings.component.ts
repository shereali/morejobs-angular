import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {TrainingModel} from '../../../../../../../../common/includes/models/admin/training';
import {
  DAY_RANGE,
  HOUR_RANGE,
  MONTH_RANGE,
  YEAR_RANGE_TRAINING
} from '../../../../../../../../common/includes/utilities/staticValue';
import {TrainingsService} from '../../../../../../../../common/includes/services/admin/trainings.service';
import {IDropdownSettings} from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-new-training',
  templateUrl: './add-new-trainings.component.html',
  styleUrls: ['./add-new-trainings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewTrainingsComponent implements OnInit {
  yearRange: Array<number> = YEAR_RANGE_TRAINING;
  monthRange: Array<{ id: number; title: string }> = MONTH_RANGE;
  dayRange: Array<number> = DAY_RANGE;
  hourRange: Array<number> = HOUR_RANGE;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  myForm: FormGroup = {} as FormGroup;
  submitAttempt = false;
  isLoading = true;
  mode = 'create';

  initialData: {
    trainers: Array<{ id: number; first_name: string; last_name: string }>,
    training_types: Array<{ id: number; title: string }>,
    training_categories: Array<{ id: number; title: string }>,
  } = {
    trainers: [],
    training_types: [],
    training_categories: [],
  };

  constructor(
    public fb: FormBuilder,
    private ts: ToastService,
    private spinner: SpinnerService,
    private trs: TrainingsService,
    public dialogRef: MatDialogRef<AddNewTrainingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrainingModel) {
    if (data) {
      this.mode = 'edit';
    }
    this.prepareForm(data);
  }

  ngOnInit(): void {
    this.spinner.show('create_training_spinner');
    this.trs.initiateSave().then((res: any) => {
      if (res.success) {
        this.initialData = res.data;
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('create_training_spinner');
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('training_save_btn_spinner');

      this.trs.save(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('training_save_btn_spinner');
      });
    }
  }


  private prepareForm(data: TrainingModel | undefined): void {
    this.myForm = this.fb.group({
      title: new FormControl('', Validators.required),
      duration_year: new FormControl(null),
      duration_month: new FormControl(null),
      duration_day: new FormControl(null),
      duration_hour: new FormControl(null),
      start_date: new FormControl(null, Validators.required),
      end_date: new FormControl(null, Validators.required),
      class_schedule: new FormControl(null),
      class_timetable: new FormControl(null),
      no_of_sessions: new FormControl(null),
      venue: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      deadline: new FormControl(null, Validators.required),
      who_can_attend: new FormControl(null),
      details: new FormControl(null),
      training_type_id: new FormControl(null, Validators.required),
      trainer_id: new FormControl(null, Validators.required),
      training_categories: new FormControl([], Validators.required),

      id: new FormControl(null),
    });

    if (data) {
      this.myForm.get('title')?.setValue(data.title);
      this.myForm.get('duration_year')?.setValue(data.duration_year);
      this.myForm.get('duration_month')?.setValue(data.duration_month);
      this.myForm.get('duration_day')?.setValue(data.duration_day);
      this.myForm.get('duration_hour')?.setValue(data.duration_hour);
      this.myForm.get('start_date')?.setValue(data.start_date);
      this.myForm.get('end_date')?.setValue(data.end_date);
      this.myForm.get('class_schedule')?.setValue(data.class_schedule);
      this.myForm.get('class_timetable')?.setValue(data.class_timetable);
      this.myForm.get('no_of_sessions')?.setValue(data.no_of_sessions);
      this.myForm.get('venue')?.setValue(data.venue);
      this.myForm.get('price')?.setValue(data.price);
      this.myForm.get('deadline')?.setValue(data.deadline);
      this.myForm.get('who_can_attend')?.setValue(data.who_can_attend);
      this.myForm.get('details')?.setValue(data.details);
      this.myForm.get('training_type_id')?.setValue(data.training_type_id);
      this.myForm.get('trainer_id')?.setValue(data.trainer_id);
      this.myForm.get('training_categories')?.setValue(data.course_categories);

      this.myForm.get('id')?.setValue(data.id);
    }
  }

  closeModal(response = ''): void {
    this.dialogRef.close(response);
  }

  get industryTypeIdControl(): FormControl {
    return this.myForm.get('industry_type_id') as FormControl;
  }

  get _selectedIndustryTypes(): FormControl {
    return this.myForm.get('selected_industry_types') as FormControl;
  }
}
