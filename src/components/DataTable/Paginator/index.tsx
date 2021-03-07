import React from 'react';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { Container } from './styles';

interface IPaginatorProps {
  totalPage: number;
  currentPage: number;
  handleChangePage(page: number): void;
  handleIncrementPage(): void;
  handleDecrementPage(): void;
}

const Paginator: React.FC<IPaginatorProps> = ({
  totalPage,
  currentPage,
  handleChangePage,
  handleDecrementPage,
  handleIncrementPage,
}) => {
  const createButtonsPagination = (): JSX.Element[] => {
    const buttons = [];
    if (currentPage > 3) {
      buttons.push(
        <button
          key="initial"
          type="button"
          className="page-number"
          onClick={() => handleChangePage(1)}
        >
          <FiChevronsLeft size={15} />
        </button>,
      );
    }
    for (let i = 1; i <= totalPage; i++) {
      if (i >= currentPage - 2 && i <= currentPage + 2) {
        buttons.push(
          <button
            key={i}
            type="button"
            className={`page-number ${currentPage === i && 'active'}`}
            onClick={() => handleChangePage(i)}
          >
            {i}
          </button>,
        );
      }
    }
    if (currentPage < totalPage - 3) {
      buttons.push(
        <button
          key="final"
          type="button"
          className="page-number"
          onClick={() => handleChangePage(totalPage)}
        >
          <FiChevronsRight size={15} />
        </button>,
      );
    }

    return buttons;
  };

  return (
    <Container>
      <button type="button" id="previous" onClick={() => handleDecrementPage()}>
        Anterior
      </button>
      {createButtonsPagination()}

      <button type="button" id="next" onClick={() => handleIncrementPage()}>
        Próximo
      </button>
    </Container>
  );
};

export default Paginator;
