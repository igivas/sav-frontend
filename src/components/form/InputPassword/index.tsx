import React, { InputHTMLAttributes, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ReactIsCapsLockActive from '@matsun/reactiscapslockactive';
import { Container, Error } from './styles';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined;
  fontSize?: number;
  register?: any;
}

const InputPassword: React.FC<IProps> = ({
  disabled,
  error,
  register,
  fontSize = 14,
  ...rest
}) => {
  const [visible, setvisible] = useState(false);
  return (
    <Container fontSize={fontSize} error={error}>
      <div className="input">
        <input
          {...rest}
          className={`${disabled && 'disabled'}`}
          disabled={disabled}
          ref={register}
          type={visible ? 'text' : 'password'}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setvisible(!visible)}
        >
          {visible ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>
      {error && <Error>{error}</Error>}
      <ReactIsCapsLockActive>
        {(active: boolean) => (
          <>{active && <Error>Capslock está ativado!</Error>}</>
        )}
      </ReactIsCapsLockActive>
    </Container>
  );
};

export default InputPassword;
