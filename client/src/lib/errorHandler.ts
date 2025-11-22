import { AxiosError } from 'axios';

export const extractErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
                return error.response.data;
            }
            if (error.response.data.message) {
                return error.response.data.message;
            }
        }

        if (error.message) {
            return error.message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
};
