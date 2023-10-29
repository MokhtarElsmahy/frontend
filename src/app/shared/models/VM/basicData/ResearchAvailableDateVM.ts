import { RoomAvailableDayVM } from "./RoomAvailableDayVM";

export class ResearchAvailableDateVM {
    id: number;
    roomId?: number;
    date: string;
    researchStatusId: number;
    researchRequestId: number;
    
    createdBy: string;
    createdDate: string
    updatedBy: string;
    updatedDate: string;

    roomAvailableDay: RoomAvailableDayVM;
}