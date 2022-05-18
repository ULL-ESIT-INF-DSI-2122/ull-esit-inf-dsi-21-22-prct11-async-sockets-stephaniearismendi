import {Document, connect, model, Schema} from 'mongoose';

connect('mongodb://127.0.0.1:27017/Athlete', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

interface AthleteDocumentInterface extends Document {
  nombre: string;
  apellido: string;
  NIF: string;
  edad: number;
  deporte: 'atletismo' | 'natacion' | 'futbol' | 'baloncesto' | 'tenis' | 'ciclismo';
  experto: string;
  marca: number;
}

const AthleteSchema = new Schema<AthleteDocumentInterface>({
  nombre: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre debe empezar con mayúscula');
      }
    },
  },
  apellido: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El apellido debe empezar con mayúscula');
      }
    },
  },
  NIF: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[0-9]{8}[A-Z]$/)) {
        throw new Error('El NIF debe tener 8 dígitos y una letra mayúscula');
      }
    },
    unique: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  deporte: {
    type: String,
    required: true,
    enum: ['atletismo', 'natacion', 'futbol', 'baloncesto', 'tenis', 'ciclismo'],
  },
  experto: {
    type: String,
    required: true,
  },
  marca: {
    type: Number,
    required: true,
  },
});

export const Athlete = model<AthleteDocumentInterface>('Athlete', AthleteSchema);

// const athlete = new Athlete({
//   nombre: 'Juan',
//   apellido: 'Pérez',
//   NIF: '12345678A',
//   edad: 20,
//   deporte: 'atletismo',
//   experto: 'vallas',
//   marca: 10,
// });

// athlete.save().then((result) => {
//   console.log(result);
// }).catch((error) => {
//   console.log(error);
// });
