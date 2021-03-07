import FormGroup from 'components/form/FormGroup';
import FormInput from 'components/form/FormInput';
import ReactSelect from 'components/form/ReactSelect';
import Modal, { IModalProps } from 'components/Modal';
import React from 'react';
import PanelBottomActions from 'components/PanelBottomActions';
import Button from 'components/form/Button';
import { FaTimes, FaSave } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
// import { useMovimentacao } from 'contexts/MovimentacaoContext';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { ValueType } from 'react-select';
import { useToast } from '@chakra-ui/react';
import { useMovimentacao } from 'contexts/MovimentacaoContext';
import { useAuth } from 'contexts/auth';
import { Content, Form, Post } from './styles';

interface IOptionsCargos {
  value: string;
  label: string;
}

interface IModalAssinaturaProps extends IModalProps {
  cargos: IOptionsCargos[];
  assinante: string;
  cpf: string;
  tipo: 'movimentacao';
  data: unknown;
}

const schemaAssinatura = Yup.object().shape({
  cargo: Yup.string().required('Este cmapo é requerido'),
  pin_assinatura: Yup.string().required('Este cmapo é requerido'),
  pin_24h: Yup.string().required('Este cmapo é requerido'),
});

/* const schemaAssinatura = Yup.object().shape({
  cargo: Yup.string().required('Este campo é obrigatorio'),
  pin_assinatura: Yup.string().required('Este campo é obrigatorio'),
  pin_24h: Yup.string()
    .required('Este campo é obrigatorio')
    .max(6, 'Não pode haver mais de 6 digitos'),
}); */

type IFormInputsAssinatura = Yup.InferType<typeof schemaAssinatura>;

const ModalAssinatura: React.FC<Omit<IModalAssinaturaProps, 'title'>> = ({
  assinante,
  cargos,
  cpf,
  data,
  tipo,
  handleCloseModal,
  ...rest
}) => {
  // const { createMovimentacao } = useMovimentacao();
  // const methods = useFormContext();
  const { signOut } = useAuth();
  const { handleSubmit, control, errors } = useForm<IFormInputsAssinatura>({
    resolver: yupResolver(schemaAssinatura),
  });

  const toast = useToast();
  const { createMovimentacao } = useMovimentacao();

  const onSubmit = async (
    dataForm: IFormInputsAssinatura,
  ): Promise<undefined> => {
    try {
      if (tipo === 'movimentacao') await createMovimentacao(data as object);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) signOut();
        toast({
          title: 'Ocorreu um erro.',
          description:
            error.response.data.message ||
            'Ocorreu um erro ao cadastrar a movimentação.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
    return undefined;
  };

  return (
    <Modal
      title="Assinatura Eletronica PMCE"
      handleCloseModal={handleCloseModal}
      {...rest}
    >
      <Content>
        <Post>{`${assinante} - ${cpf}`}</Post>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup required name="Escolha o Cargo" cols={[6, 6, 6]}>
            <Controller
              name="cargo"
              control={control}
              render={({ onChange, value }) => (
                <ReactSelect
                  placeholder="Selecione..."
                  optionsSelect={cargos}
                  onChange={(option: ValueType<IOptionsCargos>) => {
                    const optionSelected = option as IOptionsCargos;
                    onChange(optionSelected.value);
                  }}
                  value={cargos.find((option) => option.value === value)}
                  error={errors.cargo?.message}
                />
              )}
            />
          </FormGroup>

          <div id="pins_inputs">
            <FormGroup required name="Digit PIN assinatura" cols={[6, 6, 6]}>
              <Controller
                name="pin_assinatura"
                control={control}
                render={({ onChange, value }) => (
                  <FormInput
                    type="password"
                    onChange={onChange}
                    value={value}
                    error={errors.pin_assinatura?.message}
                  />
                )}
              />
            </FormGroup>

            <FormGroup required name="Digit PIN 24H" cols={[4, 6, 6]}>
              <Controller
                name="pin_24h"
                control={control}
                render={({ onChange, value }) => (
                  <FormInput
                    type="password"
                    onChange={onChange}
                    value={value}
                    error={errors.pin_assinatura?.message}
                    maxLength={6}
                  />
                )}
              />
            </FormGroup>
          </div>
          <PanelBottomActions>
            <>
              <Button color="red" icon={FaTimes} onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button color="green" icon={FaSave} type="submit">
                Assinar
              </Button>
            </>
          </PanelBottomActions>
        </Form>
      </Content>
    </Modal>
  );
};

export default ModalAssinatura;
