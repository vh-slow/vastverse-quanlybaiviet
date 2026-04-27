export interface Pagination<T = any> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
}
