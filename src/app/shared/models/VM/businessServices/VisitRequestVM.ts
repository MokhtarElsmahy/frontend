import { VisitAvailableDateVM } from "../basicData/VisitAvailableDateVM";
import { VisitRequestReplyVM } from "./VisitRequestReplyVM";

export class VisitRequestVM {
    id: number;
    userId: string;
    libraryId: number;
    visitDateId: number;
    authority: number;
    responsibleName: string;
    responsibleMobile: string;
    responsibleEmail: string;
    numberOfVisitors: number;
    visitReason: number;
    reasonOfRejection: string;
    instructions: string;
    requestStatusId: number;
    isArchived: boolean;
    
    createdBy:string;
    createdDate:Date;
    updatedBy:string;
    updatedDate:Date;

    visitAvailableDate: VisitAvailableDateVM;
    visitRequestReply: VisitRequestReplyVM;
}