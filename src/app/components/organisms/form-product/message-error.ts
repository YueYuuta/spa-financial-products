export const ERROR_MESSAGES = {
  id: {
    required: 'El ID es obligatorio',
    minlength: 'El ID debe tener al menos 3 caracteres',
    maxlength: 'El ID no puede exceder los 10 caracteres',
    idexists: 'El ID ya existe en el sistema',
  },
  name: {
    required: 'El nombre es obligatorio',
    minlength: 'El nombre debe tener al menos 5 caracteres',
    maxlength: 'El nombre no puede exceder los 100 caracteres',
  },
  description: {
    required: 'La descripción es obligatoria',
    minlength: 'La descripción debe tener al menos 10 caracteres',
    maxlength: 'La descripción no puede exceder los 200 caracteres',
  },
  logo: {
    required: 'El logo es obligatorio',
  },
  date_release: {
    required: 'La fecha de liberación es obligatoria',
    invaliddate: 'La fecha debe ser igual o mayor a la fecha actual',
  },
  date_revision: {
    required: 'La fecha de revisión es obligatoria',
    revisiondate:
      'La fecha de revisión debe ser exactamente 1 año después de la liberación',
  },
};
