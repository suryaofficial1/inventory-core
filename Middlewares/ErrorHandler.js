import logger from "../core/app-loger.js";
import { getErrorObject } from "../utils/responseUtil.js";

export const errorMessage = {
    validationError: "Validation Error",
    resourceNotFound: "Resource Not Found Error",
    unauthorized: "Unauthorized",
    forbidden: "Forbidden",
    tooManyRequests: "Too Many Requests",
    badRequest: "Bad Request",
    internalServerError: "Internal Server Error",
    invalidCode: "Invalid Code",
};

class ErrorHandler {
    async handleError(error, responseStream) {
        if (error instanceof AppError) {
            if (error.httpCode !== 404) {
                logger.error("Error Handler: ", error);
            }
            responseStream.send(getErrorObject(error.httpCode, error.description, error.data));
        } else if (error instanceof UserAccountDeactivatedError) {
            logger.error("Error Handler: ", error);
            responseStream.status(409).send(getErrorObject(409, "User account deleted"));
        } else {
            logger.error("Error Handler: ", error);
            responseStream.send(getErrorObject(500, "Internal Server Error"));
        }
    }

    handleUncaughtError(error) {
        logger.error("Uncaught Error:", error);
    }
}

/**
 * Represents an application-specific error.
 * @param {string} name - The name of the error.
 * @param {number} httpCode - The HTTP status code associated with the error.
 * @param {string} description - A brief description of the error.
 * @param {object} [data={}] - Additional data related to the error.
 */
export class AppError extends Error {
    constructor(name, httpCode, description, data = {}) {
        super(description);

        this.name = name;
        this.httpCode = httpCode;
        this.description = description;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = new ErrorHandler();
