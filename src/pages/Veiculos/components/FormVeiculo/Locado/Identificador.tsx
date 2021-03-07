import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormGroup from '../../../../../components/form/FormGroup';
import Row from '../../../../../components/form/Row';
import DatePicker from '../../../../../components/form/FormDatePicker';
import FormInput from '../../../../../components/form/FormInput';
import { IIdentificador } from '../utils/schemaFormVeiculo';

type IProps = {
  disabled: boolean;
};

const FormIdentificador: React.FC<IProps> = ({ disabled }) => {
  const { errors, control } = useFormContext<IIdentificador>();

  return (
    <>
      <Row>
        <FormGroup required name="Data Identificador" cols={[2, 6, 6]}>
          <Controller
            name="data_identificador"
            control={control}
            render={({ onChange, value }) => (
              <DatePicker
                showYearDropdown
                selected={value}
                onChange={onChange}
                error={errors.data_identificador?.message}
                dateFormat="dd/MM/yyyy"
                disabled={disabled}
              />
            )}
          />
        </FormGroup>
        <FormGroup required name="Identificador" cols={[2.5, 6, 12]}>
          <Controller
            name="identificador"
            control={control}
            render={(props) => (
              <FormInput
                {...props}
                disabled={disabled}
                error={errors.identificador?.message}
              />
            )}
          />
        </FormGroup>
      </Row>
    </>
  );
};

export default FormIdentificador;
