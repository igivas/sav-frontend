import React from 'react';
import ReactModal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { Container, ModalContent, ModalHeader } from './styles';

export interface IModalProps {
  isOpen: boolean;
  title: string;
  handleCloseModal(): void;
  width: number;
  height: number;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Modal: React.FC<IModalProps> = ({
  isOpen,
  handleCloseModal,
  children,
  title,
  height,
  width,
}) => {
  return (
    <ReactModal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
      <Container style={{ width, minHeight: height }}>
        <ModalHeader>
          <div>{title}</div>

          <button type="button" onClick={handleCloseModal}>
            <FaTimes size={15} />
          </button>
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </Container>
    </ReactModal>
  );
};

export default Modal;
