## Práctica 10 - Sistema de ficheros y creación de procesos en Node.js

En esta práctica se plantearán una serie de ejercicios o retos a resolver haciendo uso de las APIs proporcionadas por Node.js para interactuar con el sistema de ficheros, así como para crear procesos.

Todo el código desarrollado estará alojado el siguiente [repositorio](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-stephaniearismendi).

# Ejercicio 1

Considerando el siguiente ejemplo de código fuente TypeScript que hace uso del módulo fs de Node.js:

```typescript

import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}

```

A continuación se mostará la traza del programa:

- Inicialmente estarán todas vacías.

![Inicialmente!](/pics-informe/1.png)

- Seguidamente, al ejecutar el programa, entra la función main() a la pila de llamadas:
    ![Main pila de llamadas!](/pics-informe/2.png)
    A partir de aquí hay dos opciones:
    - Si no se especifica un fichero por línea de comandos, entra el `console.log` a la pila de llamadas y luego se muestra por terminal:
        ![Error fichero!](/pics-informe/3.png)
    - En otro caso, la función access entará a la pila de llamadas:
        ![Bien ejecutado!](/pics-informe/4.png)
- Una vez se haya ejecutado, ``access()`` pasará al registro de eventos :
    ![Pila!](/pics-informe/5.png)
- Luego, `access()` saldrá del registro de eventos para que su manejador entre a la cola de manejadores:
    ![Cola de manejadores!](/pics-informe/6.png)
- Al estar en primer lugar en la cola de manejadores, pasará a la pila de llamadas
    ![Pila de llamadas!](/pics-informe/7.png)
- Al llegar a la zona de código del `console.log('Starting to watch file')`, este pasará a la pila de llamadas. Al ser el único proceso, procederá a ejecutarse por terminal.
    ![Pila de llamadas!](/pics-informe/8.png)
- Entra `watch(process.argv[2])` a la pila de llamadas.
    ![Pila de llamadas!](/pics-informe/9.png)
- `watch(process.argv[2])` pasa al registro de eventos de la API de Node.js: 
    ![Registro eventos!](/pics-informe/10.png)
- Entra en la pila de llamadas `console.log()`
    ![Pila de llamadas!](/pics-informe/11.png)
- Entra en terminal `console.log('File is no longer watched')`.
    ![Terminal!](/pics-informe/12.png)
- Al realizar una modificación, entra en la cola de manejadores `console.log('File has been modified')`
    ![Modified!](/pics-informe/13.png)
- Entra en la pila de llamadas 'File has been modified somehow'.
    ![Console!](/pics-informe/14.png)
- Se ejecuta por consola 'File has been modified somehow'.
    ![Modified!](/pics-informe/15.png)
- Si se realiza una modificación, se vuelven a repetir los pasos anteriores:
    ![Modified2!](/pics-informe/16.png)
    ![Modified2!](/pics-informe/17.png)
    ![Modified2!](/pics-informe/18.png)
    ![Modified2!](/pics-informe/19.png)

- La función `access` se utiliza para comprobar los permisos de un archivo o directorio determinado. Estos se pueden especificar como parámetro utilizando constantes de acceso a archivos. Las `fs.constants` son un enum que describe un flag o un indicador usado con fs. 
Estos son los valores de las distintas flags:

![flags!](/pics-informe/flags.png)

# Ejercicio 2

Se implementará un programa que devuelva el número de ocurrencias de una palabra en un fichero de texto. Para acceder al contenido del fichero se deberá expandir el comando cat de Unix/Linux, además de expandir el comando grep con la salida proporcionada por cat como entrada para obtener las líneas en las que se encuentra la palabra buscada.

```terminal

$cat prueba.txt 
Hola esto es una prueba.
Hola mi nombre es Edu y aquí hay un segundo Hola.

$cat prueba.txt | grep Hola
Hola esto es una prueba.
Hola mi nombre es Edu y aquí hay un segundo Hola

$cat prueba.txt | grep Edu
Hola mi nombre es Edu y aquí hay un segundo Hola.

```

El ejercicio se llevará a cabo de dos maneras diferentes:

- Haciendo uso del método ``pipe`` de un ``Stream`` para poder redirigir la salida de un comando hacia otro.
- Sin hacer uso del método ``pipe``, solamente creando los subprocesos necesarios y registrando manejadores a aquellos eventos necesarios para implementar la funcionalidad solicitada.

Para llevar a cabo lo anterior, se creará una clase `catApp`, recibiendo como constructor el nombre del archivo y de la palabra a buscar:

```typescript

export class CatApp {
  constructor(private fileName: string, private wordToSearch: string) {
    this.fileName = fileName;
    this.wordToSearch = wordToSearch;
  }

```

- Para el modo sin tuberías, se utilizará el siguiente método:

```typescript

  public withoutPipe() {
    const outputCount:string[]= [];
    fs.access(this.fileName, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`The file ${this.fileName} does not exist`));
      } else {
        const cat = spawn('cat', [this.fileName]);
        cat.stdout.on('data', (data) => {
          outputCount.push(data.toString());
        });
        cat.stderr.on('data', (data) => {
          console.log(chalk.red(data.toString()));
        });
        cat.on('close', (code) => {
          console.log(chalk.green(`The file ${this.fileName} has been read successfully`));
          console.log(chalk.green(`The word ${this.wordToSearch} appears ${outputCount.join('').split(this.wordToSearch).length - 1} times`));
        });
      }
    });
  }

```

Como se puede observar, se utiliza el comando cat para leer el fichero y almacenar los datos en un array. Luego, cuando se reciba el mensaje 'close' (es decir, cuando se termine de leer el fichero), se imprimirá por pantalla que se ha leído correctamente y, además, el número de veces que aparece la palabra buscada.

- Para el método sin tuberías, lo haremos de una manera diferente:

```typescript

  public withPipe() {
    fs.access(this.fileName, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`The file ${this.fileName} does not exist`));
      } else {
        const cat = spawn('cat', [this.fileName]);
        const grep = spawn('grep', ['-c', this.wordToSearch]);
        cat.stdout.pipe(grep.stdin);
        cat.stderr.on('data', (data) => {
          console.log(chalk.red(data.toString()));
        });
        cat.on('close', (code) => {
          console.log(chalk.green(`The file ${this.fileName} has been read successfully`));
          console.log(chalk.green(`The word ${this.wordToSearch} appears the following times: `));
          grep.stdout.pipe(process.stdin);
        });
      }
    });
  }

```

En este caso utilizaremos el comando cat, así como el comando grep (que nos ayudará a contar el número de palabras después de leerlas con cat). Para ello se utilizará `pipe`.

En cuanto cat reciba el mensaje 'close', se imprimirá por pantalla que el fichero ha sido leído correctamente así como la salida de stdout sobre el comando grep. 

Para el desarrollo del programa se utilizará un menú desarrollado con `yargs`.

```typescript

yargs.command({
  command: 'counter',
  describe: 'Displays how many times a word appears in a file',
  builder: {
    file: {
      describe: 'File to search in',
      demandOption: true,
      type: 'string',
    },
    word: {
      describe: 'Word to search for',
      demandOption: true,
      type: 'string',
    },
    pipe: {
      describe: 'Option to use pipes or not',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && typeof argv.word === 'string' &&
          typeof argv.pipe === 'boolean') {
      const cat = new CatApp(argv.file, argv.word);
      if (argv.pipe) {
        cat.withPipe();
      } else {
        cat.withoutPipe();
      }
    } else {
      console.log('The arguments are not valid');
    }
  },
});

yargs.parse();

```

# Ejercicio 3

A partir de la aplicación de procesamiento de notas desarrollada en la [Práctica 9](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-stephaniearismendi/tree/main/src), se desarrollará una aplicación que reciba desde la línea de comandos el nombre de un usuario de la aplicación de notas, así como la ruta donde se almacenan las notas de dicho usuario. Deberá controlar los cambios realizados sobre todo el directorio especificado al mismo tiempo que dicho usuario interactúa con la aplicación de procesamiento de notas.

Para ello, se dejará todo el código del programa tal cual estaba, añadiendo únicamente una nueva función:

```typescript

function monitor(user:string, path:string) {
  path = path + '/' + user;
  let numFicheros:number = 0;
  let oldNamefile:string = '';
  if (fs.readdirSync(path)) {
    numFicheros = fs.readdirSync(path).length;
  }
  access(path, (err) => {
    if (err) {
      console.log(chalk.red(`User ${user} doesn't have access to ${path}`));
    } else {
      watch(path, (eventType, filename) => {
        if (eventType == 'rename') {
          if (fs.readdirSync(path) && fs.readdirSync(path).length > numFicheros) {
            console.log(chalk.green(`User ${user} has added ${filename}`));
            numFicheros = fs.readdirSync(path).length;
          } else if (fs.readdirSync(path) && fs.readdirSync(path).length < numFicheros) {
            console.log(chalk.red(`User ${user} has deleted ${filename}`));
            numFicheros = fs.readdirSync(path).length;
          } else if (fs.existsSync(path + '/' + filename)) {
            console.log(chalk.yellow(`User ${user} has changed the name of ${oldNamefile} to ${filename}`));
          } else if (!fs.existsSync(path + '/' + filename)) {
            oldNamefile = filename;
          }
        } else if (eventType == 'change') {
          console.log(chalk.yellow(`User ${user} has changed the content of the file ${filename}`));
        }
      },
      );
    }
  });
}

```

Primero se comprueba que el directorio exista y se almacena el número de archivos que hay en él. Seguidamente, si no hay ningún error, se ejecutará `watch` sobre la ruta especificada. Siempre que el `EventType` sea del tipo `rename`, se comprobará si si el número de ficheros ha aumentado o disminuido (ya que eso significará que se ha borrado o eliminado un archivo). Luego de eso, se actualizará el número. En otro caso, significará que se ha renombrado un archivo.

Para controlar los cambios de contenido de un archivo se monitoriza con el `eventType` `change`, sacando un mensaje informativo por pantalla.

En este caso, se ha utilizado el siguiente código de colores para los mensajes:
    - Rojo: Se utilizará para los errores y siempre que se borre un archivo.
    - Verde: Se utilizará para los mensajes informativos de ejecuciones correctas, así como para cada vez que se agrege un nuevo archivo.
    - Amarillo: Se utilizará para informar de cualquier tipo de modificación.


- Para mostrar el contenido del fichero, en caso de que haya sido creado o modificado, usaría el comando `cat`, pero esta vez usando su salida stdout. Al igual que en el ejercicio anterior pero sin que su fin sea únicamente contar palabras coincidentes.
- Hay dos opciones: si lo que se quiere es monitorizar el directorio Notas, se podría modificar el código para que el nombre del usuario no sea obligatorio. En ese caso no se añadiría a la variable `path` la subcarpeta de usuario y se observaría toda la carpeta `Notas`.
En cambio, si lo que se quiere es que se pueda observar las dos cosas a la vez, se podría añadir otro watcher sobre la carpeta principal.

# Ejercicio 4

Se desarrollará una aplicación que permita hacer de wrapper de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación  permitirá:

- Dada una ruta concreta, mostrar si es un directorio o un fichero.
- Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.
- Listar los ficheros dentro de un directorio.
- Borrar ficheros y directorios.
- Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.

Para ello, crearemos una clase `Wrapper` con un constructor vacío. Luego, los siguientes métodos:

- ``checkIfDirectory()``.

```typescript

  public checkIfDirectory(path:string):boolean {
    let isDirectory:boolean = false;
    if (fs.existsSync(path)) {
      const stats = fs.statSync(path);
      if (stats.isDirectory()) {
        isDirectory = true;
        console.log(chalk.green(`${path} is a directory`));
      } else if (stats.isFile()) {
        isDirectory = false;
        console.log(chalk.green(`${path} is a file`));
      }
    } else {
      console.log(chalk.red(`${path} does not exist`));
    }
    return isDirectory;
  }

```

Comprueba si es un directorio o es un archivo utilizando `fs.statSync`. Devuelve un booleano (true si es un directorio, false en caso contrario).

- `createDirectory()`.

```typescript

  public createDirectory(path:string):void {
    access(path, constants.F_OK, (err) => {
      if (err) {
        const mkdir = spawn('mkdir', ['-p', path]);
        mkdir.stderr.on('data', (data) => {
          console.log(chalk.red(`${data}`));
        });
        mkdir.on('close', (code) => {
          if (code === 0) {
            console.log(chalk.green(`${path} created`));
          } else {
            console.log(chalk.red(`${path} could not be created`));
          }
        });
      } else {
        console.log(chalk.red(`${path} already exists`));
      }
    });
  }


```

Recibe una ruta como parámetro y, en caso de que el directorio no exista ya, lo crea. en otro caso muestra un mensaje de error. Usa el comando mkdir de linux. 

- `listDirectory`

```typescript

  public listDirectory(path:string):void {
    access(path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`${path} does not exist`));
      } else {
        console.log(chalk.green(`${path} content: `));
        const ls = spawn('ls', ['-l', path]);
        ls.stderr.on('data', (data) => {
          console.log(chalk.red(`${data}`));
        });
        ls.stdout.on('data', (data) => {
          console.log(chalk.green(`${data}`));
        });
      }
    });
  }

```

Si existe un directorio en la ruta pasada como parámetro, se lee todo su contenido con el comando ls -l

- `showContentFile`.

```typescript

  public showContentFile(path:string):void {
    access(path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`${path} does not exist`));
      } else {
        console.log(chalk.green(`File ${path} exists. It contains: `));
        const content = fs.readFileSync(path, 'utf8');
        console.log(chalk.green(`${content}`));
      }
    });
  }

```

Si existe el archivo especificado por parámetro se leerá su contenido y se imprimirá por pantalla. En otro caso, se dirá que no existe.

- `deleteFileAndDirectory`.

```typescript

  public deleteFileAndDirectory(path:string):void {
    access(path, constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red(`${path} does not exist`));
      } else {
        const rm = spawn('rm', ['-rf', path]);
        rm.stderr.on('data', (data) => {
          console.log(chalk.red(`${data}`));
        });
        rm.on('close', (code) => {
          console.log(chalk.green(`${path} has been deleted`));
        });
      }
    });
  }

```

Se utiliza el comando rm de forma recursiva para eliminar cualquier archivo o directorio, esté o no vacío.

- `moveAndCopy`.

```typescript

  public moveAndCopy(path:string, newPath:string) {
    if (fs.existsSync(path)) {
      const mv = spawn('mv', [path, newPath]);
      mv.stderr.on('data', (data) => {
        console.log(chalk.red(`${data}`));
      });
      mv.on('close', (code) => {
        console.log(chalk.green(`${path} has been moved to ${newPath}`));
      });
    } else {
      console.log(chalk.red(`${path} does not exist`));
    }
  }

```

Se hará uso del comando de linux `mv` para mover un directorio a una nueva ruta especificada. Antes que nada, se comprobará si el directorio a mover existe, y en otro caso se lanza un mensaje informativo.

Para el funcionamiento general del programa se utilizará `yargs`.

- Controlador de ``checkIfDirectory``

```typescript

yargs.command({
  command: 'type',
  describe: 'checks if a path is a file or a directory',
  builder: {
    path: {
      describe: 'path to check',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const wrapper = new Wrapper();
      wrapper.checkIfDirectory(argv.path);
    }
  },
});

```

- Controlador de ``createDirectory``.

```typescript

yargs.command({
  command: 'create-directory',
  describe: 'creates a directory',
  builder: {
    path: {
      describe: 'directory path to create',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const wrapper = new Wrapper();
      wrapper.createDirectory(argv.path);
    }
  },
});

```

- Controlador de ``listDirectory``

```typescript

yargs.command({
  command: 'list',
  describe: 'lists the content of a directory',
  builder: {
    path: {
      describe: 'directory path to list',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const wrapper = new Wrapper();
      wrapper.listDirectory(argv.path);
    }
  },
});

```

- Controlador de ``showContentFile``

```typescript

yargs.command({
  command: 'show',
  describe: 'shows the content of a file',
  builder: {
    path: {
      describe: 'path of the file to show',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const wrapper = new Wrapper();
      wrapper.showContentFile(argv.path);
    }
  },
});

```

- Controlador de `deleteFileAndDirectory`

```typescript

yargs.command({
  command: 'remove',
  describe: 'delete a file or a directory',
  builder: {
    path: {
      describe: 'path of the file or directory to delete',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      const wrapper = new Wrapper();
      wrapper.deleteFileAndDirectory(argv.path);
    }
  },
});

```

- Controlador de ``moveAndCopy``.

```typescript
yargs.command({
  command: 'move',
  describe: 'move a file or a directory to another',
  builder: {
    path: {
      describe: 'path of the file or directory to move',
      demandOption: true,
      type: 'string',
    },
    newPath: {
      describe: 'new path of the file or directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string' && typeof argv.newPath === 'string') {
      const wrapper = new Wrapper();
      wrapper.moveAndCopy(argv.path, argv.newPath);
    }
  },
});

```