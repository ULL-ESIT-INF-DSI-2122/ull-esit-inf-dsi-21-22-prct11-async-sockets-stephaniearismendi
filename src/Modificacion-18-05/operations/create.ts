import {Athlete} from '../index';

export function createAthlete(nombre_:string, apellido_:string, NIF_:string, edad_:number, deporte_:string, experto_:string, marca_:number) {
  const athlete = new Athlete({
    nombre: nombre_,
    apellido: apellido_,
    NIF: NIF_,
    edad: edad_,
    deporte: deporte_,
    experto: experto_,
    marca: marca_,
  });

  athlete.save().then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

createAthlete('Rodrigo', 'Pérez', '12345678A', 20, 'atletismo', 'vallas', 10);