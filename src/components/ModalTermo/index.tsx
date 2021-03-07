import React, { useState, useEffect } from 'react';
import { FaRegFilePdf, FaTimes, FaSave } from 'react-icons/fa';
import PanelBottomActions from '../PanelBottomActions';
import Button from '../form/Button';
import ModalAssinatura from '../ModalAssinatura';
import { useAuth } from '../../contexts/auth';
import { useDocumento } from '../../contexts/DocumentoContext';
import Modal, { IModalProps } from '../Modal/index';
import { Container, Content, PdfLink, SubTitle } from './style';

interface ITermoProps extends IModalProps {
  subtitle: string;
  tipo: 'movimentacao';
  data?: any;
}

const ModalTermo: React.FC<ITermoProps> = ({
  subtitle,
  children,
  handleCloseModal,
  tipo,
  data,
  ...rest
}) => {
  const [showModalAssinatura, setshowModalAssinatura] = useState(false);
  const { user } = useAuth();
  const { createDocumento } = useDocumento();

  const [document, setDocument] = useState<string>();

  const handleOpenModal = (): void => {
    setshowModalAssinatura(true);
  };

  const handleCloseModalAssinatura = (): void => {
    setshowModalAssinatura(false);
    handleCloseModal();
  };

  useEffect(() => {
    async function load(): Promise<void> {
      if (tipo === 'movimentacao') {
        if (data) {
          const documento = await createDocumento(data as any);
          setDocument(documento);
          if (!documento) handleCloseModal();
        }
      }
    }
    load();
  }, [createDocumento, data, tipo, handleCloseModal]);

  return (
    <>
      {!showModalAssinatura && (
        <Modal {...rest} handleCloseModal={handleCloseModal}>
          <Container>
            <SubTitle>{subtitle}</SubTitle>
            <Content>{children}</Content>
            {document && (
              <PdfLink
                href={document}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaRegFilePdf size={60} />
                Visualizar Termo
              </PdfLink>
            )}

            <PanelBottomActions>
              <>
                <Button
                  color="red"
                  icon={FaTimes}
                  onClick={handleCloseModalAssinatura}
                >
                  Cancelar
                </Button>
                <Button
                  color="green"
                  icon={FaSave}
                  type="button"
                  onClick={handleOpenModal}
                >
                  Assinar
                </Button>
              </>
            </PanelBottomActions>
          </Container>
        </Modal>
      )}

      {showModalAssinatura && (
        <ModalAssinatura
          data={
            tipo === 'movimentacao' && {
              body: data.body.movimentacao,
            }
          }
          tipo={tipo}
          {...rest}
          assinante={user.nome}
          cpf={user.matricula}
          handleCloseModal={handleCloseModalAssinatura}
          cargos={
            user.graduacao
              ? [{ label: user.graduacao.gra_nome, value: '1' }]
              : []
          }
          isOpen={showModalAssinatura}
        />
      )}
    </>
  );
};

export default ModalTermo;
