import { $ } from "edgedb";
import * as _ from "../imports.mjs";
const $AccessKindλEnum = {
  Select: "Select",
  UpdateRead: "UpdateRead",
  UpdateWrite: "UpdateWrite",
  Delete: "Delete",
  Insert: "Insert",
}
const AccessKind = $.makeType(_.spec, "fba3ff92-fdb4-11ec-acbf-9d5d93f289a9", _.syntax.literal);

const $AccessPolicyActionλEnum = {
  Allow: "Allow",
  Deny: "Deny",
}
const AccessPolicyAction = $.makeType(_.spec, "fba31cee-fdb4-11ec-b115-4dca51ef4c6f", _.syntax.literal);

const $CardinalityλEnum = {
  One: "One",
  Many: "Many",
}
const Cardinality = $.makeType(_.spec, "fb9c6926-fdb4-11ec-8abf-0bfeb557abb0", _.syntax.literal);

const $OperatorKindλEnum = {
  Infix: "Infix",
  Postfix: "Postfix",
  Prefix: "Prefix",
  Ternary: "Ternary",
}
const OperatorKind = $.makeType(_.spec, "fb9f2dfa-fdb4-11ec-85ff-015d599ad5e5", _.syntax.literal);

const $ParameterKindλEnum = {
  VariadicParam: "VariadicParam",
  NamedOnlyParam: "NamedOnlyParam",
  PositionalParam: "PositionalParam",
}
const ParameterKind = $.makeType(_.spec, "fba1272c-fdb4-11ec-80a5-138acfe77823", _.syntax.literal);

const $SourceDeleteActionλEnum = {
  DeleteTarget: "DeleteTarget",
  Allow: "Allow",
  DeleteTargetIfOrphan: "DeleteTargetIfOrphan",
}
const SourceDeleteAction = $.makeType(_.spec, "fb9e3148-fdb4-11ec-9eb2-0133ce10c380", _.syntax.literal);

const $TargetDeleteActionλEnum = {
  Restrict: "Restrict",
  DeleteSource: "DeleteSource",
  Allow: "Allow",
  DeferredRestrict: "DeferredRestrict",
}
const TargetDeleteAction = $.makeType(_.spec, "fb9d5066-fdb4-11ec-9172-2d980b32bfc1", _.syntax.literal);

const $TypeModifierλEnum = {
  SetOfType: "SetOfType",
  OptionalType: "OptionalType",
  SingletonType: "SingletonType",
}
const TypeModifier = $.makeType(_.spec, "fba20b10-fdb4-11ec-b770-b78bab5912d0", _.syntax.literal);

const $VolatilityλEnum = {
  Immutable: "Immutable",
  Stable: "Stable",
  Volatile: "Volatile",
}
const Volatility = $.makeType(_.spec, "fba024a8-fdb4-11ec-b31e-51e0ed0f4ca7", _.syntax.literal);

const $Object_fba5276efdb411ecba4b9b077b237ef4 = $.makeType(_.spec, "fba5276e-fdb4-11ec-ba4b-9b077b237ef4", _.syntax.literal);

const Object_fba5276efdb411ecba4b9b077b237ef4= _.syntax.$PathNode($.$toSet($Object_fba5276efdb411ecba4b9b077b237ef4, $.Cardinality.Many), null, true);

const $SubclassableObject = $.makeType(_.spec, "fbb4e604-fdb4-11ec-ab6b-6364d77e3d1a", _.syntax.literal);

const SubclassableObject= _.syntax.$PathNode($.$toSet($SubclassableObject, $.Cardinality.Many), null, true);

const $InheritingObject = $.makeType(_.spec, "fda06a7e-fdb4-11ec-ac7f-c38681b39e07", _.syntax.literal);

const InheritingObject= _.syntax.$PathNode($.$toSet($InheritingObject, $.Cardinality.Many), null, true);

const $AnnotationSubject = $.makeType(_.spec, "fd5c5f28-fdb4-11ec-ae2c-435f5043e38e", _.syntax.literal);

const AnnotationSubject= _.syntax.$PathNode($.$toSet($AnnotationSubject, $.Cardinality.Many), null, true);

const $AccessPolicy = $.makeType(_.spec, "ff731716-fdb4-11ec-b995-83990eeb5d93", _.syntax.literal);

const AccessPolicy= _.syntax.$PathNode($.$toSet($AccessPolicy, $.Cardinality.Many), null, true);

const $Alias = $.makeType(_.spec, "ffcd62f2-fdb4-11ec-84b0-477fed11478c", _.syntax.literal);

const Alias= _.syntax.$PathNode($.$toSet($Alias, $.Cardinality.Many), null, true);

const $Annotation = $.makeType(_.spec, "fd728c08-fdb4-11ec-9b6d-fd7e91fd9cab", _.syntax.literal);

const Annotation= _.syntax.$PathNode($.$toSet($Annotation, $.Cardinality.Many), null, true);

const $Type = $.makeType(_.spec, "fc05560c-fdb4-11ec-aeee-594d83f2fc4a", _.syntax.literal);

const Type= _.syntax.$PathNode($.$toSet($Type, $.Cardinality.Many), null, true);

const $PrimitiveType = $.makeType(_.spec, "fc64691c-fdb4-11ec-af26-7f5d3da47943", _.syntax.literal);

const PrimitiveType= _.syntax.$PathNode($.$toSet($PrimitiveType, $.Cardinality.Many), null, true);

const $CollectionType = $.makeType(_.spec, "fc876480-fdb4-11ec-835b-515e7cdfc862", _.syntax.literal);

const CollectionType= _.syntax.$PathNode($.$toSet($CollectionType, $.Cardinality.Many), null, true);

const $Array = $.makeType(_.spec, "fcb13b3e-fdb4-11ec-9c24-6b91236ae47c", _.syntax.literal);

const Array= _.syntax.$PathNode($.$toSet($Array, $.Cardinality.Many), null, true);

const $CallableObject = $.makeType(_.spec, "fdf2ca4e-fdb4-11ec-8078-8b3f877c4c1d", _.syntax.literal);

const CallableObject= _.syntax.$PathNode($.$toSet($CallableObject, $.Cardinality.Many), null, true);

const $VolatilitySubject = $.makeType(_.spec, "fe1f2a1c-fdb4-11ec-969d-c5c6ac1ad8a7", _.syntax.literal);

const VolatilitySubject= _.syntax.$PathNode($.$toSet($VolatilitySubject, $.Cardinality.Many), null, true);

const $Cast = $.makeType(_.spec, "045dda2c-fdb5-11ec-a2a0-eb18b460e283", _.syntax.literal);

const Cast= _.syntax.$PathNode($.$toSet($Cast, $.Cardinality.Many), null, true);

const $ConsistencySubject = $.makeType(_.spec, "fe852d08-fdb4-11ec-b90c-41c4fde69c23", _.syntax.literal);

const ConsistencySubject= _.syntax.$PathNode($.$toSet($ConsistencySubject, $.Cardinality.Many), null, true);

const $Constraint = $.makeType(_.spec, "fe35215a-fdb4-11ec-b064-bf39706d66db", _.syntax.literal);

const Constraint= _.syntax.$PathNode($.$toSet($Constraint, $.Cardinality.Many), null, true);

const $Delta = $.makeType(_.spec, "fd42e61a-fdb4-11ec-ab24-9102908aac7a", _.syntax.literal);

const Delta= _.syntax.$PathNode($.$toSet($Delta, $.Cardinality.Many), null, true);

const $Extension = $.makeType(_.spec, "04d6c78e-fdb5-11ec-a71b-7f9d5af2e34a", _.syntax.literal);

const Extension= _.syntax.$PathNode($.$toSet($Extension, $.Cardinality.Many), null, true);

const $Function = $.makeType(_.spec, "03c39b42-fdb5-11ec-93ef-7d957167dfea", _.syntax.literal);

const Function= _.syntax.$PathNode($.$toSet($Function, $.Cardinality.Many), null, true);

const $Global = $.makeType(_.spec, "03886d42-fdb5-11ec-bcd5-5f9a89ec8b92", _.syntax.literal);

const Global= _.syntax.$PathNode($.$toSet($Global, $.Cardinality.Many), null, true);

const $Index = $.makeType(_.spec, "feb02bfc-fdb4-11ec-88b3-2fb4d7804786", _.syntax.literal);

const Index= _.syntax.$PathNode($.$toSet($Index, $.Cardinality.Many), null, true);

const $Pointer = $.makeType(_.spec, "ff1bdeb0-fdb4-11ec-9cae-afe780827e01", _.syntax.literal);

const Pointer= _.syntax.$PathNode($.$toSet($Pointer, $.Cardinality.Many), null, true);

const $Source = $.makeType(_.spec, "fef1ff50-fdb4-11ec-bac0-9b55f5850d48", _.syntax.literal);

const Source= _.syntax.$PathNode($.$toSet($Source, $.Cardinality.Many), null, true);

const $Link = $.makeType(_.spec, "01fb64fc-fdb5-11ec-8904-579611e3195e", _.syntax.literal);

const Link= _.syntax.$PathNode($.$toSet($Link, $.Cardinality.Many), null, true);

const $Migration = $.makeType(_.spec, "049eed6e-fdb5-11ec-8b50-eba9c96a34a0", _.syntax.literal);

const Migration= _.syntax.$PathNode($.$toSet($Migration, $.Cardinality.Many), null, true);

const $Module = $.makeType(_.spec, "fc4e6ce8-fdb4-11ec-8e88-3334e7b5013d", _.syntax.literal);

const Module= _.syntax.$PathNode($.$toSet($Module, $.Cardinality.Many), null, true);

const $ObjectType = $.makeType(_.spec, "00697fd4-fdb5-11ec-b223-9511f9f8b30a", _.syntax.literal);

const ObjectType= _.syntax.$PathNode($.$toSet($ObjectType, $.Cardinality.Many), null, true);

const $Operator = $.makeType(_.spec, "0413b730-fdb5-11ec-b71b-2770d11b237b", _.syntax.literal);

const Operator= _.syntax.$PathNode($.$toSet($Operator, $.Cardinality.Many), null, true);

const $Parameter = $.makeType(_.spec, "fdd19676-fdb4-11ec-ab90-d17ce78e20e2", _.syntax.literal);

const Parameter= _.syntax.$PathNode($.$toSet($Parameter, $.Cardinality.Many), null, true);

const $Property = $.makeType(_.spec, "02c17fca-fdb5-11ec-81e7-091d86ed04d0", _.syntax.literal);

const Property= _.syntax.$PathNode($.$toSet($Property, $.Cardinality.Many), null, true);

const $PseudoType = $.makeType(_.spec, "fc1f1f88-fdb4-11ec-a1ca-5f8c7e7f106e", _.syntax.literal);

const PseudoType= _.syntax.$PathNode($.$toSet($PseudoType, $.Cardinality.Many), null, true);

const $Range = $.makeType(_.spec, "fd19a37c-fdb4-11ec-a53c-c10fbff0403e", _.syntax.literal);

const Range= _.syntax.$PathNode($.$toSet($Range, $.Cardinality.Many), null, true);

const $ScalarType = $.makeType(_.spec, "fff6c00c-fdb4-11ec-a137-e95bbcf22750", _.syntax.literal);

const ScalarType= _.syntax.$PathNode($.$toSet($ScalarType, $.Cardinality.Many), null, true);

const $Tuple = $.makeType(_.spec, "fceab1de-fdb4-11ec-a99e-2366118604f6", _.syntax.literal);

const Tuple= _.syntax.$PathNode($.$toSet($Tuple, $.Cardinality.Many), null, true);

const $TupleElement = $.makeType(_.spec, "fcdb6f12-fdb4-11ec-aed0-8df5a941ce39", _.syntax.literal);

const TupleElement= _.syntax.$PathNode($.$toSet($TupleElement, $.Cardinality.Many), null, true);



export { $AccessKindλEnum, AccessKind, $AccessPolicyActionλEnum, AccessPolicyAction, $CardinalityλEnum, Cardinality, $OperatorKindλEnum, OperatorKind, $ParameterKindλEnum, ParameterKind, $SourceDeleteActionλEnum, SourceDeleteAction, $TargetDeleteActionλEnum, TargetDeleteAction, $TypeModifierλEnum, TypeModifier, $VolatilityλEnum, Volatility, $Object_fba5276efdb411ecba4b9b077b237ef4, Object_fba5276efdb411ecba4b9b077b237ef4, $SubclassableObject, SubclassableObject, $InheritingObject, InheritingObject, $AnnotationSubject, AnnotationSubject, $AccessPolicy, AccessPolicy, $Alias, Alias, $Annotation, Annotation, $Type, Type, $PrimitiveType, PrimitiveType, $CollectionType, CollectionType, $Array, Array, $CallableObject, CallableObject, $VolatilitySubject, VolatilitySubject, $Cast, Cast, $ConsistencySubject, ConsistencySubject, $Constraint, Constraint, $Delta, Delta, $Extension, Extension, $Function, Function, $Global, Global, $Index, Index, $Pointer, Pointer, $Source, Source, $Link, Link, $Migration, Migration, $Module, Module, $ObjectType, ObjectType, $Operator, Operator, $Parameter, Parameter, $Property, Property, $PseudoType, PseudoType, $Range, Range, $ScalarType, ScalarType, $Tuple, Tuple, $TupleElement, TupleElement };

const __defaultExports = {
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
