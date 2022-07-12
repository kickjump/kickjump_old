import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
export type $CreatedTypeλShape = $.typeutil.flatten<_std.$Object_faf27dbcfdb411eca738bf7841d9423dλShape & {
  "createdAt": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, true, true>;
}>;
type $CreatedType = $.ObjectType<"default::CreatedType", $CreatedTypeλShape, null>;
const $CreatedType = $.makeType<$CreatedType>(_.spec, "35bc0a1a-ffb5-11ec-b1b6-63da2a2a52eb", _.syntax.literal);

const CreatedType: $.$expr_PathNode<$.TypeSet<$CreatedType, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($CreatedType, $.Cardinality.Many), null, true);

export type $UpdatedTypeλShape = $.typeutil.flatten<$CreatedTypeλShape & {
  "updatedAt": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
type $UpdatedType = $.ObjectType<"default::UpdatedType", $UpdatedTypeλShape, null>;
const $UpdatedType = $.makeType<$UpdatedType>(_.spec, "35be5432-ffb5-11ec-9557-c7e7e295101c", _.syntax.literal);

const UpdatedType: $.$expr_PathNode<$.TypeSet<$UpdatedType, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($UpdatedType, $.Cardinality.Many), null, true);

export type $AccountλShape = $.typeutil.flatten<$UpdatedTypeλShape & {
  "providerAccountId": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "provider": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "accountType": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "accessToken": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "refreshToken": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "scope": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
  "<accounts[is User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<accounts": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Account = $.ObjectType<"default::Account", $AccountλShape, null>;
const $Account = $.makeType<$Account>(_.spec, "35c09b7a-ffb5-11ec-a9e2-c3ec2468b74b", _.syntax.literal);

const Account: $.$expr_PathNode<$.TypeSet<$Account, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Account, $.Cardinality.Many), null, true);

export type $EmailλShape = $.typeutil.flatten<$UpdatedTypeλShape & {
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "primary": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "verified": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, false>;
  "<emails[is User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<emails": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Email = $.ObjectType<"default::Email", $EmailλShape, null>;
const $Email = $.makeType<$Email>(_.spec, "35cf8b9e-ffb5-11ec-8eb3-a10222d70eb7", _.syntax.literal);

const Email: $.$expr_PathNode<$.TypeSet<$Email, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Email, $.Cardinality.Many), null, true);

export type $UserλShape = $.typeutil.flatten<$UpdatedTypeλShape & {
  "image": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "accounts": $.LinkDesc<$Account, $.Cardinality.Many, {}, false, true,  false, false>;
  "emails": $.LinkDesc<$Email, $.Cardinality.Many, {}, false, true,  false, false>;
  "<user[is Account]": $.LinkDesc<$Account, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is Email]": $.LinkDesc<$Email, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"default::User", $UserλShape, null>;
const $User = $.makeType<$User>(_.spec, "35c39eec-ffb5-11ec-ab83-a14ad0ce3f84", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null, true);



export { $CreatedType, CreatedType, $UpdatedType, UpdatedType, $Account, Account, $Email, Email, $User, User };

type __defaultExports = {
  "CreatedType": typeof CreatedType;
  "UpdatedType": typeof UpdatedType;
  "Account": typeof Account;
  "Email": typeof Email;
  "User": typeof User
};
const __defaultExports: __defaultExports = {
  "CreatedType": CreatedType,
  "UpdatedType": UpdatedType,
  "Account": Account,
  "Email": Email,
  "User": User
};
export default __defaultExports;
