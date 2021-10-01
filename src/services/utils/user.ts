import { User } from '@/models';

/**
 * Check whether to users are equal. This is not completely straight forward, because
 * we can have external users, which do not have a uid.
 * @param a First user
 * @param b second user
 * @returns Users are equal?
 */
export function equalUsers (a: User, b: User): boolean {
    if (a.uid !== b.uid) return false;

    return a.username === b.username && a.userslug === b.userslug && a['icon:text'] === b['icon:text'];
}
