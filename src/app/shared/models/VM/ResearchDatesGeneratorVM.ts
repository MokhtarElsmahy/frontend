import { RoomAvailableDayVM } from "./basicData/RoomAvailableDayVM";
import { ResearchAvailableDateVM } from "./basicData/ResearchAvailableDateVM";

export class ResearchDatesGeneratorVM{
    userId:string;

    startDate?: string;
    endDate?: string
    daysToGenerate?: Array<RoomAvailableDayVM>;

    selectedDate?: string;
}