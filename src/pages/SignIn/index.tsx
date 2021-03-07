import React, { KeyboardEvent, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { FaAddressCard } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';
import { useAuth } from '../../contexts/auth';
import FormInput from '../../components/form/FormInputIcon';
import InputPassword from '../../components/form/InputPassword';
import Button from '../../components/Button';
import { Container, Content } from './styles';

interface ISignInFormData {
  matricula: string;
  senha: string;
}

const schema = Yup.object().shape({
  matricula: Yup.string().required('matricula é obrigatório'),
  senha: Yup.string().required('Senha é obrigatória'),
});

const SignIn: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, errors, control } = useForm<ISignInFormData>({
    resolver: yupResolver(schema),
  });

  const history = useHistory();

  const { signIn } = useAuth();

  const onSubmit = useCallback(
    async (data: ISignInFormData) => {
      setIsLoading(true);
      try {
        await signIn(data);
        setIsLoading(false);
        history.push('/home');
      } catch (error) {
        setIsLoading(false);
      }
    },
    [signIn, history],
  );

  const handleKeypress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Container>
      <Fade className="fade-box-login">
        <Content>
          <h3>Login</h3>
          <form autoComplete="off">
            <Controller
              name="matricula"
              control={control}
              defaultValue=""
              render={(props) => (
                <FormInput
                  id="matricula"
                  autoComplete="nope"
                  fontSize={14}
                  icon={FaAddressCard}
                  {...props}
                  placeholder="matricula"
                  onKeyPress={(e) => handleKeypress(e)}
                  error={errors.matricula?.message}
                />
              )}
            />

            <Controller
              name="senha"
              control={control}
              defaultValue=""
              render={(props) => (
                <InputPassword
                  {...props}
                  name="senha"
                  id="senha"
                  autoComplete="nope"
                  fontSize={14}
                  placeholder="Senha"
                  onKeyPress={(e) => handleKeypress(e)}
                  error={errors.senha?.message}
                />
              )}
            />
          </form>
          <Button
            fontSize="13px"
            isLoading={isLoading}
            loadingText="VERIFICANDO"
            type="submit"
            colorScheme="primary"
            onClick={handleSubmit((data) => onSubmit(data))}
          >
            ENTRAR
          </Button>
          {/* <Info>Acesse com o mesmo usuário e senha do sistema SISBOL!</Info> */}
        </Content>
      </Fade>
    </Container>
  );
};

export default SignIn;
