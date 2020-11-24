import {ValidationError} from 'yup';

interface Errors {
  //No lugar de passar os campos e suas tipagens : nome, email, password (Nesse caso ele recebe qlq campo do tipo string com valor string qlq(input recebe string))
  [key: string] :string;
}

export default function getValidationErrors(err:ValidationError):Errors{
  const validationErrors: Errors = {} //Recebe os campos :email,password,name

  err.inner.forEach(error => {
    validationErrors[error.path] = error.message
  })
  return validationErrors
}
