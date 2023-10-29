import { ThesisDepositionRequestReplyVM } from "./ThesisDepositionRequestReplyVM";

export class ThesisDepositionRequestVM{
     id: number; 
     userId: string; 
     applicantName: string
     universityId: string;
     faculty: string;
     department: string;
     mobile: string;
     email: string;
     thesisData: string;
     thesisTitle: string;
     scientificDegree: string;
     yearOfDiscussion: string;
     numberOfPages: number;
     numberOfParts: number;
     isAvailable: boolean;
     isAvailableWithChains: boolean;
     availabilityType: number;
     thesisFile: string;
     thesisTitleFile: string;
     subjectsIndexFile: string;
     arabicExtractFile: string;
     englishExtractFile: string;
     introFile: string;
     collectionFile: string;
     quarterCollectionFile: string;
     callNum: string;
     requestStatusId: number;
     isArchived: boolean;
     reasonOfRejection: string;
     instructions: string;

     createdBy: string;
     createdDate: string;
     updatedBy: string;
     updatedDate: string;

     universityNameOutsideKingdom : string;
     isOutsideKingdom : boolean;
     country : number=1;

     thesisDepositionRequestReply: ThesisDepositionRequestReplyVM;
}