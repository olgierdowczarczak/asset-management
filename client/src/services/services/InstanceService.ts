import type { AxiosInstance } from 'axios';
import Service from './Service';

class InstanceService extends Service {
    constructor(client: AxiosInstance, route: string) {
        super(client, route);
    }

    async getInstances(parentId: number, page: number = 1, limit: number = 10) {
        return this.sendRequest('get', `/:id/instances`, {
            params: { id: parentId },
            query: { page, limit },
        });
    }

    async getInstance(parentId: number, instanceId: number) {
        return this.sendRequest('get', `/:id/instances/:instanceId`, {
            params: { id: parentId, instanceId },
        });
    }

    async createInstance(parentId: number, data: any) {
        return this.sendRequest('post', `/:id/instances`, {
            params: { id: parentId },
            body: data,
        });
    }

    async editInstance(parentId: number, instanceId: number, data: any) {
        return this.sendRequest('patch', `/:id/instances/:instanceId`, {
            params: { id: parentId, instanceId },
            body: data,
        });
    }

    async deleteInstance(parentId: number, instanceId: number) {
        return this.sendRequest('delete', `/:id/instances/:instanceId`, {
            params: { id: parentId, instanceId },
        });
    }

    async getStats() {
        return this.sendRequest('get', `/instances/stats`);
    }

    async checkInInstance(parentId: number, instanceId: number) {
        return this.sendRequest('post', `/:id/instances/:instanceId/checkin`, {
            params: { id: parentId, instanceId },
        });
    }

    async checkOutInstance(
        parentId: number,
        instanceId: number,
        data: {
            assigneeModel: string;
            actualAssigneeModel: string;
            assignee: number;
        },
    ) {
        return this.sendRequest('post', `/:id/instances/:instanceId/checkout`, {
            params: { id: parentId, instanceId },
            body: data,
        });
    }
}

export default InstanceService;
