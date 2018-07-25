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


export interface Model53 {
    /**
     * UID of the user to grant permission to
     */
    userUid: string;
    /**
     * Permission to grant
     */
    permission: string;
    /**
     * Allows for notifications caused by the endpoint changes to be suppressed. \"Destructive\" actions such as slot unassignments, permission removals or mission deletions cannot be suppressed
     */
    suppressNotifications?: boolean;
}