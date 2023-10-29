    export enum InquiryTypesEnum //=> Not included in the commons table
    {
        Librarian = 1,
       // LibraryRelations = 2,
        TechnicalSupport = 3,
        MaleHaramMacciLib = 40,
        FemaleHaramMacciLib = 50,
        HaramMosqueLib = 60
    }
    export enum AuthorityTypesEnum //=> Not included in the commons table
    {
        School = 1,
        Corporation = 2,
        Directory = 3
    }
    export enum ThesisAvailabilityTypesEnum //=> Not included in the commons table
    {
        Type1 = 1,
        Type2 = 2,
        Type3 = 3,
        Type4 = 4
    }
    export enum RequestStatusEnum {
        Pending = 4,
        Approved = 5,
        Rejected = 6,
        Canceled = 7
    }
    export enum DateStatusEnum {
        Available = 8,
        Reserved = 9
    }
    export enum ResearchRequestTypesEnum {
        Research = 11,
        Subject = 12,
        ResearchWithSubject = 13
    }
    export enum GradesEnum {
        DoctoralStudent = 14,
        MasterStudent = 15,
        DoctoralOrMasterStudentPresidencyStaff = 16
    }
    export enum BookTypesEnum {
        Electronic = 18,
        Sheets = 19
    }
    export enum BookGiftServiceEnum {
        Recieved = 20,
        NotRecieved = 21,
        Givable = 22,
        NotGivable = 23
    }
    export enum GiftTypesEnum {
        PrivateLibrary = 24,
        IndividualBooks = 25
    }
    export enum BooksAdditionTypesEnum {
        AddToBooksGroup = 26,
        AddToInternalAndExternalGiftingDepartments = 27
    }