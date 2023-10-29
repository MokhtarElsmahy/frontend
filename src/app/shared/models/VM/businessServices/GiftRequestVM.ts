import { GiftedBookVM } from "./GiftedBookVM";

export class GiftRequestVM {
    id: number;
    userId: string;
    supplierName: string;
    supplierMobile: string;
    supplierEmail: string;
    giftTypeId: number;
    librarianName: string;
    numberOfTitles: number;
    numberOfFolders: number;
    giftPurpose: string;
    additionTypeId: number;
    booksDataFile: string;
    conditions: string;
    requestStatusId: number;
    reasonOfRejection: number;
    instructions: number;
    
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
    isArchived: boolean;

    giftedBooks: GiftedBookVM[];
}