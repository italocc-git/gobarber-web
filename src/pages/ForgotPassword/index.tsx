import React, {useRef, useCallback, useState} from 'react';
import {Container,Content,Background , AnimationContainer} from './styles'

import {useToast} from '../../hooks/toast'
import * as Yup from 'yup'
import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/Input';
import {FormHandles} from '@unform/core';
import {Form } from '@unform/web';
import Button from '../../components/Button';
import {Link } from 'react-router-dom'
import {FiLogIn, FiMail} from 'react-icons/fi'
import api from '../../services/api';

interface ForgotPasswordFormData  {
  email : string;
  password: string;
}

const ForgotPassword: React.FunctionComponent = () => {
  const [loading , setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const {addToast} = useToast()



  const handleSubmit = useCallback(async (data:ForgotPasswordFormData) =>{

    try {
      setLoading(true)

      const schema = Yup.object().shape({
        email : Yup.string()
        .required('E-mail Obrigatório')
        .email('Digite um e-mail válido'),

      })

      await schema.validate(data, {
        abortEarly: false,
      })

      //Recuperação de senha
      await api.post('/password/forgot',{
        email: data.email
      })

      addToast({
        type: 'success',
        title: 'E-mail de recuperação enviado',
        description : 'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada'
      })

     //history.push('/dashboard')
    }catch (error){
      if(error instanceof Yup.ValidationError){
      const errors = getValidationErrors(error)
      formRef.current?.setErrors(errors);
      }

      //disparar um toast

      addToast({
        type: 'error',
        title: 'Erro na recuperação de senha',
        description: 'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.'
      });

      }
    finally {
      setLoading(false)
    }

  },[addToast])

  return (
    <Container>
      <Content>
        <AnimationContainer >
        <img src={logoImg} alt='GoBarber' />
        <Form ref={formRef} onSubmit={handleSubmit} >
          <h1>Recuperar Senha</h1>
          <Input icon={FiMail} placeholder='E-mail' name='email'  />

          <Button loading={loading} type='submit' >
              Recuperar
          </Button>

        </Form>
        <Link to='/'> <FiLogIn/>Voltar ao login</Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  )
}

export default ForgotPassword
