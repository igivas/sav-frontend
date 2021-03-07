import React from 'react';
import Select, { Props } from 'react-select';

import { Container, Error } from './styles';

interface IOption {
  value: string;
  label: string;
}

interface ISelectProps extends Props {
  optionsSelect: IOption[];
  isMulti?: boolean;
  error?: string;
}

const ReactSelect: React.FC<ISelectProps> = ({
  optionsSelect,
  isMulti = false,
  isDisabled = false,
  value = [],
  error,

  onChange,
  ...rest
}) => {
  const customStyles2 = {
    container: (base: object, state: any) => ({
      ...base,

      transition:
        'border-color 0.2s ease, box-shadow 0.2s ease, padding 0.2s ease',
      '&:hover': {},
    }),
    control: (base: object, state: any) => ({
      ...base,
      background: isDisabled ? '#e3e3e3' : '#fff',
      color: '#333',

      fontSize: '14px',
      boxShadow: '#aaa',
      borderColor: error ? '#ff3030' : '#ddd',
      '&:focus': {
        borderColor: error ? '#ff3030' : '#aaa',
        boxShadow: error ? '#ff3030' : '#aaa',
      },
      '&:hover': {
        borderColor: error ? '#ff3030' : '#aaa',
        boxShadow: error ? '#ff3030' : '#aaa',
      },
      '&:active': {
        borderColor: error ? '#ff3030' : '#aaa',
        boxShadow: error ? '#ff3030' : '#aaa',
      },
      '&:focus-within': {
        borderColor: error ? '#ff3030' : '#aaa',
        boxShadow: error ? '#ff3030' : '#aaa',
      },
    }),
    valueContainer: (base: object, state: any) => ({
      ...base,
      background: isDisabled ? '#e3e3e3' : '#fff',
    }),
    multiValue: (base: object, state: any) => ({
      ...base,
      background: '#ddd',
      maxWidth: '100px',
    }),
  };
  // forma de desativar todo css do react select
  // styles={clearIndicator: () => ({}), container: () => ({}), control: () => ({}), ...}
  return (
    <Container className="select-container">
      <Select
        className="select-input"
        options={optionsSelect}
        styles={customStyles2}
        value={value}
        isMulti={isMulti}
        onChange={onChange}
        isDisabled={isDisabled}
        {...rest}
      />
      {error ? <Error>{error}</Error> : null}
    </Container>
  );
};

export default ReactSelect;
