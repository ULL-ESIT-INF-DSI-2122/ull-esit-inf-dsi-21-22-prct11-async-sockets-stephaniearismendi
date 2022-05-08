/**
 * Notes type
 */
export type NotesType = {
    title: string;
    color: string;
    body: string;
}

/**
 * Response types
 */
export type ResponseTypes = {
    state: number;
    title?: string;
    user?: string;
    body?: string;
    color?: string;
    path?: string;
    error?: string;
    type: 'add' | 'read' | 'list' | 'remove' | 'modify';
    notes?: NotesType[];
}

/**
 * Response types
 */
export type RequestTypes = {
    user: string;
    title?: string;
    body?: string;
    color?: string;
    path?: string;
    type: 'add' | 'read' | 'list' | 'remove' | 'modify';
}