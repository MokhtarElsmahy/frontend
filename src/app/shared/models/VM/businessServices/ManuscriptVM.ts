export class ManuscriptVM {
    id: number;
    beneficiaryName: string;
    beneficiaryEmail: string;
    beneficiaryMobile: string;
    beneficiaryQualification: string;
    beneficiaryInstitution: string;
    beneficiaryDepartment: string;
    manuscripTitle: string;
    purpose: string;
    requestStatusId: number;
    createdBy: string;
    createdDate: Date | null;
    updatedBy: string;
    updatedDate: Date | null;
    isArchived: boolean;
    filePath: string
    isTermsApprove: boolean = false;
    reasonOfRejection : string
    instructions : string
    internalCall : string
}