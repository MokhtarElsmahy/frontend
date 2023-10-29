export class SelectiveBroadcastVm {
    id: number;
    beneficiaryName: string;
    beneficiaryEmail: string;
    beneficiaryMobile: string;
    requestStatusId: number;
    createdBy: string;
    createdDate: Date | null;
    updatedBy: string;
    updatedDate: Date | null;
    isArchived: boolean;
    selectivebroadcastItems: SelectiveBroadcastItemVm[];
}

export class SelectiveBroadcastItemVm {
    id: number;
    requestId: number;
    subId: number;
    subText :string
    mainId: number;
    mainText:string;
    statusId: number;
    mainClassification: MainClassificationVM;
    subClassification: SubClassificationVM;
}
export class MainClassificationVM {
    id: number;
    name: string;
    dewey: string;
}

export class SubClassificationVM {
    id: number;
    name: string;
    dewey: string;
    mainClassificationId:number
}

export class EmpSelectiveBroadcastItem {
    count: number;
    id: number;
    beneficiaryName: string;
}