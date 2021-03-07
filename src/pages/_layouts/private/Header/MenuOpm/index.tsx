import React, { useCallback, useEffect, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Checkbox,
  useColorModeValue,
} from '@chakra-ui/react';
import debounce from 'debounce-promise';
import { ValueType } from 'react-select';
import FormGroup from '../../../../../components/form/FormGroup';
import api from '../../../../../services/api';
import { useAuth } from '../../../../../contexts/auth';
import AsyncSelect from '../../../../../components/form/AsyncSelect';

type OptionType = { label: string; value: string };

const MenuOpm: React.FC = () => {
  const { user, updateOpm, updateVerSubunidades } = useAuth();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [opmSelecionada, setOpmSelecionada] = useState<OptionType>();
  const color = useColorModeValue('gray.500', 'white');
  // const colorHover = useColorModeValue('white', 'gray.500');

  const promiseOptionsUnidades = useCallback(
    async (inputValue: string): Promise<OptionType[] | undefined> => {
      try {
        const response = await api.get(
          `unidades?query=${inputValue}&opm_usuario=${user.opm?.uni_codigo}`,
        );

        const responseFormated = response.data.map((item: any) => {
          return {
            value: item.uni_codigo,
            label: item.uni_sigla,
          };
        });

        return responseFormated;
      } catch (error) {
        return undefined;
      }
    },
    [user],
  );

  const delayedQuery = useCallback(
    debounce((query: string) => promiseOptionsUnidades(query), 500),
    [promiseOptionsUnidades],
  );

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (opmSelecionada) {
        updateOpm({
          uni_codigo: opmSelecionada.value,
          uni_sigla: opmSelecionada.label,
        });
      }
    };

    load();
    // eslint-disable-next-line
  }, [opmSelecionada]);

  const handleSwitchSubunidade = (sub: boolean): void => {
    updateVerSubunidades(sub ? '1' : '0');
  };

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement="bottom"
        closeOnBlur
      >
        <PopoverTrigger>
          <Button
            _hover={{ bg: '#eee' }}
            colorScheme="white"
            color={color}
            fontWeight="400"
            borderRadius="0"
            h={20}
            w={{ base: '200px', sm: '80px', md: '120px' }}
          >
            {user.currentOpm?.uni_sigla}
          </Button>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <PopoverCloseButton />
          <FormGroup name="Trocar Unidade" cols={[12, 12, 12]}>
            <AsyncSelect
              placeholder="Digite..."
              value={opmSelecionada}
              isClearable
              loadOptions={(value: string) => delayedQuery(value.trim())}
              onChange={(option: ValueType<OptionType>) => {
                const optionSelected = option as OptionType;

                setOpmSelecionada(optionSelected);
              }}
            />
          </FormGroup>
          <FormControl
            paddingLeft="8px"
            display="flex"
            alignItems="center"
            mt="2"
          >
            <FormLabel htmlFor="subunidades" mb="0">
              Ver Subunidades?
            </FormLabel>
            <Checkbox
              id="subunidades"
              marginRight="4px"
              isChecked={user.verSubunidade === '1'}
              colorScheme="green"
              onChange={(e) => handleSwitchSubunidade(e.target.checked)}
            />
            Sim
          </FormControl>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MenuOpm;
