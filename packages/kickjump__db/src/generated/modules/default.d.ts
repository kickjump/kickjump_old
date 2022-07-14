import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
export declare type $CreatedTypeλShape = $.typeutil.flatten<_std.$Object_faf27dbcfdb411eca738bf7841d9423dλShape & {
  "createdAt": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, true, true>;
}>;
declare type $CreatedType = $.ObjectType<"default::CreatedType", $CreatedTypeλShape, null>;
declare const $CreatedType: $CreatedType

declare const CreatedType: $.$expr_PathNode<$.TypeSet<$CreatedType, $.Cardinality.Many>, null, true> 

export declare type $UpdatedTypeλShape = $.typeutil.flatten<$CreatedTypeλShape & {
  "updatedAt": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
declare type $UpdatedType = $.ObjectType<"default::UpdatedType", $UpdatedTypeλShape, null>;
declare const $UpdatedType: $UpdatedType

declare const UpdatedType: $.$expr_PathNode<$.TypeSet<$UpdatedType, $.Cardinality.Many>, null, true> 

export declare type $AccountλShape = $.typeutil.flatten<$UpdatedTypeλShape & {
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
declare type $Account = $.ObjectType<"default::Account", $AccountλShape, null>;
declare const $Account: $Account

declare const Account: $.$expr_PathNode<$.TypeSet<$Account, $.Cardinality.Many>, null, true> 

export declare type $EmailλShape = $.typeutil.flatten<$UpdatedTypeλShape & {
  "user": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "primary": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "email": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "verified": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, false, false>;
  "<emails[is User]": $.LinkDesc<$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<emails": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
declare type $Email = $.ObjectType<"default::Email", $EmailλShape, null>;
declare const $Email: $Email

declare const Email: $.$expr_PathNode<$.TypeSet<$Email, $.Cardinality.Many>, null, true> 

export declare type $UserλShape = $.typeutil.flatten<$UpdatedTypeλShape & {
  "image": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "accounts": $.LinkDesc<$Account, $.Cardinality.Many, {}, false, true,  false, false>;
  "emails": $.LinkDesc<$Email, $.Cardinality.Many, {}, false, true,  false, false>;
  "<user[is Account]": $.LinkDesc<$Account, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user[is Email]": $.LinkDesc<$Email, $.Cardinality.Many, {}, false, false,  false, false>;
  "<user": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
declare type $User = $.ObjectType<"default::User", $UserλShape, null>;
declare const $User: $User

declare const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null, true> 



export { $CreatedType, CreatedType, $UpdatedType, UpdatedType, $Account, Account, $Email, Email, $User, User };

declare type __defaultExports = {
  "CreatedType": typeof CreatedType;
  "UpdatedType": typeof UpdatedType;
  "Account": typeof Account;
  "Email": typeof Email;
  "User": typeof User
};
declare const __defaultExports: __defaultExports;
export default __defaultExports;
