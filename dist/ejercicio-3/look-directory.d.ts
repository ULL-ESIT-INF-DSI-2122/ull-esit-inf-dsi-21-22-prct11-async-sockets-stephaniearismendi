/**
 * Function that checks the changes on a directory. It will show a message if:
 * - a file is created
 * - a file is deleted
 * - a file is modified
 * - a file is renamed
 * @param user name of the user
 * @param path path of the directory
 */
export declare function monitor(user: string, path: string): void;
