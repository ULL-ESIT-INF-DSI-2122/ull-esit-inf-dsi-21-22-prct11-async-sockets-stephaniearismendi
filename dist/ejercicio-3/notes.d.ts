/**
 * Class establishing the pattern that each note will follow
 */
export declare class Notes {
    private _path;
    constructor();
    /**
     * Path Setter
     */
    private setPath;
    /**
     * Method that creates a directory to store the notes
     * of each user. First check if the directory already exists.
     */
    private createFolder;
    /**
     * Method that reads a JSON file and returns the content
     */
    private readJSON;
    /**
     * Method that creates a note
     * @param user name of the user
     * @param title title of the note
     * @param body body of the note
     * @param color color of the note
     */
    createNote(user: string, title: string, body: string, color: string): number;
    /**
     * Auxiliary method that performs the task
     * of printing a string with the chosen color.
     * @param color selected color
     * @param cadena string to print
     */
    private printColor;
    /**
     * Method that searches for a note and prints it
     */
    readNote(user: string, title: string): number;
    /**
     * Method that lists all the notes of a user
     * @param user name of the user
     */
    listNotes(user: string): number;
    /**
     * Method that deletes a note
     * @param user name of the user
     * @param title title of the note
     */
    deleteNote(user: string, title: string): number;
    /**
     * Method that updates a note
     * @param user name of the user
     * @param title title of the note
     * @param body new body of the note
     * @param color new color of the note
     */
    editNote(user: string, title: string, body: string, color: string): number;
}
