export class QueryRequest {
    skip: number = 0;
    take: number = 0;
    sortProperty: string = "";
    ascending: boolean = false;
    filteredProperty: string = "";
    filteredValue: string = "";
}