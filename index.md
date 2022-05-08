## Práctica 11 - Implementación de un cliente y un servidor de la aplicación de procesamiento de notas mediante Sockets en Node.js

En esta práctica se partirá de la implementación de la aplicación de procesamiento de notas de texto que llevó a cabo en la Práctica 9 para escribir un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo net de Node.js.

Todo el código desarrollado estará alojado el siguiente [repositorio](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-stephaniearismendi).

# Descripción de los requisitos de la aplicación de procesamiento de notas de texto

Los requisitos que cumplirá la aplicación de procesamiento de notas de texto, detalladamente, son los siguientes:

1. La aplicación de notas deberá permitir que múltiples usuarios interactúen con ella, pero no simultáneamente.

2. Una nota estará formada, como mínimo, por un título, un cuerpo y un color (rojo, verde, azul o amarillo).

3. Cada usuario tendrá su propia lista de notas, con la que podrá llevar a cabo las siguientes operaciones:

- Añadir una nota a la lista. Antes de añadir una nota a la lista se debe comprobar si ya existe una nota con el mismo título. En caso de que así fuera, deberá mostrarse un mensaje de error por la consola. En caso contrario, se añadirá la nueva nota a la lista y se mostrará un mensaje informativo por la consola.

- Modificar una nota de la lista. Antes de modificar una nota, previamente se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Si existe, se procede a su modificación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

- Eliminar una nota de la lista. Antes de eliminar una nota, previamente se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

- Listar los títulos de las notas de la lista. Los títulos de las notas deben mostrarse por la consola con el color correspondiente de cada una de ellas. 

- Leer una nota concreta de la lista. Antes de mostrar el título y el cuerpo de la nota que se quiere leer, se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Si existe, se mostrará el título y cuerpo de la nota por la consola con el color correspondiente de la nota. Para ello, use el paquete chalk. En caso contrario, se mostrará un mensaje de error por la consola.

- Todos los mensajes informativos se mostrarán con color verde, mientras que los mensajes de error se mostrarán con color rojo. 

- Hacer persistente la lista de notas de cada usuario. Aquí es donde entra en juego el uso de la API síncrona de Node.js para trabajar con el sistema de ficheros:

    - Guardar cada nota de la lista a un fichero con formato JSON. Los ficheros JSON correspondientes a las notas de un usuario concreto deberán almacenarse en un directorio con el nombre de dicho usuario.

    - Cargar una nota desde los diferentes ficheros con formato JSON almacenados en el directorio del usuario correspondiente.

1. Un usuario solo puede interactuar con la aplicación de procesamiento de notas de texto a través de la línea de comandos. Los diferentes comandos, opciones de los mismos, así como manejadores asociados a cada uno de ellos deben gestionarse mediante el uso del paquete yargs.

> Para los colores del texto se utilizará el paquete `chalk`.


# Implementación de la aplicación

Primero crearemos los tipos de solicitudes y respuestas:


```typescript
export type NotesType = {
    title: string;
    color: string;
    body: string;
}

```

Simplificamos los atributos de Notas a los tres que necesitaremos en los comandos para llevar a cabo la impresión de contenido, que vendrían a ser título, cuerpo y color. Serán atributos obligatorios.

```typescript

export type ResponseTypes = {
    state: number;
    title?: string;
    user?: string;
    body?: string;
    color?: string;
    error?: string;
    type: 'add' | 'read' | 'list' | 'remove' | 'modify';
    notes?: NotesType[];
}

```

En las respuestas tenemos, como atributo obligatorio, el estado y el tipo. Estos dos nos informarán del comando ejecutado y de si se realizó correctamente o no. De resto, son los atributos que nos dan información sobre la nota, y son opcionales. Error contendrá los mensajes de errores, en caso de que algo salga mal, para que sea más especifico. Notes, en cambio, será un array de Notas.

```typescript

export type RequestTypes = {
    user: string;
    title?: string;
    body?: string;
    color?: string;
    type: 'add' | 'read' | 'list' | 'remove' | 'modify';
}

```

En este caso tendremos el tipo de las respuestas, que siempre tendrán que contener el usuario y el tipo de comando utilizado. El título, el cuerpo y el color serán parámetros opcionales, ya que no en todos los ejemplos aparecen.

Seguidamente, crearemos la clase `EventEmitterController`, que será la encargada de extender `EventEmitter` y controlar la emisión y recepción de datos por _chunks_, es decir, trozos de mensajes. 

```typescript
export class MessageEventEmitterController extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let wholeData = '';
    connection.on('data', (dataChunk) => {
      wholeData += dataChunk;

      let messageLimit = wholeData.indexOf('\n');
      while (messageLimit !== -1) {
        const message = wholeData.substring(0, messageLimit);
        wholeData = wholeData.substring(messageLimit + 1);
        this.emit('message', JSON.parse(message));
        messageLimit = wholeData.indexOf('\n');
      }
    });
  }
}
```

En `Notes` tendremos las mismas funciones que en la práctica 9, descritas en su [informe](https://ull-esit-inf-dsi-2122.github.io/ull-esit-inf-dsi-21-22-prct09-filesystem-notes-app-stephaniearismendi/). La única diferencia es que, en vez de `console.log` se utilizará un JSON para almacenar las salidas de los métodos, así como sus errores. Todas las funciones retornarán un JSON.

En `server.ts` tenemos la clase `MessageEventEmitterServer`, que extiene de `EventEmitter`. El constructor recibirá un número de puerto o establecerá el 6060 por defecto. Luego, se abrirá un servidor y, una vez reciba el mensaje completo, según el tipo de comando a utilizar, ejecutará el método y copiará el JSON en la respuesta.

```typescript

  constructor(port?:number) {
    super();
    this._port = port || 6060;
    const Nota = new Notes();
    const server = net.createServer((socket) => {
      console.log(chalk.green('Connection established'));
      const socketController = new MessageEventEmitterController(socket);
      socketController.on('message', (message) => {
        const request = message;
        console.log(chalk.green(`Received request.`));
        switch (request.type) {
          case 'add':
            console.log(chalk.green(`Adding note.`));
            this._response = Nota.createNote(request.user, request.title, request.body, request.color);
            break;
          case 'read':
            console.log(chalk.green(`Reading note.`));
            this._response = Nota.readNote(request.user, request.title);
            break;
          case 'list':
            console.log(chalk.green(`Listing notes.`));
            this._response = Nota.listNotes(request.user);
            break;
          case 'remove':
            console.log(chalk.green(`Removing note.`));
            this._response = Nota.deleteNote(request.user, request.title);
            break;
          case 'modify':
            console.log(chalk.green(`Modifying note.`));
            this._response = Nota.editNote(request.user, request.title, request.body, request.color);
            break;
          default:
            console.log(chalk.red(`Error: Unknown request type.`));
            this._response.state = 0;
            this._response.error = 'Unknown request type.';
            break;
        }
      }
    }
  }
```

Finalmente, se enviará el JSON con la respuesta.

```typescript
        socket.write(JSON.stringify(this._response) + '\n', (err:any) => {
          if (err) {
            console.log(chalk.red('Error: ' + err));
          } else {
            console.log(chalk.green('Response sent'));
          }
        });
```

En el cliente, en cambio, lo primero que enontramos es una función auxiliar llamada `printColor`. Esta lo que hace es imprimir una cadena del color especificado. 

Seguidamente se abre una conexión cliente en el puerto 6060, y más abajo tenemos toda la sección de comandos, también explicados en el informe de la práctica 9.

```typescript

const client = net.connect({port: 6060}); // default port
const socket = new MessageEventEmitterController(client);

```

Una vez se recibe un comando por terminal, el cliente envía una petición al server en formato JSON con los datos especificados por yargs. 

```typescript

client.write(JSON.stringify(_request) + '\n', (err:any) => {
  if (err) {
    console.log(chalk.red('Error: ' + err));
  } else {
    console.log(chalk.green('Request sent'));
  };
});

```

Se queda a la espera hasta que recibe una respuesta, que parsea el JSON y, en caso de que el estado de la respuesta sea correcto, emite la salida de cada comando (según su tipo). En cambio, si hubo algún error también lo mostrará por consola.

```typescript

socket.on('message', (data) => {
  const aux:any = JSON.stringify(data); // fix parsing error
  const response:any = JSON.parse(aux);
  if (response.state === 1) {
    if (response.type === 'add') {
      console.log(chalk.green(`Note ${response.title} added`));
    } else if (response.type === 'read') {
      console.log(chalk.green(`Note ${response.title} contains the following: `));
      printColor(response.color, response.body);
    } else if (response.type === 'list') {
      console.log(chalk.green(`List of notes for ${response.user}`));
      response.notes.forEach((note:any) => {
        console.log(chalk.green(`Title: ${note.title}`));
        console.log(chalk.green('-----------------------------------------------------'));
        printColor(note.color, note.body);
      },
      );
    } else if (response.type === 'remove') {
      console.log(chalk.green(`Note ${response.title} removed`));
    } else if (response.type === 'modify') {
      console.log(chalk.green(`Note ${response.title} modified`));
    }
  } else {
    console.log(chalk.red(`Error: ${response.error}`));
  }
  client.destroy(); // kill client after server's response
},
);

```

Una vez se emita por consola la salida del comando solicitado terminará la conexión con el servidor, teniendo que abrir una nueva en caso de así desearlo. 

# Pruebas

Para comprobar el correcto funcionamiento del programa se utilizan `mocha` y `chai`. Pueden encontrarse en esta [carpeta](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-stephaniearismendi/tree/master/test).

  Tests EventEmitterController Methods   
    ✓ There must be a class EventEmitterController   
    ✓ Should emit a message event once it gets a complete message   

  Tests Notes Methods   
    ✓ There must be a class Notes  
    ✓ deleteNote test1 must work because it exists   
    ✓ deleteNote test1 must fail because it does not exists   
    ✓ Create test1 must work    
    ✓ Create test4 green must work     
    ✓ Create test6 yellow must work   
    ✓ Create test8 blue must work   
    ✓ Create test1 must fail because it already exists   
    ✓ Create test1 must fail because it already exists   
    ✓ Read Note exists   
    ✓ Read test4 green must work   
    ✓ Read test6 yellow must work   
    ✓ Read test8 blue must work   
    ✓ Read Note Red must work   
    ✓ Read Note Red must fail because the note does not exists   
    ✓ List Notes exists   
    ✓ List Notes => steph must work   
    ✓ List Notes => usertest must fail because the user has not created any notes   
    ✓ List Notes => usertest must fail because the user has deleted all its notes   
    ✓ EditNote test1 must work   
    ✓ EditNote test99 must fail because it does not exists   


  23 passing (79ms)   

---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------|---------|----------|---------|---------|-------------------
All files                  |   98.52 |    92.85 |     100 |    98.5 |                   
 EventEmitterController.ts |     100 |      100 |     100 |     100 |                   
 NotesApp.ts               |   98.21 |    92.85 |     100 |   98.18 | 130               
---------------------------|---------|----------|---------|---------|-------------------

> La carpeta ``usuarioPrueba`` deberá borrarse cada vez que se ejecuten los test, ya que sino no funcionarán a la siguiente ejecución.

A continuación se mostrarán ejemplos de uso de la aplicación:

# Ejemplos de uso de la aplicación

```terminal
$node dist/notes-app.js add --user="steph" --title="Red note" --body="This is a red note" --color="red"
New note added!
$node dist/notes-app.js list --user="steph"
Your notes
Red note
$node dist/notes-app.js add --user="steph" --title="Red note" --body="This is a second red note" --color="red"
Note title taken!
$node dist/notes-app.js add --user="steph" --title="Yellow note" --body="This is a yellow note" --color="yellow"
New note added!
$node dist/notes-app.js list --user="steph" 
Your notes
Red note
Yellow note
$node dist/notes-app.js read --user="steph" --title="Red note"
Red note
This is a red note
$node dist/notes-app.js read --user="steph" --title="Yellow note"
Yellow note
This is a yellow note
$node dist/notes-app.js read --user="steph" --title="Black note"
Note not found
$node dist/notes-app.js remove --user="steph" --title="Red note"
Note removed!
$node dist/notes-app.js list --user="steph" 
Your notes
Yellow note
$node dist/notes-app.js remove --user="steph" --title="Black note"
No note found
```