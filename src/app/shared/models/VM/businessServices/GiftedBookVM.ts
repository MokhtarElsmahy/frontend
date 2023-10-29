import { GiftRequestVM } from "./GiftRequestVM";

export class GiftedBookVM{
    id: number;
    giftRequestId: number;
    standardBookNumber: string;
    bookTitle: string;
    authorName: string;
    publisherName: string;
    publicationDate: any;
    numberOfCopies: number;
    numberOfCopiesRemaining: number;
    bookStatusId: number;

    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;

    giftRequest: GiftRequestVM;
}