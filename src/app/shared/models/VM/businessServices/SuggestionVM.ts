export class SuggestionVM {
    id: number;
    visitorName: string;
    visitorEmail: string;
    visitorMobile: string;
    qualifications: string;
    suggestedBookTitle: string;
    authorName: string;
    publisherName: string;
    placeOfPublication: string;
    yearOfPublication: string;
    standardBookNumber: string;
    bookTypeId: number;
    additionalInformation: string;
    isArchived: boolean;
    
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
}