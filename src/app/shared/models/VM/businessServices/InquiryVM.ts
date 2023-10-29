export class InquiryVM {
    id: number;
    type: number;
    visitorName: string;
    visitorEmail: string;
    visitorMobile: string;
    visitorMessage: string;
    response: string;
    isArchived: boolean;
    
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
}