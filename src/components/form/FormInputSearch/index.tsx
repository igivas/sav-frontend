import React, { ChangeEvent } from 'react';
import { FaSearch } from 'react-icons/fa';

import { Container, Input } from './styles';

interface IProps {
  handleChangeSearch(event: ChangeEvent<HTMLInputElement>): void;
  searchInput: string;
}

const FormInputSearch: React.FC<IProps> = ({
  handleChangeSearch,
  searchInput,
}) => {
  return (
    <Container>
      <Input onChange={handleChangeSearch} value={searchInput} />
      <button type="button">
        <FaSearch />
      </button>
    </Container>
  );
};

export default FormInputSearch;
