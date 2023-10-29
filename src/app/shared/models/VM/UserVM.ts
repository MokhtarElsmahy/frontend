import { UserRoleVM } from "./Request/UserRoleVM";
import { RoleVM } from "./RoleVM";

export class UserVM{
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    nameArabic: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    pictureUrl: string;
    address: string;
    countryId: number;
    country: number;

    roleName: string;
    defaultRole: string;
    roles: Array<RoleVM>;
    userRoles: Array<UserRoleVM>;
    joinDate: string;
    active: boolean;

    numberOfRequests: number;
}