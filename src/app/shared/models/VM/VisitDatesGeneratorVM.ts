import { LibraryAvailableDayVM } from "./basicData/LibraryAvailableDayVM";
import { VisitAvailableDateVM } from "./basicData/VisitAvailableDateVM";

export class VisitDatesGeneratorVM{
    userId:string;

    startDate?: string;
    endDate?: string
    daysToGenerate?: Array<LibraryAvailableDayVM>;

    selectedDate?: string;
    selectedDatesToGenerate?: Array<VisitAvailableDateVM>;
}