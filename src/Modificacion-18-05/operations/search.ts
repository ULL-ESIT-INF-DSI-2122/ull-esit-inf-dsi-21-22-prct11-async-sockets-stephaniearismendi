import {Athlete} from '../index';

export function findAthleteNIF(NIF_: string) {
  Athlete.findOne({
    NIF: NIF_,
  }).then((result) => {
    if (result == null) {
      console.log('No hay ningun atleta');
    } else {
      console.log(result);
    }
  }).catch((error) => {
    console.log(error);
  });
}

findAthleteNIF('12345678A');