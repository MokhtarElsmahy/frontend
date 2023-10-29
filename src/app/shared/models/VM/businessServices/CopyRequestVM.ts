export class CopyRequestVM {
    id: number;
    beneficiaryName: string;
    beneficiaryEmail: string;
    beneficiaryMobile: string;
    beneficiaryQualification: string;
    purpose: string;
    bookTitle: string;
    requestStatusId: number;
    filePath: string;
    createdBy: string;
    createdDate: Date | null;
    updatedBy: string;
    updatedDate: Date | null;
    isArchived: boolean;
    reasonOfRejection: string;
    instructions: string;

    startPage :number
    endPage :number

    libraryId :number

    isOutsideKingdom : boolean;
    country : number =1;
}