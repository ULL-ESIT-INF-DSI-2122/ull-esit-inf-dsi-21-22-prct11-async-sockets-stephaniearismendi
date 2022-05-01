export declare class Wrapper {
    constructor();
    /**
     * Method that checks if path is a file or a directory
     * @param path path to analyze
     * @returns true if the path is a directory, false otherwise
     */
    checkIfDirectory(path: string): boolean;
    /**
     * Method that creates a directory
     * @param path path to the new directory
     */
    createDirectory(path: string): void;
    /**
     * Method that lists the content of a directory
     * @param path path to the file
     */
    listDirectory(path: string): void;
    /**
     * Method that shows the content of a file
     * @param path path to the file
     */
    showContentFile(path: string): void;
    /**
     * Method that deletes a file or a directory
     * @param path path to the file
     */
    deleteFileAndDirectory(path: string): void;
    /**
     * Method that moves a file or a directory to a new location
     * @param path old path
     * @param newPath new path
     */
    moveAndCopy(path: string, newPath: string): void;
}
