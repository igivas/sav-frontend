import React, { useState } from 'react';
import { ValueType } from 'react-select';
import FormGroup from '../../../../components/form/FormGroup';
import Row from '../../../../components/form/Row';
import FormCategory from '../../../../components/form/FormCategory';
import ReactSelect from '../../../../components/form/ReactSelect';
import FormCedido from './Cedido';
import FormLocado from './Locado';
import FormOrganico from './Organico';
import { useVeiculo } from '../../../../contexts/VeiculoContext';

interface IProps {
  action: 'editar' | 'cadastrar';
}

type OptionType = { label: string; value: string };

const optionsOrigemAquisicao = [
  { value: '0', label: 'Orgânico' },
  { value: '1', label: 'Locado' },
  { value: '2', label: 'Cessão' },
];

const FormVeiculo: React.FC<IProps> = ({ action }) => {
  const [origemAquisicao, setOrigemAquisicao] = useState('');
  const { veiculo } = useVeiculo();

  function sortAquisicao(a: any, b: any): number {
    return a.criado_em < b.criado_em ? -1 : b.criado_em < a.criado_em ? 1 : 0;
  }
  if (veiculo.aquisicoes) veiculo.aquisicoes.sort(sortAquisicao);

  return (
    <div>
      <FormCategory>AQUISIÇÃO</FormCategory>

      <>
        <Row>
          <FormGroup required name="Origem de Aquisição" cols={[3, 6, 12]}>
            <ReactSelect
              autoFocus
              placeholder="Selecione ..."
              optionsSelect={optionsOrigemAquisicao}
              value={
                veiculo.aquisicoes && action === 'editar'
                  ? optionsOrigemAquisicao.find(
                      (option) =>
                        option.value === veiculo.aquisicoes[0].origem_aquisicao,
                    )
                  : optionsOrigemAquisicao.find(
                      (option) => option.label === origemAquisicao,
                    )
              }
              onChange={(option: ValueType<OptionType>) => {
                const optionSelected = option as OptionType;

                setOrigemAquisicao(optionSelected.label);
              }}
              isDisabled={action !== 'cadastrar'}
            />
          </FormGroup>
        </Row>
        {origemAquisicao === 'Cessão' && <FormCedido action={action} />}
        {origemAquisicao === 'Locado' && <FormLocado action={action} />}
        {origemAquisicao === 'Orgânico' && <FormOrganico action={action} />}
      </>

      {action === 'editar' && (
        <>
          {veiculo.aquisicoes[0].origem_aquisicao === '2' && (
            <FormCedido action={action} />
          )}
          {veiculo.aquisicoes[0].origem_aquisicao === '1' && (
            <FormLocado action={action} />
          )}
          {veiculo.aquisicoes[0].origem_aquisicao === '0' && (
            <FormOrganico action={action} />
          )}
        </>
      )}
    </div>
  );
};

export default FormVeiculo;
