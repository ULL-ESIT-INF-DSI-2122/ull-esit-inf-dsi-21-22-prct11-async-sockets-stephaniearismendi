/**
 * Clase Watcher que permite observar un fichero y ejecutar distintas acciones
 */
export declare class Watcher {
    private commands;
    private results;
    constructor(commands: string[]);
    /**
     * Método que inicia el watcher
     */
    init(): void;
    /**
     * Método que ejecuta ls -l -h cada vez que el archivo se modifica
     */
    private changeHandler;
}
