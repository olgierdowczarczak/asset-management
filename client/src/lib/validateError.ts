const validateError = (
    error: any,
    optionalMessage: string = '',
    printingError: boolean = true,
): string => {
    if (printingError) {
        console.error('Error:', error);
    }

    if (error.response) {
        return error.response.data?.message || error.response.data || optionalMessage;
    } else if (error.request) {
        return 'No response from server';
    } else {
        return error.message || optionalMessage;
    }
};

export default validateError;
