import { ResearchAvailableDateVM } from "../basicData/ResearchAvailableDateVM";
import { RoomVM } from "../basicData/RoomVM";
import { ResearchRequestReplyVM } from "./ResearchRequestReplyVM";

export class ResearchRequestVM{
    
    id: number;
    userId: number;
    libraryId: number;
    roomId: number;
    researchStartDateId: number;
    researchEndDateId: number;
    requestTypeId: number;
    responsibleName: string;
    responsibleMobile: string;
    responsibleGradeId: number;
    callNum: string;
    subjectName: string;
    dateFrom: string;
    dateTo: string;
    reasonOfRejection: string;
    instructions: string;
    requestStatusId: number;
    isArchived: boolean;
    
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;

    room: RoomVM;
    researchAvailableStartDate: ResearchAvailableDateVM;
    researchAvailableEndDate: ResearchAvailableDateVM;
    researchRequestReply: ResearchRequestReplyVM;
    //CallNumbers :CallNumbers[]
}

export class CallNumbers {
    callNum : string
}
