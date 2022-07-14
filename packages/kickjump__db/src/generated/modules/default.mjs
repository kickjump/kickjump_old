import { $ } from "edgedb";
import * as _ from "../imports.mjs";
const $CreatedType = $.makeType(_.spec, "35bc0a1a-ffb5-11ec-b1b6-63da2a2a52eb", _.syntax.literal);

const CreatedType= _.syntax.$PathNode($.$toSet($CreatedType, $.Cardinality.Many), null, true);

const $UpdatedType = $.makeType(_.spec, "35be5432-ffb5-11ec-9557-c7e7e295101c", _.syntax.literal);

const UpdatedType= _.syntax.$PathNode($.$toSet($UpdatedType, $.Cardinality.Many), null, true);

const $Account = $.makeType(_.spec, "35c09b7a-ffb5-11ec-a9e2-c3ec2468b74b", _.syntax.literal);

const Account= _.syntax.$PathNode($.$toSet($Account, $.Cardinality.Many), null, true);

const $Email = $.makeType(_.spec, "35cf8b9e-ffb5-11ec-8eb3-a10222d70eb7", _.syntax.literal);

const Email= _.syntax.$PathNode($.$toSet($Email, $.Cardinality.Many), null, true);

const $User = $.makeType(_.spec, "35c39eec-ffb5-11ec-ab83-a14ad0ce3f84", _.syntax.literal);

const User= _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null, true);



export { $CreatedType, CreatedType, $UpdatedType, UpdatedType, $Account, Account, $Email, Email, $User, User };

const __defaultExports = {
  "CreatedType": CreatedType,
  "UpdatedType": UpdatedType,
  "Account": Account,
  "Email": Email,
  "User": User
};
export default __defaultExports;
