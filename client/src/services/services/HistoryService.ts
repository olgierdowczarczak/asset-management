import type { AxiosInstance } from 'axios';

interface HistoryParams {
    page?: number;
    limit?: number;
    resourceType?: string;
    resourceId?: number;
    dateFrom?: string;
    dateTo?: string;
    performedBy?: number;
    assigneeId?: number;
    searchTerm?: string;
    action?: string;
}

class HistoryService {
    private client: AxiosInstance;
    private endpoint: string;

    constructor(client: AxiosInstance, endpoint: string) {
        this.client = client;
        this.endpoint = endpoint;
    }

    async getAll(params: HistoryParams = {}) {
        const {
            page = 1,
            limit = 50,
            resourceType,
            resourceId,
            dateFrom,
            dateTo,
            performedBy,
            assigneeId,
            searchTerm,
            action,
        } = params;
        const queryParams: any = { page, limit };

        if (resourceType) {
            queryParams.resourceType = resourceType;
        }
        if (resourceId) {
            queryParams.resourceId = resourceId;
        }
        if (dateFrom) {
            queryParams.dateFrom = dateFrom;
        }
        if (dateTo) {
            queryParams.dateTo = dateTo;
        }
        if (performedBy) {
            queryParams.performedBy = performedBy;
        }
        if (assigneeId) {
            queryParams.assigneeId = assigneeId;
        }
        if (searchTerm) {
            queryParams.searchTerm = searchTerm;
        }
        if (action) {
            queryParams.action = action;
        }

        const response = await this.client.get(this.endpoint, { params: queryParams });
        return response.data;
    }

    async getResourceHistory(resourceType: string, resourceId: number, page = 1, limit = 50) {
        const response = await this.client.get(
            `${this.endpoint}/resource/${resourceType}/${resourceId}`,
            { params: { page, limit } },
        );
        return response.data;
    }

    async getUserHistory(userId: number, page = 1, limit = 50) {
        const response = await this.client.get(`${this.endpoint}/user/${userId}`, {
            params: { page, limit },
        });
        return response.data;
    }
}

export default HistoryService;
