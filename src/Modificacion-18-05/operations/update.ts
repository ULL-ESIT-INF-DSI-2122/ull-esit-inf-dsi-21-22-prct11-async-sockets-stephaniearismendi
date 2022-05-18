import {Athlete} from '../index';

export function updateAthlete(nombre_:string, apellido_:string, NIF_:string, edad_:number, deporte_:string, experto_:string, marca_:number) {
  Athlete.updateOne({
    NIF: NIF_, // filter
  }, {
    nombre: nombre_,
    apellido: apellido_,
    edad: edad_,
    deporte: deporte_,
    experto: experto_,
    marca: marca_,
  }).then((result) => {
    console.log(result);
  },
  ).catch((error) => {
    console.log(error);
  },
  );
}

updateAthlete('Julián', 'Pérez', '12345678A', 20, 'atletismo', 'vallas', 10);