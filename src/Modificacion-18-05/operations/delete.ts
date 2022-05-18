import {Athlete} from '../index';

export function deleteAthlete(NIF_: string) {
  Athlete.deleteOne({
    NIF: NIF_,
  }).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log(error);
  });
}

deleteAthlete('12345678A');