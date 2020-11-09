//Class used to store parent user data from response

import {FFQItemResponse} from './ffqitem-response';
import { ObjectUnsubscribedError } from 'rxjs';

export class FFQResearcherParentResponse {
  id: string;
  userId: string;
  username: string;
  usertype: string;
  firstname: string;
  lastname: string;
  assignedResearcherOrg: string;
  assignedResearcherUser: any;
  childrennames: any;
  isactive: boolean;


  constructor(userId: string, username: string, userpassword: string, usertype:string, firstname: string,
              lastname: string, assignedResearcherOrg: string, assignedResearcherUser: any, childrennames: any, isactive: boolean) {
    this.userId = userId;
    this.username = username;
    this.usertype = usertype;
    this.firstname = firstname;
    this.lastname = lastname;
    this.assignedResearcherInst = assignedResearcherInst;
    this.assignedResearcherUser = assignedResearcherUser;
    this.childrennames = childrennames;
    this.isactive = isactive;
  }

}