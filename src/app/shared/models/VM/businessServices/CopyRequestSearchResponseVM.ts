export class CopyRequestSearchResponseVM {
    totalRecords: number;
    instances: Instance[];
}

export class Instance {
    id: string;
    title: string;
    contributors: Contributor[];
    publication: Publication[];
    staffSuppress: boolean;
    discoverySuppress: boolean;
    isChecked :boolean = false;
}

export class Contributor {
    name: string;
    contributorNameTypeId: string;
    primary: boolean;
}

export class Publication {
    publisher: string;
    dateOfPublication: string;
}