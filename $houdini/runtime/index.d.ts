import { GetSelfForEditStore } from "../plugins/houdini-svelte/stores/GetSelfForEdit";
import { EditSelfStore } from "../plugins/houdini-svelte/stores/EditSelf";
import { AllMailStore } from "../plugins/houdini-svelte/stores/AllMail";
import { GetPersonForEditStore } from "../plugins/houdini-svelte/stores/GetPersonForEdit";
import { EditPersonStore } from "../plugins/houdini-svelte/stores/EditPerson";
import { CreatePersonStore } from "../plugins/houdini-svelte/stores/CreatePerson";
import { HistoryStore } from "../plugins/houdini-svelte/stores/History";
import { AllPeopleStore } from "../plugins/houdini-svelte/stores/AllPeople";
import { CreateRoleStore } from "../plugins/houdini-svelte/stores/CreateRole";
import { StopRoleStore } from "../plugins/houdini-svelte/stores/StopRole";
import { RoleSelectorStore } from "../plugins/houdini-svelte/stores/RoleSelector";
import { AllRolesForOptionsStore } from "../plugins/houdini-svelte/stores/AllRolesForOptions";
import { Cache as InternalCache } from "./cache/cache";
import type { CacheTypeDef } from "./generated";
import { Cache } from "./public";
export * from "./lib";

export function graphql(
    str: "\n\t\tquery GetSelfForEdit($id: Int!) {\n\t\t\tauth_person_by_pk(id: $id) {\n\t\t\t\tname\n\t\t\t\tfirstname\n\t\t\t\tlastname\n\t\t\t\temail\n\t\t\t\tphone\n\t\t\t\taddress\n\t\t\t\tzipcode\n\t\t\t\tcity\n\t\t\t\tcountry\n\t\t\t\tnote\n\t\t\t\tid\n\t\t\t\tcreated\n\t\t\t\tmodified\n\t\t\t\tbankaccount\n\t\t\t}\n\t\t}\n\t"
): GetSelfForEditStore;

export function graphql(
    str: "\n\t\tmutation EditSelf($id: Int!, $data: auth_person_set_input!) {\n\t\t\tperson: update_auth_person(where: { id: { _eq: $id } }, _set: $data) {\n\t\t\t\treturning {\n\t\t\t\t\tname\n\t\t\t\t\tfirstname\n\t\t\t\t\tlastname\n\t\t\t\t\temail\n\t\t\t\t\tphone\n\t\t\t\t\taddress\n\t\t\t\t\tzipcode\n\t\t\t\t\tcity\n\t\t\t\t\tcountry\n\t\t\t\t\tid\n\t\t\t\t\tcreated\n\t\t\t\t\tmodified\n\t\t\t\t\tbankaccount\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"
): EditSelfStore;

export function graphql(
    str: "\n\t\tquery AllMail {\n\t\t\tmails: mail_entries(order_by: { created: desc }, limit: 100) {\n\t\t\t\tid\n\t\t\t\tstatus\n\t\t\t\tperson {\n\t\t\t\t\tname\n\t\t\t\t\temail\n\t\t\t\t}\n\t\t\t\ttemplate\n\t\t\t\tcreated\n\t\t\t}\n\t\t}\n\t"
): AllMailStore;

export function graphql(
    str: "\n\t\tquery GetPersonForEdit($name: String, $isBoard: Boolean = false) {\n\t\t\tauth_person(where: { name: { _ilike: $name } }, limit: 1) {\n\t\t\t\tname\n\t\t\t\tfirstname\n\t\t\t\tlastname\n\t\t\t\temail\n\t\t\t\tphone\n\t\t\t\taddress\n\t\t\t\tzipcode\n\t\t\t\tcity\n\t\t\t\tcountry\n\t\t\t\tnote\n\t\t\t\tid\n\t\t\t\tcreated\n\t\t\t\tmodified\n\t\t\t\t...RoleSelector\n\n\t\t\t\tbankaccount @include(if: $isBoard)\n\t\t\t\tkey_code @include(if: $isBoard)\n\t\t\t}\n\t\t}\n\t"
): GetPersonForEditStore;

export function graphql(
    str: "\n\t\tmutation EditPerson($id: Int!, $data: auth_person_set_input!) {\n\t\t\tperson: update_auth_person(where: { id: { _eq: $id } }, _set: $data) {\n\t\t\t\treturning {\n\t\t\t\t\tname\n\t\t\t\t\tfirstname\n\t\t\t\t\tlastname\n\t\t\t\t\temail\n\t\t\t\t\tphone\n\t\t\t\t\taddress\n\t\t\t\t\tzipcode\n\t\t\t\t\tcity\n\t\t\t\t\tcountry\n\t\t\t\t\tnote\n\t\t\t\t\tid\n\t\t\t\t\tcreated\n\t\t\t\t\tmodified\n\n\t\t\t\t\tbankaccount\n\t\t\t\t\tkey_code\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"
): EditPersonStore;

export function graphql(
    str: "\n\t\tmutation CreatePerson($person: auth_person_insert_input!) {\n\t\t\tperson: insert_auth_person_one(object: $person) {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t}\n\t\t}\n\t"
): CreatePersonStore;

export function graphql(
    str: "\n\t\tquery History {\n\t\t\thistory: auth_history(order_by: { timestamp: desc }) {\n\t\t\t\ttimestamp\n\t\t\t\tnew_values\n\t\t\t\told_values\n\t\t\t\trole\n\t\t\t\tauthor {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t\tperson {\n\t\t\t\t\tname\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"
): HistoryStore;

export function graphql(
    str: "\n\t\tquery AllPeople($where: auth_person_bool_exp = {}) {\n\t\t\tpeople: auth_person(order_by: { name: asc }, where: $where) {\n\t\t\t\tname\n\t\t\t\temail\n\t\t\t\tphone\n\t\t\t\taddress\n\t\t\t\tcity\n\t\t\t\tfirstname\n\t\t\t\tlastname\n\t\t\t\troles(where: { valid_till: { _is_null: true }, valid_from: { _lte: \"NOW()\" } }) {\n\t\t\t\t\trole\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"
): AllPeopleStore;

export function graphql(
    str: "\n\t\tmutation CreateRole($personId: Int!, $role: String!) {\n\t\t\tinsert_auth_person_role_one(object: { person_id: $personId, role: $role }) {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t"
): CreateRoleStore;

export function graphql(
    str: "\n\t\tmutation StopRole($id: Int!) {\n\t\t\tupdate_auth_person_role_by_pk(pk_columns: { id: $id }, _set: { valid_till: \"NOW()\" }) {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t"
): StopRoleStore;

export function graphql(
    str: "\n\t\t\tfragment RoleSelector on auth_person {\n\t\t\t\troles {\n\t\t\t\t\tid\n\t\t\t\t\trole\n\t\t\t\t\tvalid_from\n\t\t\t\t\tvalid_till\n\t\t\t\t}\n\t\t\t}\n\t\t"
): RoleSelectorStore;

export function graphql(
    str: "\n\t\tquery AllRolesForOptions {\n\t\t\tauth_person_role(distinct_on: role) {\n\t\t\t\trole\n\t\t\t}\n\t\t}\n\t"
): AllRolesForOptionsStore;

export declare function graphql(str: string | TemplateStringsArray): any;
export declare const cache: Cache<CacheTypeDef>;
export declare function getCache(): InternalCache;