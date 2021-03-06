//Classed to store parent user data in components

export class FFQParent {
  id: string;
  userId: string;
  username: string;
  userpassword: string;
  usertype: string;
  firstname: string;
  lastname: string;
  assignedclinic: string;
  assignedclinician: string;
  childrennames: any;
  isactive: boolean;


  constructor(userId: string, username: string, userpassword: string, usertype:string, firstname: string, 
              lastname: string, assignedclinic: string, assignedclinician: string, childrennames: any, isactive: boolean) {
    this.userId = userId;
    this.username = username;
    this.userpassword = userpassword;
    this.usertype = usertype;
    this.firstname = firstname;
    this.lastname = lastname;
    this.assignedclinic = assignedclinic;
    this.assignedclinician = assignedclinician;
    this.childrennames = childrennames;
    this.isactive = isactive;
  }

}
