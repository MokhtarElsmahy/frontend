export class ServiceRatingVM {
    id: number;
    userId: string; 
    serviceType: number; 
    requestId: number;
    rate: number;

    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
}