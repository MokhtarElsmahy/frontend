import { LibraryAvailableDayVM } from "./LibraryAvailableDayVM";

export class VisitAvailableDateVM {
    id: number;
    libraryId?: number;
    periodId?: number;
    date: string;
    visitStatusId: number;
    visitRequestId: number;
    
    createdBy: string;
    createdDate: string
    updatedBy: string;
    updatedDate: string;

    libraryAvailableDay: LibraryAvailableDayVM;
}