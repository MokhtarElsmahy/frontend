export class LibraryExchangeRequestVM {
    id: number;
    userId: string;
    beneficiaryName: string;
    beneficiaryMobile: string;
    beneficiaryEmail: string;

   
  
    requestStatusId: number;
    isArchived: boolean | null;
    reasonOfRejection: string;
    instructions: string;
    createdBy: string;
    createdDate: Date | null;
    updatedBy: string;
    updatedDate: Date | null;
    exchangeBooks: LibraryExchangeBookVM[];
}

export class LibraryExchangeBookVM {
    id: number;
    libraryRequestId: number;
    standardBookNumber: string;
    bookTitle: string;
    authorName: string;
    publisher: string;
    publicationDate: Date | null;
    numberOfCopies: number;
    numberOfNeededCopies: number;
    numberOfCopiesRemaining: number;
    bookStatusId: number;
    sourceId: number;
    OtherSource: string;
    createdBy: string;
    createdDate: Date | null;
    updatedBy: string;
    updatedDate: Date | null;
    replicaStandardBookNumber: string;
    replicaBookTitle: string;
    replicaAuthorName: string;
    replicaPublicationDate: Date | null;
    replicaNumberOfCopies: number;
    replicaPublisher: string;
    isChecked: boolean | null;
}

export class LibraryExchangeSourceVM {
    id: number;
    source: string;
}