import logger from "../core/app-logger.js";

export const getSuccessObject = (result = {}) => {
    let response = {
        status: 200,
        message: 'success',
        data: result
    };
    return response;
};

export const getErrorObject = (statusCode, message, data = {}) => {
    logger.error(`Response sent with code ${statusCode}, message: ${message}, data: ${JSON.stringify(data)}`);
    let response = {
        status: statusCode,
        message: message,
        data: data
    };
    return response;
};