/**
 * slotlist.info API Documentation
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0-beta32
 * Contact: nick@slotlist.info
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


/**
 * Information returned for Forbidden responses
 */
export interface Forbidden {
    /**
     * HTTP status code caused by the error
     */
    statusCode: number;
    /**
     * HTTP status code text respresentation
     */
    error: Forbidden.ErrorEnum;
    /**
     * Message further describing the error
     */
    message: Forbidden.MessageEnum;
}
export namespace Forbidden {
    export type ErrorEnum = 'Forbidden';
    export const ErrorEnum = {
        Forbidden: 'Forbidden' as ErrorEnum
    }
    export type MessageEnum = 'Forbidden';
    export const MessageEnum = {
        Forbidden: 'Forbidden' as MessageEnum
    }
}