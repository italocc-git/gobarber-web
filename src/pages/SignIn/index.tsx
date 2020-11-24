import React, {useRef, useCallback} from 'react';
import {Container,Content,Background , AnimationContainer} from './styles'
import {useAuth} from '../../hooks/auth';
import {useToast} from '../../hooks/toast'
import * as Yup from 'yup'
import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/Input';
import {FormHandles} from '@unform/core';
import {Form } from '@unform/web';
import Button from '../../components/Button';
import {Link ,useHistory} from 'react-router-dom'
import {FiLogIn, FiMail,FiLock} from 'react-icons/fi'

interface SignInFormData  {
  email : string;
  password: string;
}

const SignIn: React.FunctionComponent = () => {
  const {user, signIn} = useAuth()
  console.log(user)
  const formRef = useRef<FormHandles>(null);
  const {addToast} = useToast()
  const history = useHistory()


  const handleSubmit = useCallback(async (data:SignInFormData) =>{

    try {
      const schema = Yup.object().shape({
        email : Yup.string()
        .required('E-mail Obrigatório')
        .email('Digite um e-mail válido'),
        password : Yup.string()
        .required('Senha obrigatória')
      })

      await schema.validate(data, {
        abortEarly: false,
      })
     await signIn({email : data.email ,
      password: data.password});

     history.push('/dashboard')

    }catch (error){
      if(error instanceof Yup.ValidationError){
      const errors = getValidationErrors(error)
      formRef.current?.setErrors(errors);
      }
      //disparar um toast

      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro ao fazer login, cheque as credenciais.'
      });

    }

  },[signIn,addToast,history])

  return (
    <Container>
      <Content>
        <AnimationContainer >
        <img src={logoImg} alt='GoBarber' />
        <Form ref={formRef} onSubmit={handleSubmit} >
          <h1>Faça seu logon</h1>
          <Input icon={FiMail} placeholder='E-mail' name='email'  />
          <Input icon={FiLock} placeholder='Senha' name='password' type='password' />
          <Button type='submit' >
              Entrar
          </Button>
          <Link to='/forgot-password'>Esqueci minha senha </Link>
        </Form>
        <Link to='/signup'> <FiLogIn/> Criar Conta</Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  )
}

export default SignIn
