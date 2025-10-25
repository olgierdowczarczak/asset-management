const validateError = (error: any, optionalMessage: string = '', printingError: boolean=false): string => {
    if (printingError) {
        console.log(error);
    }
    return error.response?.data?.message || optionalMessage;
};

export default validateError;