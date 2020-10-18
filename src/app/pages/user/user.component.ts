/*

  Added by Javier Romero
  This is the create/edit user page for the admin portal
  (admin/user, which differs from admin/users, which is the list all users page).
  From here, the admin will create users or edit existing ones.
  Users can also be deleted from the databases from here.

*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogPopupComponent } from 'src/app/components/error-dialog-popup/error-dialog-popup.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ParentService } from 'src/app/services/parent/parent-service';
import { ClinicianService } from 'src/app/services/clinician/clinician-service';
import { FFQClinicianResponse } from 'src/app/models/ffqclinician-response';
import { FFQParent } from 'src/app/models/ffqparent';
import { FFQClinician } from 'src/app/models/ffqclinician';
import { FFQParentResponse } from 'src/app/models/ffqparent-response';
import { FFQClinicResponse } from 'src/app/models/ffqclinic-response';
import { ClinicService } from 'src/app/services/clinic/clinic-service';
import { FFQClinic } from 'src/app/models/ffqclinic';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeletePopupComponent } from "src/app/components/delete-popup/delete-popup.component";

@Component({
  selector: 'app-fooditem',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  TITLE = 'FFQR Food Item Portal';
  private routeSub: Subscription;
  private isNew: boolean;
  private isUpdate: boolean;
  private createParents: boolean;
  private createClinician: boolean;
  private createResearcher: boolean;
  showMsg: boolean = false;
  selectedClinic: string;

  constructor(
    public parentService: ParentService,
    public clinicianService: ClinicianService,
    private errorDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public clinicService: ClinicService,
    private modalService: NgbModal

    ) { }

  userAttributes: object;
  dataLoaded: Promise<boolean>;

  ffqclinician: FFQClinician;
  ffqParent: FFQParent;
  amountToAdd: number;
  isParent: boolean;
  isClinician: boolean;
  isProcessing: boolean;

  public ffqclinicList: FFQClinic[] = [];
  clinicNames: string[] = [];
  clinicIds: Map<string, string> = new Map<string, string>();


  ngOnInit() {

    this.isProcessing = false;
    this.createParents = false;
    this.createClinician = false;
    this.createResearcher = false;
    this.isParent = false;
    this.isClinician = false;
    this.clinicNames.push("");

    const UserType = this.route.snapshot.paramMap.get('type');
    const UserID = this.route.snapshot.paramMap.get('id');

    if (UserID == "new")
    {
      this.isNew = true;
      this.dataLoaded = Promise.resolve(true);
    }
    else
    {
      this.isUpdate = true;
      if(UserType == "p")
      {
        this.getParentByID(UserID);
      }
      else
      {
        this.getClinicianByID(UserID);
      }
    }

    var clinicListObservable: Observable<FFQClinicResponse[]> = this.clinicService.getAllClinics();
    clinicListObservable.subscribe(clinicList => {
      this.ffqclinicList = clinicList;
      clinicList.forEach(clinic => {
        this.clinicIds.set(clinic.clinicname, clinic.clinicId);
        this.clinicNames.push(clinic.clinicname);
      })

    });

  }

  changeToClinician($event)
  {
    this.createClinician = true;
    this.createParents = false;
    this.createResearcher = false;
  }

  changeToParent($event)
  {
    this.createParents = true;
    this.createClinician = false;
    this.createResearcher = false;
  }

  changeToResearcher($event)
  {
    this.createParents = false;
    this.createClinician = false;
    this.createResearcher = true;
  }

  private addUser()
  {

    var input = <HTMLInputElement>document.getElementById("clinician_quantity");
    var amount : number = parseInt(input.value);

     if(this.createClinician == true)
     {
       if(amount <= 1){
        this.addClinician();
       }else{
        console.log("adding multiple clinicians")
        //this.addMultipleClinicians();
        var i = 0;
        while(i < amount){
          if(this.isProcessing == false){
            this.addClinician()
            i++;
          }else{
            amount++;
          }
        }
       }
        
     }
     else if(this.createParents == true)
     {
       if(amount <= 1){
        this.addParent();
       }else{
        console.log("adding multiple clinicians")
        //this.addMultipleParents();
       }
      }
      else
      {
        if(amount <= 1){
          //this.addResearcher();
         }else{
          console.log("adding multiple clinicians")
          //this.addMultipleResearchers();
         }
      }
  }

  addClinician()
  {
    this.isProcessing = true;
    var clinicianList: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();

      clinicianList.subscribe(data => {
        var numberOfClinicians = (data.length+1).toString();
        //console.log("Number of clinicians is: " + numberOfClinicians);
        var newClincianId = (data.length+1).toString();
        var newClincianUsername = "clinician"+numberOfClinicians;
        this.ffqclinician = new FFQClinician(newClincianId, newClincianUsername, newClincianUsername, "clinician", "", "", "", this.selectedClinic, [], true);
        console.log(this.ffqclinician);

        this.clinicianService.addClinician(this.ffqclinician).subscribe(data => {
            this.router.navigateByUrl('/admin/users');
            const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
            dialogRef.componentInstance.title = newClincianUsername + ' was added!';
        },
        error =>{
            const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
            dialogRef.componentInstance.title = error.error.message;
        });

      });
      this.isProcessing = false;
  }

  addMultipleClinicians()
  {
    //Still work in progress

    var clinicianList: Observable<FFQClinicianResponse[]> = this.clinicianService.getAllClinicians();

    var input = <HTMLInputElement>document.getElementById("clinician_quantity");
    var amount : number = parseInt(input.value);

    var new_clinicians = new Array();

      for(let i = 0; i < amount; i++){

        clinicianList.subscribe(data => {
          var numberOfClinicians = (data.length + 1 + i).toString();
          var newClincianId = (data.length+ 1 + i).toString();
          var newClincianUsername = "clinician"+numberOfClinicians;
          new_clinicians.push(new FFQClinician(newClincianId, newClincianUsername, newClincianUsername, "clinician", "", "", "", this.selectedClinic, [], true));
        });

      }

      for(let j = 0; j < amount; j++){

        this.clinicianService.addClinician(new_clinicians[j]).subscribe(data => {
          this.router.navigateByUrl('/admin/users');
        },
        error =>{
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
        });

      }

      const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = amount + ' new clinicians have been added';
  }

  addParent()
  {
    var parentList: Observable<FFQParentResponse[]> = this.parentService.getAllParents();

      parentList.subscribe(data => {
        var numberOfParents = (data.length+1).toString();
        var newParentId = (data.length+1).toString();
        var newParentUsername = "parent"+numberOfParents;
        this.ffqParent = new FFQParent(newParentId, newParentUsername, newParentUsername, "parent", "", "",  this.selectedClinic, "", [""], true);
        console.log(this.ffqParent);

        this.parentService.addParent(this.ffqParent).subscribe(data => {
            this.router.navigateByUrl('/admin/users');
            const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
            dialogRef.componentInstance.title = newParentUsername + ' was added!';
        },
        error =>{
            const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
            dialogRef.componentInstance.title = error.error.message;
        });

      });
  }

  addMultipleParents()
  {
    //Still work in progress

    var parentList: Observable<FFQParentResponse[]> = this.parentService.getAllParents();

    var input = <HTMLInputElement>document.getElementById("parent_quantity");
    var amount : number = parseInt(input.value);

    var new_parents = new Array();

      for(let i = 0; i < amount; i++){

        parentList.subscribe(data => {
          var numberOfParents = (data.length + 1 + i).toString();
          var newParentId = (data.length+ 1 + i).toString();
          var newParentUsername = "parent"+numberOfParents;
          new_parents.push(new FFQParent(newParentId, newParentUsername, newParentUsername, "parent", "", "", "", this.selectedClinic, [], true));
        });

      }

      for(let j = 0; j < amount; j++){

        this.parentService.addParent(new_parents[j]).subscribe(data => {
          this.router.navigateByUrl('/admin/users');
        },
        error =>{
          const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
          dialogRef.componentInstance.title = error.error.message;
        });

      }

      const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
      dialogRef.componentInstance.title = amount + ' new parents have been added';
  }

  getParentByID(id: string)
  {
    this.isParent = true;
    this.parentService.getParent(id).subscribe(data => {
       this.userAttributes = data;
       //this.newParent = data;

    });
    this.dataLoaded = Promise.resolve(true);
  }

  getClinicianByID(id: string)
  {
    this.isClinician = true;
    this.clinicianService.getClinician(id).subscribe(data => {
      this.userAttributes = data;
      //this.newClinician = data;
      //console.log(this.userAttributes);
    });
    this.dataLoaded = Promise.resolve(true);
  }

  updateUser()
  {
    if(this.isParent)
    {
      this.updateParent();
    }
    else
    {
      this.updateClinician();
    }
  }

  updateParent()
  {


    this.parentService.updateParent(<FFQParentResponse>this.userAttributes).subscribe(
     data => {this.router.navigateByUrl('/admin/users');
     const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
     dialogRef.componentInstance.title = 'Parent successfully updated!';}

    );
  }

  updateClinician()
  {


    this.clinicianService.updateClinician(<FFQClinicianResponse>this.userAttributes)
      .subscribe( data => {
        console.log("data is");
        console.log(data);
        this.router.navigateByUrl('/admin/users');
        const dialogRef = this.errorDialog.open(ErrorDialogPopupComponent);
        dialogRef.componentInstance.title = 'Clinician successfully updated!';
      });
  }


  deleteUser(){
    if(this.isParent)
    {
      this.deleteParent();
    }
    else
    {
      this.deleteClinician();
    }
  }

  deleteParent(){
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = "Parent";
    confirmDelete.componentInstance.attributes = this.userAttributes;
  }

  deleteClinician(){
    const confirmDelete = this.modalService.open(DeletePopupComponent);
    confirmDelete.componentInstance.service = "Clinician";
    confirmDelete.componentInstance.attributes = this.userAttributes;
  }
}

