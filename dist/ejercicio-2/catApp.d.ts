/**
 * @description Class that searches for a word in a file
 * @var {string} fileName - File to search in
 * @var {string} wordToSearch - Word to search for
 */
export declare class CatApp {
    private fileName;
    private wordToSearch;
    constructor(fileName: string, wordToSearch: string);
    /**
     * @description This method will search for the word in the file without using pipes
     */
    withoutPipe(): void;
    /**
     * @description This method will search for the word in the file using pipes
     */
    withPipe(): void;
}
