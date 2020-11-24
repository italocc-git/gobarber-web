import React from 'react';
import {Route as ReactDOMRoute , Redirect} from 'react-router-dom';
import {RouteProps as ReactDOMRouteProps } from 'react-router-dom';
import {useAuth} from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate ?: boolean;
  component : React.ComponentType;
}

//Logica da autenticação das rotas
/*
  isPrivate e isSigned == OK
  isPrivate(rota privada) e !isSigned(não está logado) == redirecionar p login
  !isPrivate e isSigned == redirecionar p dashboard(pagina principal do user)
  !isPrivate(rota não privada) e !isSigned(não está logado) == OK
*/

const Route:React.FC<RouteProps> =({isPrivate = false, component: Component, ...rest}) => {
  const { user }  = useAuth()
  return (
    <ReactDOMRoute {...rest}
    render= { ({location}) => {
      return isPrivate === !!user ?
      ( <Component /> ) :
      ( <Redirect to={ {pathname : isPrivate ? '/' : 'dashboard' , state : {from : location}} } />)
            }
  } />


  )
}

export default Route;
