import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
} from '@angular/material/snack-bar';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
// import { default as _rollupMoment } from 'moment';
import { StorageService } from '../services/storage.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ModalService } from '../services/modal.service';
import { Router } from '@angular/router';
// const moment = _rollupMoment || _moment;
import { DataService } from '../services/data.service';


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
  template: 'passed in {{ editCompanyDetails }}',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
    { provide: MatDialogRef, useValue: [] },
  ],
})
export class AddCompanyComponent implements OnInit {
  public formData: FormGroup;
  // date = new FormControl(moment());
  message = 'Form Data Saved Successfully';
  action = 'Done';
  colorControl = new FormControl('primary' as ThemePalette);
  maxDate = new Date();
  companyFormData: string[] = [];
  newEmployee = false;

  @ViewChild('pickerr') datePickerElement = MatDatepicker;
  skillArr = [
    'Java',
    'Angular',
    'CSS',
    'HTML',
    'Javascript',
    'UI',
    'SQL',
    'React',
    'PHP',
    'Git',
    'AWS',
    'Python',
    'Django',
    'C',
    'C++',
    'C#',
    'Unity',
    'R',
    'AI',
    'NLP',
    'Photoshop',
    'Nodejs',
  ];

  designationArr = [
    'Developer',
    'Manager',
    'System Admin',
    'Team Lead',
    'PM',
    'Cloud Specialist',
  ];

  employeesInfoGroup: any = [];
  empSkillInfo: any = [];
  empEduInfo: any = [];
  formSubmit = false;

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private storageservice: StorageService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    private modalservice: ModalService,
    private router: Router,
    private dataService: DataService,
    @Optional() @Inject(MAT_DIALOG_DATA) public editCompanyDetails: any
  ) {
    this.formData = this.fb.group({
      companyName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        this.noWhitespaceValidator
      ]),
      address: new FormControl(''),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.email,
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(15),
        Validators.pattern('[1-9][0-9]{9,14}'),
      ]),
      createdAt: new FormControl(new Date()),
      empInfo: new FormArray([]),
    });
  }
  ngOnInit(): void {
    if (
      this.editCompanyDetails &&
      Object.keys(this.editCompanyDetails)?.length > 0
    ) {
      this.formSubmit = true;
      for (let i = 0; i < this.editCompanyDetails['empInfo'].length; i++) {
        this.employeesInfoGroup.push(this.editCompanyDetails['empInfo'][i]);
      }

      for (let i = 0; i < this.editCompanyDetails['empInfo'].length; i++) {
        this.empSkillInfo.push(
          this.editCompanyDetails['empInfo'][i]['skillInfo']
        );
      }
      for (let i = 0; i < this.editCompanyDetails['empInfo'].length; i++) {
        this.empEduInfo.push(
          this.editCompanyDetails['empInfo'][i]['educationInfo']
        );
      }
    }
    this.loadEmployee();
    this.employeesInfo();
    if (
      this.editCompanyDetails &&
      Object.keys(this.editCompanyDetails)?.length
    ) {
      this.formData.controls['companyName'].setValue(
        this.editCompanyDetails.companyName
      );
      this.setValues();
    }
  }
  // errorHandler(empIndex: any, error: any) {
  //   return this.employeesInfo().controls[empIndex].get('empName')?.touched && this.employeesInfo().controls[empIndex].get('empName')?.errors && this.employeesInfo().controls[empIndex].get('empName')?.hasError(error)
  // }
  setValues() {
    this.formData.controls['companyName'].setValue(
      this.editCompanyDetails.companyName
    );
    this.formData.controls['address'].setValue(this.editCompanyDetails.address);
    this.formData.controls['email'].setValue(this.editCompanyDetails.email);
    this.formData.controls['phone'].setValue(this.editCompanyDetails.phone);
    this.formData.controls['createdAt'].setValue(
      this.editCompanyDetails.createdAt
    );
    this.formData.controls['empInfo'].patchValue(
      this.editCompanyDetails.empInfo
    );
  }
  private employeeInfoGroup(): any {
    if (
      this.editCompanyDetails &&
      Object.keys(this.editCompanyDetails)?.length > 0
    ) {
      this.employeesInfoGroup = this.editCompanyDetails['empInfo'];
    }
    if (this.employeesInfoGroup.length > 0) {
      let newEmployeeInfoFormGroup = this.employeesInfoGroup.map(
        (empInfo: any, index: any) => {
          let formGroup = new FormGroup({
            empName: new FormControl('', [
              Validators.required,
              Validators.maxLength(25),
            ]),
            designation: new FormControl(this.designationArr[0]),
            joiningDate: new FormControl('', [Validators.required]),
            empEmail: new FormControl('', [
              Validators.required,
              Validators.maxLength(100),
              Validators.email,
            ]),
            empPhone: new FormControl('', [
              Validators.required,
              Validators.minLength(10),
              Validators.maxLength(15),
              Validators.pattern('[1-9][0-9]{9,14}'),
            ]),
            skillInfo: new FormArray([...this.skillInfoGroup(index)]),
            educationInfo: new FormArray([...this.educationInfoGroup(index)]),
          });
          return formGroup;
        }
      );
      return newEmployeeInfoFormGroup;
    } else {
      [
        new FormGroup({
          empName: new FormControl('', [
            Validators.required,
            Validators.maxLength(25),
          ]),
          designation: new FormControl(this.designationArr[0]),
          joiningDate: new FormControl('', [Validators.required]),
          empEmail: new FormControl('', [
            Validators.required,
            Validators.maxLength(100),
            Validators.email,
          ]),
          empPhone: new FormControl('', [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(15),
            Validators.pattern('[1-9][0-9]{9,14}'),
          ]),
          skillInfo: new FormArray([...this.skillInfoGroup()]),
          educationInfo: new FormArray([...this.educationInfoGroup()]),
        }),
      ];
    }
  }

  private skillInfoGroup(index = 0): any {
    if (this.empSkillInfo.length > 0) {
      let newSkillFormGroup = this.empSkillInfo[index].map((empSkill: any) => {
        let formGroup = new FormGroup({
          skillName: new FormControl(this.skillArr[0], [Validators.required]),
          skillRating: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.max(5),
            Validators.min(1),
          ]),
        });
        return formGroup;
      });
      return newSkillFormGroup;
    } else {
      return [
        new FormGroup({
          skillName: new FormControl(this.skillArr[0], [Validators.required]),
          skillRating: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.max(5),
            Validators.min(1),
          ]),
        }),
      ];
    }
  }

  private educationInfoGroup(index = 0): any {
    if (this.empEduInfo.length > 0) {
      let newEduFormGroup = this.empEduInfo[index].map((empEdu: any) => {
        let formGroup = new FormGroup({
          instituteName: new FormControl('', [
            Validators.required,
            Validators.maxLength(50),
          ]),
          course: new FormControl('', [
            Validators.required,
            Validators.maxLength(25),
          ]),
          graduationYear: new FormControl('', [Validators.required]),
        });
        return formGroup;
      });
      return newEduFormGroup;
    } else {
      return [
        new FormGroup({
          instituteName: new FormControl('', [
            Validators.required,
            Validators.maxLength(50),
          ]),
          course: new FormControl('', [
            Validators.required,
            Validators.maxLength(25),
          ]),
          graduationYear: new FormControl('', [Validators.required]),
        }),
      ];
    }
  }

  loadEmployee() {
    let empGroup: any = [];
    let isEmpGroup = this.employeeInfoGroup();
    if (isEmpGroup) {
      empGroup = [...isEmpGroup];
    }

    if (empGroup.length === 0) {
      this.addEmployee();
    } else {
      empGroup.map((emp: any, index: any) => {
        this.employeesInfo().push(emp);
      });
    }
  }

  addEmployee() {
    this.empSkillInfo = [];
    this.empEduInfo = [];
    this.employeesInfo().push(
      new FormGroup({
        empName: new FormControl('', [
          Validators.required,
          Validators.maxLength(25),
        ]),
        designation: new FormControl(this.designationArr[0]),
        joiningDate: new FormControl('', [Validators.required]),
        empEmail: new FormControl('', [
          Validators.required,
          Validators.maxLength(100),
          Validators.email,
        ]),
        empPhone: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(15),
          Validators.pattern('[1-9][0-9]{9,14}'),
        ]),
        skillInfo: new FormArray([...this.skillInfoGroup()]),
        educationInfo: new FormArray([...this.educationInfoGroup()]),
      })
    );
  }

  removeEmployee(empIndex: number) {
    this.employeesInfo().removeAt(empIndex);
  }

  employeesInfo(): FormArray {
    return this.formData.get('empInfo') as FormArray;
  }

  employeeSkills(empIndex: number): FormArray {
    return this.employeesInfo().at(empIndex).get('skillInfo') as FormArray;
  }

  employeeeEducation(empIndex: number): FormArray {
    return this.employeesInfo().at(empIndex).get('educationInfo') as FormArray;
  }

  addEmployeeSkill(empIndex: number) {
    this.employeeSkills(empIndex).push(
      new FormGroup({
        skillName: new FormControl(this.skillArr[0], [Validators.required]),
        skillRating: new FormControl('', [
          Validators.required,
          Validators.minLength(1),
          Validators.max(5),
          Validators.min(1),
        ]),
      })
    );
  }

  addEmployeeEdu(empIndex: number) {
    this.employeeeEducation(empIndex).push(
      new FormGroup({
        instituteName: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
        ]),
        course: new FormControl('', [
          Validators.required,
          Validators.maxLength(25),
        ]),
        graduationYear: new FormControl('', [Validators.required]),
      })
    );
  }

  removeEmployeeSkill(empIndex: number, skillIndex: number) {
    this.employeeSkills(empIndex).removeAt(skillIndex);
  }

  removeEmployeeEdu(empIndex: number, eduIndex: number) {
    this.employeeeEducation(empIndex).removeAt(eduIndex);
  }

  onSubmit() {
    this.companyFormData = this.storageservice.getData('formData');
    this.companyFormData.push(this.formData.value);
    this.storageservice.saveData('formData', this.companyFormData);
    if (!this.formSubmit) {
      this.router.navigate(['/home']);
    } else if (this.formSubmit) {
      this.onFormSubmit();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onFormSubmit() {
    if (this.formSubmit) {
      this.dialog.closeAll();
      this.modalservice.onModalClose(true);
    }
  }

  onFormCancel() {
    this.dialog.closeAll();
    this.modalservice.onModalClose(false);
  }
}
