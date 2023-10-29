import { GiftBackBookVM } from "./GiftBackBookVM";
export class GiftBackRequestVM {

    id: number;
    userId: string
    bookId: number | null
    standardBookNumber: string
    beneficiaryName: string
    beneficiaryMobile: string
    beneficiaryEmail: string
    numberOfRequestedCopies: number
    requestStatusId: number
    reason: string
    isArchived: boolean

    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;

    giftBackBooks: Array<GiftBackBookVM>
}