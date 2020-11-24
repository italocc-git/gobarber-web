import React, {InputHTMLAttributes , useRef, useEffect, useState , useCallback} from 'react';
import { useField} from '@unform/core';
import {IconBaseProps} from 'react-icons'
import {FiAlertCircle} from 'react-icons/fi'

import { Container, Errors } from './styles'


interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  name:string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({name , containerStyle= {}, icon: Icon , ...rest}) =>
  {
    const [isFocused,setIsFocused] = useState(false);
    const [isFilled,setIsFilled] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const {fieldName, defaultValue, error, registerField} = useField(name)

    useEffect(() => {
      registerField({
        name: fieldName,
        ref : inputRef.current,
        path : 'value'
      })
    } , [fieldName,registerField])

    const handleInputFocused = useCallback(() =>{
      setIsFocused(true)
    }, []);

    const handleInputBlur = useCallback(() => {
      setIsFocused(false)

      setIsFilled(!!inputRef.current?.value)
    }, []);
    return (
    <Container style={containerStyle} isErrored={!!error}
     isFilled={isFilled} data-testid="input-container"
     isFocused={isFocused}>
      { Icon && <Icon  size={20} /> }
        <input
          onFocus={handleInputFocused}
          onBlur={handleInputBlur}
         ref={inputRef}
         defaultValue={defaultValue} {...rest} />
    {error && <Errors title={error} ><FiAlertCircle color='red' size={18} /></Errors> }
    </Container>
  )};


export default Input;
