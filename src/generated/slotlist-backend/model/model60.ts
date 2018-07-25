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
import { Model59 } from './model59';


export interface Model60 {
    /**
     * UID of the slot group the slot should be added to
     */
    slotGroupUid: string;
    /**
     * Title of the slot
     */
    title: string;
    /**
     * Difficulity of the slot, ranging from 0 (easiest) to 4 (hardest)
     */
    difficulty: number;
    /**
     * Optional short description of the slot
     */
    description?: string;
    /**
     * Detailed, optional description of the mission slot, further explaining the responsibilities and the selected role
     */
    detailedDescription?: string;
    /**
     * UID of the community the slot is restricted to. Setting this to `null` removes the restriction and opens the slot to everyone
     */
    restrictedCommunityUid?: string;
    /**
     * Indicates whether the slot is a reserve slot (true, will only be assigned if all other slots have been filled) or a regular one (false)
     */
    reserve: boolean;
    /**
     * Indicates whether the slot is a blocked slot (true, no users can register) or a regular one (false). Blocked slots can be used by mission creators to manually \"assign\" slots to community or users that choose not to use slotlist.info
     */
    blocked: boolean;
    /**
     * Indicates whether the slot is auto-assignable. Auto-assignable slots do not require confirmation by a mission editor, but are automatically assigned to the first registering user (who would have thought, what a good name choice!)
     */
    autoAssignable: boolean;
    requiredDLCs: Model59;
    /**
     * Order number of slot the new slot should be inserted after. The order number created will be incremented by one and all higher order numbers adapted accordingly
     */
    insertAfter: number;
    /**
     * Indicates whether the slot is being created as a duplicate of an already existing one. Duplicated slots are handled slightly differently, mainly regarding the `autoAssignable` setting
     */
    duplicate?: boolean;
}