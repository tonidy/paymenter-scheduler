export interface BaseResponse<T> {
    success: boolean;
    message: string;
    data: T;
    metadata?: {
        total_items: number;
        total_pages: number;
        max_per_page: number;
        item_count: number;
    };
}
