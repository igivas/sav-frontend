import React from 'react';

import AsyncSelect, { Props } from 'react-select/async';

import { Container, Error } from './styles';

type OptionType = { label: string; value: string };
interface IOption {
  value: string;
  label: string;
}

interface ISelectProps extends Props<OptionType> {
  // optionsSelect: IOption[];
  isMulti?: boolean;
  error?: string;
}

const ReactSelect: React.FC<ISelectProps> = ({
  isMulti = false,
  isDisabled = false,
  value = [],
  loadOptions,
  error,
  placeholder = 'Digite...',
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
      color: isDisabled ? '#999' : '#333',

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
    singleValue: (provided: any, state: any) => ({
      display: state.selectProps.menuIsOpen ? 'none' : 'block',
    }),
  };

  return (
    <Container>
      <AsyncSelect
        styles={customStyles2}
        placeholder={placeholder}
        value={value}
        isMulti={isMulti}
        onChange={onChange}
        loadOptions={loadOptions}
        isDisabled={isDisabled}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
        noOptionsMessage={() => 'Sem opções'}
        {...rest}
      />
      {error ? <Error>{error}</Error> : null}
    </Container>
  );
};

export default ReactSelect;
