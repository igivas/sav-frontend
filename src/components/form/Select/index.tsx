import React, { SelectHTMLAttributes } from 'react';
import { Container, Error } from './styles';

interface IOption {
  value: string;
  label: string;
}

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  optionsSelect: IOption[];
  error?: string;
  touched?: boolean;
}

const Select: React.FC<ISelectProps> = ({
  optionsSelect,
  disabled,
  error,
  touched,
  ...rest
}) => {
  return (
    <>
      <Container
        {...rest}
        className={`${disabled && 'disabled'}`}
        disabled={disabled}
        error={error}
        touched={touched}
      >
        <option value="">Selecione uma opção</option>
        {optionsSelect.map((currentOption) => {
          return (
            <option value={currentOption.value} key={currentOption.value}>
              {currentOption.label}
            </option>
          );
        })}
      </Container>
      {error && touched ? <Error>{error}</Error> : null}
    </>
  );
};

export default Select;
