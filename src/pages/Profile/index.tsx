import React , {useCallback, useRef, ChangeEvent} from 'react';
import {Container,Content,AvatarInput} from './styles'
import * as Yup from 'yup'
import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';
import {Form} from '@unform/web';
import {FormHandles} from '@unform/core';
import {  Link, useHistory} from 'react-router-dom'
import {useToast} from '../../hooks/toast'
import Button from '../../components/Button';
import api from '../../services/api'
import {FiLock,FiUser,FiMail, FiCamera, FiArrowLeft} from 'react-icons/fi'
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email:string;
  old_password:string;
  password:string;
  password_confirmation:string;
}

const Profile: React.FunctionComponent = () => {


    const formRef = useRef<FormHandles>(null)
    const { addToast} = useToast();
    const {user, updateUser} = useAuth();
    const history = useHistory();
    const handleSubmit = useCallback(async (data:ProfileFormData) =>{
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email : Yup.string()
          .required('E-mail Obrigatório')
          .email('Digite um e-mail válido'),
          old_password : Yup.string(),
          password : Yup.string().when('old_password', {
            is: val => !!val.length, /* When old password has a value, then Required field */
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string()
          .when('old_password', {
            is: val => !!val.length, /* When old password has a value, then Required field */
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string()
          })
          .oneOf([Yup.ref('password')],
            'Confirmação incorreta')
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        const formData = Object.assign({
          name: data.name,
          email: data.email,
        }, data.old_password ? {
          old_password : data.old_password,
          password: data.password,
          passoword_confirmation: data.password_confirmation
                            } : {}
        )
          /* Object assign is a function that join two or more properties( and their values) in one object */
         /* If the informations are not present(old_password, password or password_confirmation,
          send the data anyway to the backend) */

        const response  = await api.put('/profile',formData)

        updateUser(response.data)

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Perfil realizado',
          description: 'Suas informações do perfil foram atualizadas com sucesso!'
        })



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
          title: 'Erro na atualização ',
          description: 'Ocorreu um erro ao atualizar o perfil, tente novamente.'
        });
      }
      console.log(data)
    },[addToast,history,updateUser])

    const handleAvatarChange = useCallback(
      (e:ChangeEvent<HTMLInputElement>) => {

        if(e.target.files){
          console.log(e.target.files[0])
          const data = new FormData();
          data.append('avatar', e.target.files[0])

          api.patch('/users/avatar', data).then(response => {
            updateUser(response.data)
            addToast({
              type:'success',
              title:'Avatar Atualizado!'
            })
          })

        }
      },[addToast,updateUser])

  return (
    <Container>
      <header>
        <div>
          <Link to='/dashboard'>
            <FiArrowLeft />
         </Link>
        </div>

      </header>
      <Content>

        <Form  ref={formRef} initialData={{name:user.name , email:user.email}} onSubmit={handleSubmit} >

          <AvatarInput>
            <img src={user.avatar_url} alt={user.name}/>
            <label htmlFor='avatar'>
              <FiCamera/>

              <input id='avatar' type='file' onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input icon={FiUser} placeholder='Nome' name='name'  />
          <Input icon={FiMail} placeholder='E-mail' name='email'  />
          <Input containerStyle={ {marginTop:24} } icon={FiLock} placeholder='Senha atual' name='old_password' type='password'  />
          <Input icon={FiLock} placeholder='Nova Senha' name='password' type='password'  />
          <Input icon={FiLock} placeholder='Confirmar senha' name='password_confirmation' type='password'/>

          <Button type='submit'>
              Confirmar mudanças
          </Button>

        </Form>

      </Content>


    </Container>
  )
}

export default Profile
