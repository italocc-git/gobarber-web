import React , {useCallback, useRef} from 'react';
import {Container,Content,Background, AnimationContainer} from './styles'
import * as Yup from 'yup'
import logoImg from '../../assets/logo.svg'
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';
import {Form} from '@unform/web';
import {FormHandles} from '@unform/core';
import { Link , useHistory} from 'react-router-dom'
import {useToast} from '../../hooks/toast'
import Button from '../../components/Button';
import api from '../../services/api'
import {FiArrowLeft,FiLock,FiUser,FiMail} from 'react-icons/fi'

interface SignUpFormData {
  name: string;
  email:string;
  password:string;
}

const SignUp: React.FunctionComponent = () => {
    const formRef = useRef<FormHandles>(null)

    const { addToast} = useToast();
    const history = useHistory();
    const handleSubmit = useCallback(async (data:SignUpFormData) =>{
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email : Yup.string()
          .required('E-mail Obrigatório')
          .email('Digite um e-mail válido'),
          password : Yup.string()
          .min(6,'No mínimo 6 digitos')
        })

        await schema.validate(data, {
          abortEarly: false,
        })
        await api.post('/users',data)
        addToast({
          type: 'success',
          title: 'Cadastro realizado',
          description: 'Você já pode fazer seu logon no GoBarber'
        })
        history.push('/');
      }catch (error){
        console.log(error)
        const errors = getValidationErrors(error)
        formRef.current?.setErrors(errors);

        if(error instanceof Yup.ValidationError){
          const errors = getValidationErrors(error)
          formRef.current?.setErrors(errors);
          }
          //disparar um toast

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.'
        });
      }
      console.log(data)
    },[addToast,history])


  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer >
        <img src={logoImg} alt='GoBarber' />
        <Form ref={formRef} initialData={{name:'Italo Costa'}} onSubmit={handleSubmit} >
          <h1>Faça seu Cadastro</h1>
          <Input icon={FiUser} placeholder='Nome' name='name'  />
          <Input icon={FiMail} placeholder='E-mail' name='email'  />
          <Input icon={FiLock} placeholder='Senha' name='password'  />
          <Button type='submit'>
              Cadastrar
          </Button>

        </Form>
        <Link to='/'> <FiArrowLeft/> Voltar para logon</Link>
        </AnimationContainer>
      </Content>


    </Container>
  )
}

export default SignUp
