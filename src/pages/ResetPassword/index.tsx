import React, {useRef, useCallback} from 'react';
import {Container,Content,Background , AnimationContainer} from './styles'
import {useToast} from '../../hooks/toast'
import * as Yup from 'yup'
import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/Input';
import {FormHandles} from '@unform/core';
import {Form } from '@unform/web';
import Button from '../../components/Button';
import {useHistory, useLocation} from 'react-router-dom'
import {FiLock} from 'react-icons/fi'
import api from '../../services/api';

interface ResetPasswordFormData  {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FunctionComponent = () => {

  const formRef = useRef<FormHandles>(null);
  const {addToast} = useToast();
  const history = useHistory();
  const location = useLocation();


  const handleSubmit = useCallback(
    async (data:ResetPasswordFormData) =>{

    try {
      const schema = Yup.object().shape({
        password : Yup.string()
        .required('Senha obrigatória'),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref('password')], 'Confirmação incorreta')
      })

      await schema.validate(data, {
        abortEarly: false,
      })

      const {password, password_confirmation} = data
      const token = location.search.replace('?token=', '');

      if(!token){
        throw new Error();
      }


      await api.post('/password/reset', {
        password,
        password_confirmation,
        token
      })
      history.push('/')

    }
    catch (error){
      if(error instanceof Yup.ValidationError){
      const errors = getValidationErrors(error)
      formRef.current?.setErrors(errors);
      }
      //disparar um toast

      addToast({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao resetar sua senha, tente novamente.'
      });

    }

  },[addToast, history, location.search])

  return (
    <Container>
      <Content>
        <AnimationContainer >
        <img src={logoImg} alt='GoBarber' />
        <Form ref={formRef} onSubmit={handleSubmit} >
          <h1>Resetar senha</h1>

          <Input icon={FiLock} placeholder='Nova senha'
           name='password' type='password' />
          <Input icon={FiLock} placeholder='Confirmação de senha'
           name='password_confirmation' type='password' />

          <Button type='submit' >
              Alterar senha
          </Button>
        </Form>

        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  )
}

export default ResetPassword
