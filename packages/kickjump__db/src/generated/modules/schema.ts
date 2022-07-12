import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
import type * as _sys from "./sys";
import type * as _cfg from "./cfg";
import type * as _default from "./default";
enum $AccessKindλEnum {
  Select = "Select",
  UpdateRead = "UpdateRead",
  UpdateWrite = "UpdateWrite",
  Delete = "Delete",
  Insert = "Insert",
}
export type $AccessKind = {
  Select: $.$expr_Literal<$AccessKind>;
  UpdateRead: $.$expr_Literal<$AccessKind>;
  UpdateWrite: $.$expr_Literal<$AccessKind>;
  Delete: $.$expr_Literal<$AccessKind>;
  Insert: $.$expr_Literal<$AccessKind>;
} & $.EnumType<"schema::AccessKind", `${$AccessKindλEnum}`>;
const AccessKind: $AccessKind = $.makeType<$AccessKind>(_.spec, "fba3ff92-fdb4-11ec-acbf-9d5d93f289a9", _.syntax.literal);

enum $AccessPolicyActionλEnum {
  Allow = "Allow",
  Deny = "Deny",
}
export type $AccessPolicyAction = {
  Allow: $.$expr_Literal<$AccessPolicyAction>;
  Deny: $.$expr_Literal<$AccessPolicyAction>;
} & $.EnumType<"schema::AccessPolicyAction", `${$AccessPolicyActionλEnum}`>;
const AccessPolicyAction: $AccessPolicyAction = $.makeType<$AccessPolicyAction>(_.spec, "fba31cee-fdb4-11ec-b115-4dca51ef4c6f", _.syntax.literal);

enum $CardinalityλEnum {
  One = "One",
  Many = "Many",
}
export type $Cardinality = {
  One: $.$expr_Literal<$Cardinality>;
  Many: $.$expr_Literal<$Cardinality>;
} & $.EnumType<"schema::Cardinality", `${$CardinalityλEnum}`>;
const Cardinality: $Cardinality = $.makeType<$Cardinality>(_.spec, "fb9c6926-fdb4-11ec-8abf-0bfeb557abb0", _.syntax.literal);

enum $OperatorKindλEnum {
  Infix = "Infix",
  Postfix = "Postfix",
  Prefix = "Prefix",
  Ternary = "Ternary",
}
export type $OperatorKind = {
  Infix: $.$expr_Literal<$OperatorKind>;
  Postfix: $.$expr_Literal<$OperatorKind>;
  Prefix: $.$expr_Literal<$OperatorKind>;
  Ternary: $.$expr_Literal<$OperatorKind>;
} & $.EnumType<"schema::OperatorKind", `${$OperatorKindλEnum}`>;
const OperatorKind: $OperatorKind = $.makeType<$OperatorKind>(_.spec, "fb9f2dfa-fdb4-11ec-85ff-015d599ad5e5", _.syntax.literal);

enum $ParameterKindλEnum {
  VariadicParam = "VariadicParam",
  NamedOnlyParam = "NamedOnlyParam",
  PositionalParam = "PositionalParam",
}
export type $ParameterKind = {
  VariadicParam: $.$expr_Literal<$ParameterKind>;
  NamedOnlyParam: $.$expr_Literal<$ParameterKind>;
  PositionalParam: $.$expr_Literal<$ParameterKind>;
} & $.EnumType<"schema::ParameterKind", `${$ParameterKindλEnum}`>;
const ParameterKind: $ParameterKind = $.makeType<$ParameterKind>(_.spec, "fba1272c-fdb4-11ec-80a5-138acfe77823", _.syntax.literal);

enum $SourceDeleteActionλEnum {
  DeleteTarget = "DeleteTarget",
  Allow = "Allow",
  DeleteTargetIfOrphan = "DeleteTargetIfOrphan",
}
export type $SourceDeleteAction = {
  DeleteTarget: $.$expr_Literal<$SourceDeleteAction>;
  Allow: $.$expr_Literal<$SourceDeleteAction>;
  DeleteTargetIfOrphan: $.$expr_Literal<$SourceDeleteAction>;
} & $.EnumType<"schema::SourceDeleteAction", `${$SourceDeleteActionλEnum}`>;
const SourceDeleteAction: $SourceDeleteAction = $.makeType<$SourceDeleteAction>(_.spec, "fb9e3148-fdb4-11ec-9eb2-0133ce10c380", _.syntax.literal);

enum $TargetDeleteActionλEnum {
  Restrict = "Restrict",
  DeleteSource = "DeleteSource",
  Allow = "Allow",
  DeferredRestrict = "DeferredRestrict",
}
export type $TargetDeleteAction = {
  Restrict: $.$expr_Literal<$TargetDeleteAction>;
  DeleteSource: $.$expr_Literal<$TargetDeleteAction>;
  Allow: $.$expr_Literal<$TargetDeleteAction>;
  DeferredRestrict: $.$expr_Literal<$TargetDeleteAction>;
} & $.EnumType<"schema::TargetDeleteAction", `${$TargetDeleteActionλEnum}`>;
const TargetDeleteAction: $TargetDeleteAction = $.makeType<$TargetDeleteAction>(_.spec, "fb9d5066-fdb4-11ec-9172-2d980b32bfc1", _.syntax.literal);

enum $TypeModifierλEnum {
  SetOfType = "SetOfType",
  OptionalType = "OptionalType",
  SingletonType = "SingletonType",
}
export type $TypeModifier = {
  SetOfType: $.$expr_Literal<$TypeModifier>;
  OptionalType: $.$expr_Literal<$TypeModifier>;
  SingletonType: $.$expr_Literal<$TypeModifier>;
} & $.EnumType<"schema::TypeModifier", `${$TypeModifierλEnum}`>;
const TypeModifier: $TypeModifier = $.makeType<$TypeModifier>(_.spec, "fba20b10-fdb4-11ec-b770-b78bab5912d0", _.syntax.literal);

enum $VolatilityλEnum {
  Immutable = "Immutable",
  Stable = "Stable",
  Volatile = "Volatile",
}
export type $Volatility = {
  Immutable: $.$expr_Literal<$Volatility>;
  Stable: $.$expr_Literal<$Volatility>;
  Volatile: $.$expr_Literal<$Volatility>;
} & $.EnumType<"schema::Volatility", `${$VolatilityλEnum}`>;
const Volatility: $Volatility = $.makeType<$Volatility>(_.spec, "fba024a8-fdb4-11ec-b31e-51e0ed0f4ca7", _.syntax.literal);

export type $Object_fba5276efdb411ecba4b9b077b237ef4λShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "internal": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "builtin": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "computed_fields": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $Object_fba5276efdb411ecba4b9b077b237ef4 = $.ObjectType<"schema::Object", $Object_fba5276efdb411ecba4b9b077b237ef4λShape, null>;
const $Object_fba5276efdb411ecba4b9b077b237ef4 = $.makeType<$Object_fba5276efdb411ecba4b9b077b237ef4>(_.spec, "fba5276e-fdb4-11ec-ba4b-9b077b237ef4", _.syntax.literal);

const Object_fba5276efdb411ecba4b9b077b237ef4: $.$expr_PathNode<$.TypeSet<$Object_fba5276efdb411ecba4b9b077b237ef4, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Object_fba5276efdb411ecba4b9b077b237ef4, $.Cardinality.Many), null, true);

export type $SubclassableObjectλShape = $.typeutil.flatten<$Object_fba5276efdb411ecba4b9b077b237ef4λShape & {
  "abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "is_abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, true>;
  "final": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
  "is_final": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
}>;
type $SubclassableObject = $.ObjectType<"schema::SubclassableObject", $SubclassableObjectλShape, null>;
const $SubclassableObject = $.makeType<$SubclassableObject>(_.spec, "fbb4e604-fdb4-11ec-ab6b-6364d77e3d1a", _.syntax.literal);

const SubclassableObject: $.$expr_PathNode<$.TypeSet<$SubclassableObject, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($SubclassableObject, $.Cardinality.Many), null, true);

export type $InheritingObjectλShape = $.typeutil.flatten<$SubclassableObjectλShape & {
  "bases": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "ancestors": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "inherited_fields": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
  "<bases[is schema::InheritingObject]": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::InheritingObject]": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<ancestors": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<bases": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $InheritingObject = $.ObjectType<"schema::InheritingObject", $InheritingObjectλShape, null>;
const $InheritingObject = $.makeType<$InheritingObject>(_.spec, "fda06a7e-fdb4-11ec-ac7f-c38681b39e07", _.syntax.literal);

const InheritingObject: $.$expr_PathNode<$.TypeSet<$InheritingObject, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($InheritingObject, $.Cardinality.Many), null, true);

export type $AnnotationSubjectλShape = $.typeutil.flatten<$Object_fba5276efdb411ecba4b9b077b237ef4λShape & {
  "annotations": $.LinkDesc<$Annotation, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@value": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
}>;
type $AnnotationSubject = $.ObjectType<"schema::AnnotationSubject", $AnnotationSubjectλShape, null>;
const $AnnotationSubject = $.makeType<$AnnotationSubject>(_.spec, "fd5c5f28-fdb4-11ec-ae2c-435f5043e38e", _.syntax.literal);

const AnnotationSubject: $.$expr_PathNode<$.TypeSet<$AnnotationSubject, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($AnnotationSubject, $.Cardinality.Many), null, true);

export type $AccessPolicyλShape = $.typeutil.flatten<$InheritingObjectλShape & $AnnotationSubjectλShape & {
  "subject": $.LinkDesc<$ObjectType, $.Cardinality.One, {}, false, false,  false, false>;
  "access_kinds": $.PropertyDesc<$AccessKind, $.Cardinality.Many, false, false, false, false>;
  "condition": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "action": $.PropertyDesc<$AccessPolicyAction, $.Cardinality.One, false, false, false, false>;
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "<access_policies[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<access_policies": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $AccessPolicy = $.ObjectType<"schema::AccessPolicy", $AccessPolicyλShape, null>;
const $AccessPolicy = $.makeType<$AccessPolicy>(_.spec, "ff731716-fdb4-11ec-b995-83990eeb5d93", _.syntax.literal);

const AccessPolicy: $.$expr_PathNode<$.TypeSet<$AccessPolicy, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($AccessPolicy, $.Cardinality.Many), null, true);

export type $AliasλShape = $.typeutil.flatten<$AnnotationSubjectλShape & {
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $Alias = $.ObjectType<"schema::Alias", $AliasλShape, null>;
const $Alias = $.makeType<$Alias>(_.spec, "ffcd62f2-fdb4-11ec-84b0-477fed11478c", _.syntax.literal);

const Alias: $.$expr_PathNode<$.TypeSet<$Alias, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Alias, $.Cardinality.Many), null, true);

export type $AnnotationλShape = $.typeutil.flatten<$InheritingObjectλShape & $AnnotationSubjectλShape & {
  "inheritable": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "<annotations[is schema::AnnotationSubject]": $.LinkDesc<$AnnotationSubject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is sys::SystemObject]": $.LinkDesc<_sys.$SystemObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Annotation]": $.LinkDesc<$Annotation, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Alias]": $.LinkDesc<$Alias, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Global]": $.LinkDesc<$Global, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Migration]": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is sys::Role]": $.LinkDesc<_sys.$Role, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is sys::ExtensionPackage]": $.LinkDesc<_sys.$ExtensionPackage, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is schema::Extension]": $.LinkDesc<$Extension, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations[is sys::Database]": $.LinkDesc<_sys.$Database, $.Cardinality.Many, {}, false, false,  false, false>;
  "<annotations": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Annotation = $.ObjectType<"schema::Annotation", $AnnotationλShape, null>;
const $Annotation = $.makeType<$Annotation>(_.spec, "fd728c08-fdb4-11ec-9b6d-fd7e91fd9cab", _.syntax.literal);

const Annotation: $.$expr_PathNode<$.TypeSet<$Annotation, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Annotation, $.Cardinality.Many), null, true);

export type $TypeλShape = $.typeutil.flatten<$SubclassableObjectλShape & $AnnotationSubjectλShape & {
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "from_alias": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "is_from_alias": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, false>;
  "<element_type[is schema::Array]": $.LinkDesc<$Array, $.Cardinality.Many, {}, false, false,  false, false>;
  "<type[is schema::TupleElement]": $.LinkDesc<$TupleElement, $.Cardinality.Many, {}, false, false,  false, false>;
  "<element_type[is schema::Range]": $.LinkDesc<$Range, $.Cardinality.Many, {}, false, false,  false, false>;
  "<type[is schema::Parameter]": $.LinkDesc<$Parameter, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<type[is schema::Alias]": $.LinkDesc<$Alias, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target[is schema::Global]": $.LinkDesc<$Global, $.Cardinality.Many, {}, false, false,  false, false>;
  "<from_type[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false,  false, false>;
  "<to_type[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<element_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<from_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<return_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<to_type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<type": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Type = $.ObjectType<"schema::Type", $TypeλShape, null>;
const $Type = $.makeType<$Type>(_.spec, "fc05560c-fdb4-11ec-aeee-594d83f2fc4a", _.syntax.literal);

const Type: $.$expr_PathNode<$.TypeSet<$Type, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Type, $.Cardinality.Many), null, true);

export type $PrimitiveTypeλShape = $.typeutil.flatten<$TypeλShape & {
}>;
type $PrimitiveType = $.ObjectType<"schema::PrimitiveType", $PrimitiveTypeλShape, null>;
const $PrimitiveType = $.makeType<$PrimitiveType>(_.spec, "fc64691c-fdb4-11ec-af26-7f5d3da47943", _.syntax.literal);

const PrimitiveType: $.$expr_PathNode<$.TypeSet<$PrimitiveType, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($PrimitiveType, $.Cardinality.Many), null, true);

export type $CollectionTypeλShape = $.typeutil.flatten<$PrimitiveTypeλShape & {
}>;
type $CollectionType = $.ObjectType<"schema::CollectionType", $CollectionTypeλShape, null>;
const $CollectionType = $.makeType<$CollectionType>(_.spec, "fc876480-fdb4-11ec-835b-515e7cdfc862", _.syntax.literal);

const CollectionType: $.$expr_PathNode<$.TypeSet<$CollectionType, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($CollectionType, $.Cardinality.Many), null, true);

export type $ArrayλShape = $.typeutil.flatten<$CollectionTypeλShape & {
  "element_type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
  "dimensions": $.PropertyDesc<$.ArrayType<_std.$int16>, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $Array = $.ObjectType<"schema::Array", $ArrayλShape, null>;
const $Array = $.makeType<$Array>(_.spec, "fcb13b3e-fdb4-11ec-9c24-6b91236ae47c", _.syntax.literal);

const Array: $.$expr_PathNode<$.TypeSet<$Array, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Array, $.Cardinality.Many), null, true);

export type $CallableObjectλShape = $.typeutil.flatten<$AnnotationSubjectλShape & {
  "params": $.LinkDesc<$Parameter, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "return_type": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "return_typemod": $.PropertyDesc<$TypeModifier, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $CallableObject = $.ObjectType<"schema::CallableObject", $CallableObjectλShape, null>;
const $CallableObject = $.makeType<$CallableObject>(_.spec, "fdf2ca4e-fdb4-11ec-8078-8b3f877c4c1d", _.syntax.literal);

const CallableObject: $.$expr_PathNode<$.TypeSet<$CallableObject, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($CallableObject, $.Cardinality.Many), null, true);

export type $VolatilitySubjectλShape = $.typeutil.flatten<$Object_fba5276efdb411ecba4b9b077b237ef4λShape & {
  "volatility": $.PropertyDesc<$Volatility, $.Cardinality.AtMostOne, false, false, false, true>;
}>;
type $VolatilitySubject = $.ObjectType<"schema::VolatilitySubject", $VolatilitySubjectλShape, null>;
const $VolatilitySubject = $.makeType<$VolatilitySubject>(_.spec, "fe1f2a1c-fdb4-11ec-969d-c5c6ac1ad8a7", _.syntax.literal);

const VolatilitySubject: $.$expr_PathNode<$.TypeSet<$VolatilitySubject, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($VolatilitySubject, $.Cardinality.Many), null, true);

export type $CastλShape = $.typeutil.flatten<$AnnotationSubjectλShape & $VolatilitySubjectλShape & {
  "from_type": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "to_type": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "allow_implicit": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "allow_assignment": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $Cast = $.ObjectType<"schema::Cast", $CastλShape, null>;
const $Cast = $.makeType<$Cast>(_.spec, "045dda2c-fdb5-11ec-a2a0-eb18b460e283", _.syntax.literal);

const Cast: $.$expr_PathNode<$.TypeSet<$Cast, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Cast, $.Cardinality.Many), null, true);

export type $ConsistencySubjectλShape = $.typeutil.flatten<$Object_fba5276efdb411ecba4b9b077b237ef4λShape & $InheritingObjectλShape & $AnnotationSubjectλShape & {
  "constraints": $.LinkDesc<$Constraint, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
  "<subject[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<subject": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $ConsistencySubject = $.ObjectType<"schema::ConsistencySubject", $ConsistencySubjectλShape, null>;
const $ConsistencySubject = $.makeType<$ConsistencySubject>(_.spec, "fe852d08-fdb4-11ec-b90c-41c4fde69c23", _.syntax.literal);

const ConsistencySubject: $.$expr_PathNode<$.TypeSet<$ConsistencySubject, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($ConsistencySubject, $.Cardinality.Many), null, true);

export type $ConstraintλShape = $.typeutil.flatten<$CallableObjectλShape & $InheritingObjectλShape & {
  "params": $.LinkDesc<$Parameter, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
    "@value": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "subjectexpr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "finalexpr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "errmessage": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "delegated": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "except_expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "subject": $.LinkDesc<$ConsistencySubject, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::ConsistencySubject]": $.LinkDesc<$ConsistencySubject, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<constraints": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Constraint = $.ObjectType<"schema::Constraint", $ConstraintλShape, null>;
const $Constraint = $.makeType<$Constraint>(_.spec, "fe35215a-fdb4-11ec-b064-bf39706d66db", _.syntax.literal);

const Constraint: $.$expr_PathNode<$.TypeSet<$Constraint, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Constraint, $.Cardinality.Many), null, true);

export type $DeltaλShape = $.typeutil.flatten<$Object_fba5276efdb411ecba4b9b077b237ef4λShape & {
  "parents": $.LinkDesc<$Delta, $.Cardinality.Many, {}, false, false,  false, false>;
  "<parents[is schema::Delta]": $.LinkDesc<$Delta, $.Cardinality.Many, {}, false, false,  false, false>;
  "<parents": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Delta = $.ObjectType<"schema::Delta", $DeltaλShape, null>;
const $Delta = $.makeType<$Delta>(_.spec, "fd42e61a-fdb4-11ec-ab24-9102908aac7a", _.syntax.literal);

const Delta: $.$expr_PathNode<$.TypeSet<$Delta, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Delta, $.Cardinality.Many), null, true);

export type $ExtensionλShape = $.typeutil.flatten<$AnnotationSubjectλShape & $Object_fba5276efdb411ecba4b9b077b237ef4λShape & {
  "package": $.LinkDesc<_sys.$ExtensionPackage, $.Cardinality.One, {}, true, false,  false, false>;
}>;
type $Extension = $.ObjectType<"schema::Extension", $ExtensionλShape, null>;
const $Extension = $.makeType<$Extension>(_.spec, "04d6c78e-fdb5-11ec-a71b-7f9d5af2e34a", _.syntax.literal);

const Extension: $.$expr_PathNode<$.TypeSet<$Extension, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Extension, $.Cardinality.Many), null, true);

export type $FunctionλShape = $.typeutil.flatten<$CallableObjectλShape & $VolatilitySubjectλShape & {
  "preserves_optionality": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "body": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "language": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "used_globals": $.LinkDesc<$Global, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, false, false, false, false>;
}>;
type $Function = $.ObjectType<"schema::Function", $FunctionλShape, null>;
const $Function = $.makeType<$Function>(_.spec, "03c39b42-fdb5-11ec-93ef-7d957167dfea", _.syntax.literal);

const Function: $.$expr_PathNode<$.TypeSet<$Function, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Function, $.Cardinality.Many), null, true);

export type $GlobalλShape = $.typeutil.flatten<$AnnotationSubjectλShape & {
  "target": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
  "required": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "cardinality": $.PropertyDesc<$Cardinality, $.Cardinality.AtMostOne, false, false, false, false>;
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<used_globals[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<used_globals": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Global = $.ObjectType<"schema::Global", $GlobalλShape, null>;
const $Global = $.makeType<$Global>(_.spec, "03886d42-fdb5-11ec-bcd5-5f9a89ec8b92", _.syntax.literal);

const Global: $.$expr_PathNode<$.TypeSet<$Global, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Global, $.Cardinality.Many), null, true);

export type $IndexλShape = $.typeutil.flatten<$InheritingObjectλShape & $AnnotationSubjectλShape & {
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "except_expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<indexes[is schema::Source]": $.LinkDesc<$Source, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<indexes[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<indexes[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<indexes": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Index = $.ObjectType<"schema::Index", $IndexλShape, null>;
const $Index = $.makeType<$Index>(_.spec, "feb02bfc-fdb4-11ec-88b3-2fb4d7804786", _.syntax.literal);

const Index: $.$expr_PathNode<$.TypeSet<$Index, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Index, $.Cardinality.Many), null, true);

export type $PointerλShape = $.typeutil.flatten<$InheritingObjectλShape & $ConsistencySubjectλShape & $AnnotationSubjectλShape & {
  "cardinality": $.PropertyDesc<$Cardinality, $.Cardinality.AtMostOne, false, false, false, false>;
  "required": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "readonly": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, false>;
  "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "expr": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "source": $.LinkDesc<$Source, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "target": $.LinkDesc<$Type, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<pointers[is schema::Source]": $.LinkDesc<$Source, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<pointers[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<pointers[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<pointers": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Pointer = $.ObjectType<"schema::Pointer", $PointerλShape, null>;
const $Pointer = $.makeType<$Pointer>(_.spec, "ff1bdeb0-fdb4-11ec-9cae-afe780827e01", _.syntax.literal);

const Pointer: $.$expr_PathNode<$.TypeSet<$Pointer, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Pointer, $.Cardinality.Many), null, true);

export type $SourceλShape = $.typeutil.flatten<$Object_fba5276efdb411ecba4b9b077b237ef4λShape & {
  "indexes": $.LinkDesc<$Index, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
  "pointers": $.LinkDesc<$Pointer, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
  "<source[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<source[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<source[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<source": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Source = $.ObjectType<"schema::Source", $SourceλShape, null>;
const $Source = $.makeType<$Source>(_.spec, "fef1ff50-fdb4-11ec-bac0-9b55f5850d48", _.syntax.literal);

const Source: $.$expr_PathNode<$.TypeSet<$Source, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Source, $.Cardinality.Many), null, true);

export type $LinkλShape = $.typeutil.flatten<$PointerλShape & $SourceλShape & {
  "target": $.LinkDesc<$ObjectType, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "properties": $.LinkDesc<$Property, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, false, true, false, false>;
  "on_target_delete": $.PropertyDesc<$TargetDeleteAction, $.Cardinality.AtMostOne, false, false, false, false>;
  "on_source_delete": $.PropertyDesc<$SourceDeleteAction, $.Cardinality.AtMostOne, false, false, false, false>;
  "<links[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<links": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Link = $.ObjectType<"schema::Link", $LinkλShape, null>;
const $Link = $.makeType<$Link>(_.spec, "01fb64fc-fdb5-11ec-8904-579611e3195e", _.syntax.literal);

const Link: $.$expr_PathNode<$.TypeSet<$Link, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Link, $.Cardinality.Many), null, true);

export type $MigrationλShape = $.typeutil.flatten<$AnnotationSubjectλShape & $Object_fba5276efdb411ecba4b9b077b237ef4λShape & {
  "parents": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false,  false, false>;
  "script": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "message": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<parents[is schema::Migration]": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false,  false, false>;
  "<parents": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Migration = $.ObjectType<"schema::Migration", $MigrationλShape, null>;
const $Migration = $.makeType<$Migration>(_.spec, "049eed6e-fdb5-11ec-8b50-eba9c96a34a0", _.syntax.literal);

const Migration: $.$expr_PathNode<$.TypeSet<$Migration, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Migration, $.Cardinality.Many), null, true);

export type $ModuleλShape = $.typeutil.flatten<$Object_fba5276efdb411ecba4b9b077b237ef4λShape & $AnnotationSubjectλShape & {
}>;
type $Module = $.ObjectType<"schema::Module", $ModuleλShape, null>;
const $Module = $.makeType<$Module>(_.spec, "fc4e6ce8-fdb4-11ec-8e88-3334e7b5013d", _.syntax.literal);

const Module: $.$expr_PathNode<$.TypeSet<$Module, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Module, $.Cardinality.Many), null, true);

export type $ObjectTypeλShape = $.typeutil.flatten<$InheritingObjectλShape & $ConsistencySubjectλShape & $AnnotationSubjectλShape & $TypeλShape & $SourceλShape & {
  "union_of": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "intersection_of": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "access_policies": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
  "compound_type": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
  "is_compound_type": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
  "links": $.LinkDesc<$Link, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, false, true, false, false>;
  "properties": $.LinkDesc<$Property, $.Cardinality.Many, {
    "@owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
    "@is_owned": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne>;
  }, false, true, false, false>;
  "<__type__[is std::BaseObject]": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is std::Object]": $.LinkDesc<_std.$Object_faf27dbcfdb411eca738bf7841d9423d, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is std::FreeObject]": $.LinkDesc<_std.$FreeObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::TupleElement]": $.LinkDesc<$TupleElement, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Object]": $.LinkDesc<$Object_fba5276efdb411ecba4b9b077b237ef4, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::VolatilitySubject]": $.LinkDesc<$VolatilitySubject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::AnnotationSubject]": $.LinkDesc<$AnnotationSubject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::SubclassableObject]": $.LinkDesc<$SubclassableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::InheritingObject]": $.LinkDesc<$InheritingObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Delta]": $.LinkDesc<$Delta, $.Cardinality.Many, {}, false, false,  false, false>;
  "<union_of[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<intersection_of[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<subject[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is sys::SystemObject]": $.LinkDesc<_sys.$SystemObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::ConfigObject]": $.LinkDesc<_cfg.$ConfigObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::AuthMethod]": $.LinkDesc<_cfg.$AuthMethod, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::Trust]": $.LinkDesc<_cfg.$Trust, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::SCRAM]": $.LinkDesc<_cfg.$SCRAM, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::JWT]": $.LinkDesc<_cfg.$JWT, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::Auth]": $.LinkDesc<_cfg.$Auth, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::AbstractConfig]": $.LinkDesc<_cfg.$AbstractConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::Config]": $.LinkDesc<_cfg.$Config, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::InstanceConfig]": $.LinkDesc<_cfg.$InstanceConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is cfg::DatabaseConfig]": $.LinkDesc<_cfg.$DatabaseConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Annotation]": $.LinkDesc<$Annotation, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Type]": $.LinkDesc<$Type, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::PrimitiveType]": $.LinkDesc<$PrimitiveType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::CollectionType]": $.LinkDesc<$CollectionType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Array]": $.LinkDesc<$Array, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Tuple]": $.LinkDesc<$Tuple, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Range]": $.LinkDesc<$Range, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Alias]": $.LinkDesc<$Alias, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Global]": $.LinkDesc<$Global, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Parameter]": $.LinkDesc<$Parameter, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Cast]": $.LinkDesc<$Cast, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Migration]": $.LinkDesc<$Migration, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Module]": $.LinkDesc<$Module, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::PseudoType]": $.LinkDesc<$PseudoType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::ConsistencySubject]": $.LinkDesc<$ConsistencySubject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Index]": $.LinkDesc<$Index, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Pointer]": $.LinkDesc<$Pointer, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Property]": $.LinkDesc<$Property, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Source]": $.LinkDesc<$Source, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::AccessPolicy]": $.LinkDesc<$AccessPolicy, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::ScalarType]": $.LinkDesc<$ScalarType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is sys::Role]": $.LinkDesc<_sys.$Role, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is sys::ExtensionPackage]": $.LinkDesc<_sys.$ExtensionPackage, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is schema::Extension]": $.LinkDesc<$Extension, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is sys::Database]": $.LinkDesc<_sys.$Database, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is CreatedType]": $.LinkDesc<_default.$CreatedType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is UpdatedType]": $.LinkDesc<_default.$UpdatedType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is Account]": $.LinkDesc<_default.$Account, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is User]": $.LinkDesc<_default.$User, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__[is Email]": $.LinkDesc<_default.$Email, $.Cardinality.Many, {}, false, false,  false, false>;
  "<__type__": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<intersection_of": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<subject": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<target": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<union_of": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $ObjectType = $.ObjectType<"schema::ObjectType", $ObjectTypeλShape, null>;
const $ObjectType = $.makeType<$ObjectType>(_.spec, "00697fd4-fdb5-11ec-b223-9511f9f8b30a", _.syntax.literal);

const ObjectType: $.$expr_PathNode<$.TypeSet<$ObjectType, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($ObjectType, $.Cardinality.Many), null, true);

export type $OperatorλShape = $.typeutil.flatten<$CallableObjectλShape & $VolatilitySubjectλShape & {
  "operator_kind": $.PropertyDesc<$OperatorKind, $.Cardinality.AtMostOne, false, false, false, false>;
  "abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "is_abstract": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, true, false, true>;
}>;
type $Operator = $.ObjectType<"schema::Operator", $OperatorλShape, null>;
const $Operator = $.makeType<$Operator>(_.spec, "0413b730-fdb5-11ec-b71b-2770d11b237b", _.syntax.literal);

const Operator: $.$expr_PathNode<$.TypeSet<$Operator, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Operator, $.Cardinality.Many), null, true);

export type $ParameterλShape = $.typeutil.flatten<$Object_fba5276efdb411ecba4b9b077b237ef4λShape & {
  "type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
  "typemod": $.PropertyDesc<$TypeModifier, $.Cardinality.One, false, false, false, false>;
  "kind": $.PropertyDesc<$ParameterKind, $.Cardinality.One, false, false, false, false>;
  "num": $.PropertyDesc<_std.$int64, $.Cardinality.One, false, false, false, false>;
  "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<params[is schema::CallableObject]": $.LinkDesc<$CallableObject, $.Cardinality.Many, {}, false, false,  false, false>;
  "<params[is schema::Operator]": $.LinkDesc<$Operator, $.Cardinality.Many, {}, false, false,  false, false>;
  "<params[is schema::Function]": $.LinkDesc<$Function, $.Cardinality.Many, {}, false, false,  false, false>;
  "<params[is schema::Constraint]": $.LinkDesc<$Constraint, $.Cardinality.Many, {}, false, false,  false, false>;
  "<params": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Parameter = $.ObjectType<"schema::Parameter", $ParameterλShape, null>;
const $Parameter = $.makeType<$Parameter>(_.spec, "fdd19676-fdb4-11ec-ab90-d17ce78e20e2", _.syntax.literal);

const Parameter: $.$expr_PathNode<$.TypeSet<$Parameter, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Parameter, $.Cardinality.Many), null, true);

export type $PropertyλShape = $.typeutil.flatten<$PointerλShape & {
  "<properties[is schema::Link]": $.LinkDesc<$Link, $.Cardinality.Many, {}, false, false,  false, false>;
  "<properties[is schema::ObjectType]": $.LinkDesc<$ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
  "<properties": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Property = $.ObjectType<"schema::Property", $PropertyλShape, null>;
const $Property = $.makeType<$Property>(_.spec, "02c17fca-fdb5-11ec-81e7-091d86ed04d0", _.syntax.literal);

const Property: $.$expr_PathNode<$.TypeSet<$Property, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Property, $.Cardinality.Many), null, true);

export type $PseudoTypeλShape = $.typeutil.flatten<$InheritingObjectλShape & $TypeλShape & {
}>;
type $PseudoType = $.ObjectType<"schema::PseudoType", $PseudoTypeλShape, null>;
const $PseudoType = $.makeType<$PseudoType>(_.spec, "fc1f1f88-fdb4-11ec-a1ca-5f8c7e7f106e", _.syntax.literal);

const PseudoType: $.$expr_PathNode<$.TypeSet<$PseudoType, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($PseudoType, $.Cardinality.Many), null, true);

export type $RangeλShape = $.typeutil.flatten<$CollectionTypeλShape & {
  "element_type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
}>;
type $Range = $.ObjectType<"schema::Range", $RangeλShape, null>;
const $Range = $.makeType<$Range>(_.spec, "fd19a37c-fdb4-11ec-a53c-c10fbff0403e", _.syntax.literal);

const Range: $.$expr_PathNode<$.TypeSet<$Range, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Range, $.Cardinality.Many), null, true);

export type $ScalarTypeλShape = $.typeutil.flatten<$InheritingObjectλShape & $ConsistencySubjectλShape & $AnnotationSubjectλShape & $PrimitiveTypeλShape & {
  "default": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "enum_values": $.PropertyDesc<$.ArrayType<_std.$str>, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $ScalarType = $.ObjectType<"schema::ScalarType", $ScalarTypeλShape, null>;
const $ScalarType = $.makeType<$ScalarType>(_.spec, "fff6c00c-fdb4-11ec-a137-e95bbcf22750", _.syntax.literal);

const ScalarType: $.$expr_PathNode<$.TypeSet<$ScalarType, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($ScalarType, $.Cardinality.Many), null, true);

export type $TupleλShape = $.typeutil.flatten<$CollectionTypeλShape & {
  "named": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, false>;
  "element_types": $.LinkDesc<$TupleElement, $.Cardinality.Many, {
    "@index": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne>;
  }, true, false, false, false>;
}>;
type $Tuple = $.ObjectType<"schema::Tuple", $TupleλShape, null>;
const $Tuple = $.makeType<$Tuple>(_.spec, "fceab1de-fdb4-11ec-a99e-2366118604f6", _.syntax.literal);

const Tuple: $.$expr_PathNode<$.TypeSet<$Tuple, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Tuple, $.Cardinality.Many), null, true);

export type $TupleElementλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
  "type": $.LinkDesc<$Type, $.Cardinality.One, {}, false, false,  false, false>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "<element_types[is schema::Tuple]": $.LinkDesc<$Tuple, $.Cardinality.AtMostOne, {}, false, false,  false, false>;
  "<element_types": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $TupleElement = $.ObjectType<"schema::TupleElement", $TupleElementλShape, null>;
const $TupleElement = $.makeType<$TupleElement>(_.spec, "fcdb6f12-fdb4-11ec-aed0-8df5a941ce39", _.syntax.literal);

const TupleElement: $.$expr_PathNode<$.TypeSet<$TupleElement, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($TupleElement, $.Cardinality.Many), null, true);



export { $AccessKindλEnum, AccessKind, $AccessPolicyActionλEnum, AccessPolicyAction, $CardinalityλEnum, Cardinality, $OperatorKindλEnum, OperatorKind, $ParameterKindλEnum, ParameterKind, $SourceDeleteActionλEnum, SourceDeleteAction, $TargetDeleteActionλEnum, TargetDeleteAction, $TypeModifierλEnum, TypeModifier, $VolatilityλEnum, Volatility, $Object_fba5276efdb411ecba4b9b077b237ef4, Object_fba5276efdb411ecba4b9b077b237ef4, $SubclassableObject, SubclassableObject, $InheritingObject, InheritingObject, $AnnotationSubject, AnnotationSubject, $AccessPolicy, AccessPolicy, $Alias, Alias, $Annotation, Annotation, $Type, Type, $PrimitiveType, PrimitiveType, $CollectionType, CollectionType, $Array, Array, $CallableObject, CallableObject, $VolatilitySubject, VolatilitySubject, $Cast, Cast, $ConsistencySubject, ConsistencySubject, $Constraint, Constraint, $Delta, Delta, $Extension, Extension, $Function, Function, $Global, Global, $Index, Index, $Pointer, Pointer, $Source, Source, $Link, Link, $Migration, Migration, $Module, Module, $ObjectType, ObjectType, $Operator, Operator, $Parameter, Parameter, $Property, Property, $PseudoType, PseudoType, $Range, Range, $ScalarType, ScalarType, $Tuple, Tuple, $TupleElement, TupleElement };

type __defaultExports = {
  "AccessKind": typeof AccessKind;
  "AccessPolicyAction": typeof AccessPolicyAction;
  "Cardinality": typeof Cardinality;
  "OperatorKind": typeof OperatorKind;
  "ParameterKind": typeof ParameterKind;
  "SourceDeleteAction": typeof SourceDeleteAction;
  "TargetDeleteAction": typeof TargetDeleteAction;
  "TypeModifier": typeof TypeModifier;
  "Volatility": typeof Volatility;
  "Object": typeof Object_fba5276efdb411ecba4b9b077b237ef4;
  "SubclassableObject": typeof SubclassableObject;
  "InheritingObject": typeof InheritingObject;
  "AnnotationSubject": typeof AnnotationSubject;
  "AccessPolicy": typeof AccessPolicy;
  "Alias": typeof Alias;
  "Annotation": typeof Annotation;
  "Type": typeof Type;
  "PrimitiveType": typeof PrimitiveType;
  "CollectionType": typeof CollectionType;
  "Array": typeof Array;
  "CallableObject": typeof CallableObject;
  "VolatilitySubject": typeof VolatilitySubject;
  "Cast": typeof Cast;
  "ConsistencySubject": typeof ConsistencySubject;
  "Constraint": typeof Constraint;
  "Delta": typeof Delta;
  "Extension": typeof Extension;
  "Function": typeof Function;
  "Global": typeof Global;
  "Index": typeof Index;
  "Pointer": typeof Pointer;
  "Source": typeof Source;
  "Link": typeof Link;
  "Migration": typeof Migration;
  "Module": typeof Module;
  "ObjectType": typeof ObjectType;
  "Operator": typeof Operator;
  "Parameter": typeof Parameter;
  "Property": typeof Property;
  "PseudoType": typeof PseudoType;
  "Range": typeof Range;
  "ScalarType": typeof ScalarType;
  "Tuple": typeof Tuple;
  "TupleElement": typeof TupleElement
};
const __defaultExports: __defaultExports = {
  "AccessKind": AccessKind,
  "AccessPolicyAction": AccessPolicyAction,
  "Cardinality": Cardinality,
  "OperatorKind": OperatorKind,
  "ParameterKind": ParameterKind,
  "SourceDeleteAction": SourceDeleteAction,
  "TargetDeleteAction": TargetDeleteAction,
  "TypeModifier": TypeModifier,
  "Volatility": Volatility,
  "Object": Object_fba5276efdb411ecba4b9b077b237ef4,
  "SubclassableObject": SubclassableObject,
  "InheritingObject": InheritingObject,
  "AnnotationSubject": AnnotationSubject,
  "AccessPolicy": AccessPolicy,
  "Alias": Alias,
  "Annotation": Annotation,
  "Type": Type,
  "PrimitiveType": PrimitiveType,
  "CollectionType": CollectionType,
  "Array": Array,
  "CallableObject": CallableObject,
  "VolatilitySubject": VolatilitySubject,
  "Cast": Cast,
  "ConsistencySubject": ConsistencySubject,
  "Constraint": Constraint,
  "Delta": Delta,
  "Extension": Extension,
  "Function": Function,
  "Global": Global,
  "Index": Index,
  "Pointer": Pointer,
  "Source": Source,
  "Link": Link,
  "Migration": Migration,
  "Module": Module,
  "ObjectType": ObjectType,
  "Operator": Operator,
  "Parameter": Parameter,
  "Property": Property,
  "PseudoType": PseudoType,
  "Range": Range,
  "ScalarType": ScalarType,
  "Tuple": Tuple,
  "TupleElement": TupleElement
};
export default __defaultExports;
