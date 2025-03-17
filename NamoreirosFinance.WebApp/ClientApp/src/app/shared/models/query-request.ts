export class QueryRequest {
    constructor(init?: Partial<QueryRequest>) {
        Object.assign(this, init);
    }

    skip: number = 0;
    take: number = 10;
    sortProperty?: string;
    ascending: boolean = false;
    filteredProperty?: string;
    filteredValue?: string;
}