import React from 'react';
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { Container, Error } from './styles';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt-BR', ptBR);

// type IDatePickerProps = ReactDatePickerProps;
interface IDatePickerProps extends ReactDatePickerProps {
  error?: string | undefined;
}

const FormDatePicker: React.FC<IDatePickerProps> = ({
  disabled,
  error,
  ...rest
}) => {
  return (
    <Container error={error}>
      <DatePicker
        {...rest}
        className={`${disabled && 'disabled'}`}
        disabled={disabled}
        locale="pt-BR"
        strictParsing
      />
      {error ? <Error>{error}</Error> : null}
    </Container>
  );
};

export default FormDatePicker;
