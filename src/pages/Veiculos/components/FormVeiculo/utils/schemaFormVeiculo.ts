import * as Yup from 'yup';
import {
  requiredField,
  requiredFieldSelect,
  maxChars,
  dateTypeError,
} from './errorFieldsFormat';

export const aquisicaoGenerica = Yup.object({
  origem_aquisicao: Yup.string().oneOf(['0', '1', '2']).notRequired(),
  data_aquisicao: Yup.date().typeError('Insira um ano válido!').default(''),
  doc_aquisicao: Yup.string(),
  aquisicao_file: Yup.mixed().when('doc_aquisicao', {
    is: (value) => value,
    then: Yup.mixed().required(requiredField),
    otherwise: Yup.mixed().notRequired(),
  }),
}).required('Aquisicao é requrida');

export const dadosGerais = Yup.object({
  chassi: Yup.string().required(requiredField).max(18, maxChars(18)),
  placa: Yup.string()
    .trim()
    .notRequired()
    .transform((value) => value || null)
    .nullable(true)
    .matches(/^[a-zA-Z]{3}[0-9][0-9a-zA-Z][0-9]{2}$/, 'Placa inválida'),
  renavam: Yup.string()
    .trim()
    .transform((value) => value || null)
    .notRequired()
    .nullable(true)
    .max(11, maxChars(11)),
  id_veiculo_especie: Yup.string().trim().required(requiredFieldSelect),
  id_marca: Yup.string().required(requiredFieldSelect),
  id_modelo: Yup.string().required(requiredFieldSelect),
  id_cor: Yup.string().required(requiredFieldSelect),
});

export type IDadosGerais = Yup.InferType<typeof dadosGerais>;

export const identificador = Yup.object({
  data_identificador: Yup.date().typeError(dateTypeError).default(''),
  identificador: Yup.string().required(requiredField),
});

export type IIdentificador = Yup.InferType<typeof identificador>;

export const dadosGeraisOrganicoOrCedido = Yup.object({
  uf: Yup.string().required('Selecione um Estado'),
  id_modelo: Yup.string().required('Selecione uma opção'),
  ano_modelo: Yup.date().typeError('Insira um ano válido!').default(''),
  ano_fabricacao: Yup.date().typeError('Insira um ano válido!').default(''),
  combustivel: Yup.string().required('Selecione uma opção'),
  numero_crv: Yup.string().required('Esse campo é requerido'),
  codigo_seguranca_crv: Yup.string().required('Esse campo é requerido'),
  valor_fipe: Yup.string().required('Esse campo é requerido'),
});

export type IDadosGeraisOrganicoOrCedido = Yup.InferType<
  typeof dadosGeraisOrganicoOrCedido
>;

export const cargaAtualOrganicoOrCedido = Yup.object({
  tipo_doc_carga: Yup.string()
    .trim()
    .transform((value) => value || null)
    .notRequired()
    .nullable(true),
  numero_doc_carga: Yup.string().notRequired(),
  data_doc_carga: Yup.date().notRequired().nullable(true),
  orgao_tombo: Yup.string()
    .trim()
    .transform((value) => value || null)
    .nullable(true),
  tombo: Yup.string()
    .transform((value) => value || null)
    .notRequired()
    .max(11, maxChars(11))
    .nullable(true),
});

export type ICargaAtualOrganicoOrCedido = Yup.InferType<
  typeof cargaAtualOrganicoOrCedido
>;

export const prefixoOrganicoOrCedido = Yup.object({
  prefixo_tipo: Yup.string().required(requiredField),
  /* data_prefixo: Yup.date().typeError(dateTypeError).required(requiredField), */
  prefixo_sequencia: Yup.string().required(requiredField),
  emprego: Yup.string().required(requiredField),
});

export type IPrefixoOrganicoOrCedido = Yup.InferType<
  typeof prefixoOrganicoOrCedido
>;

export const dadosAdicionais = Yup.object({
  referenciasPneus: Yup.array()
    .of(
      Yup.object({
        value: Yup.string().required(),
        label: Yup.string().required(),
      }),
    )
    .required('Esse campo é requerido'),
  data_operacao: Yup.date()
    .transform((value) => value || undefined)
    .notRequired()
    .nullable(true),
  observacao: Yup.string().default(''),
});
