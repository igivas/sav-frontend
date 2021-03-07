import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { FaFilter } from 'react-icons/fa';
import * as _ from 'lodash';
import ClipLoader from 'react-spinners/ClipLoader';
import { format, parseISO } from 'date-fns';
import FormGroup from '../FormGroup';
import Select from '../FormSelect';
import FormInputSearch from '../FormInputSearch';
import Paginator from '../Paginator';
import HeaderColumn from '../HeaderColumn';
import { Container, StatusBar, TotalPanel, FilterPanel } from './styles';
import api from '../../../services/api';

interface IDataFields {
  [key: string]: any;
}

interface IResponsePaginaton {
  total: number;
  totalPage: number;
  items: IDataFields[];
}
interface IOptionsProp {
  actions?: {
    headerText: string;
    items: {
      icon: JSX.Element;
      tooltip: string;
      getRow(row: object): void;
    }[];
  };
  filters?: {
    field: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  search?: {
    searchable: boolean;
    fields: string[];
    label: string;
  };
  serverData?: {
    url: string;
    headers?: string[][] | Headers | Record<string, string> | undefined;
    serverPagination?: boolean;
  };
  order?: {
    fields: string[];
    orders?: any;
  };
}

export type IColumns = {
  field: string;
  text: string;
  type: {
    name: 'date' | 'enum' | 'text';
    format?: string;
    enum?: { [key: string]: string };
  };
  highlightRowColor?: {
    color: 'red' | 'green';
    matchValues: (string | number)[];
  }[];
}[];

interface IDataTableProps {
  columns: IColumns;
  options?: IOptionsProp;
}

interface IFieldSort {
  field: string;
  sort: 'OFF' | 'ASC' | 'DESC';
}

const RemoteSourceDataTable: React.FC<IDataTableProps> = ({
  columns,
  options,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [fieldsSort, setFieldsSort] = useState([] as IFieldSort[]);

  const [searchIpunt, setSearchInput] = useState('');
  const [query, setQuery] = useState('');

  const [dataList, setDataList] = useState<IDataFields[]>([]);

  const handleChangePage = (selectedPage: number): void => {
    setCurrentPage(selectedPage);
  };
  const columnsFields = columns?.map((column) => {
    return {
      field: column.field,
      type: column.type,
    };
  });

  const serverResponsePagination = useCallback(
    (response: IResponsePaginaton): void => {
      setTotal(response.total);
      setTotalPage(response.totalPage);
      setDataList(response.items);
    },
    [],
  );

  const dataFiltered = useCallback(
    (list: IDataFields[]): IDataFields[] => {
      const listFiltered = list.filter((item) => {
        let result = false;
        Object.entries(item).forEach((prop) => {
          if (options?.search?.fields.includes(prop[0])) {
            if (
              String(prop[1]).toLowerCase().includes(query.toLowerCase().trim())
            ) {
              result = true;
            }
          } else {
            result = true;
          }
        });
        return result;
      });
      setTotal(listFiltered.length);
      setTotalPage(Math.ceil(listFiltered.length / perPage));
      return listFiltered;
    },
    [perPage, query, options],
  );

  const getItemsPage = useCallback(
    (dataListPage: IDataFields[]): IDataFields[] => {
      const items = dataFiltered(dataListPage).slice(
        perPage * currentPage - perPage,
        perPage * currentPage,
      );

      if (items) {
        return items;
      }

      return [];
    },
    [perPage, currentPage, dataFiltered],
  );

  const handleIncrementPage = (): void => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDecrementPage = (): void => {
    if (currentPage >= 2) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect((): (() => void) | undefined => {
    const timer = setTimeout(() => {
      setQuery(searchIpunt);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchIpunt, options]);

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    setSearchInput(value);

    setCurrentPage(1);
  };

  const handleChangePerPage = (event: ChangeEvent<HTMLSelectElement>): void => {
    setPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const generateUrl = useCallback((): string => {
    let url = '';
    if (options?.serverData?.serverPagination) {
      url = `${options?.serverData?.url}?page=${currentPage}&perPage=${perPage}`;
      if (query !== '') {
        url += `&query=${query}`;
        url += `&fields=${options.search?.fields.join(',')}`;
      }
      if (fieldsSort.length > 0) {
        const fields = fieldsSort.map((field) => field.field);
        const sorts = fieldsSort.map((field) => field.sort);
        url += `&sortfields=${fields.join(',')}&sorts=${sorts.join(',')}`;
      }

      return url;
    }
    url += options?.serverData?.url;
    return url;
  }, [perPage, currentPage, options, query, fieldsSort]);

  const orderList = useCallback(
    (list) => {
      if (options?.order) {
        return _.orderBy(
          list,
          options.order.fields,
          options.order.orders ? options.order.orders : [],
        );
      }
      return list;
    },
    [options],
  );

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const response = await api.get(generateUrl());
        if (options?.serverData?.serverPagination) {
          serverResponsePagination(response.data || []);
        } else {
          setDataList(getItemsPage(response.data || []));
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    load();
  }, [
    currentPage,
    options,
    perPage,
    getItemsPage,
    generateUrl,
    serverResponsePagination,
    query,
    orderList,
    fieldsSort,
  ]);

  const perPageItems = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
  ];

  const formatValue = useCallback(
    (value, tipo) => {
      if (tipo.name === 'date') {
        try {
          return format(parseISO(value), tipo.format);
        } catch (error) {
          return value;
        }
      }
      return value;
    },

    [],
  );

  const getValue = useCallback(
    (row, column) => {
      switch (column.type.name) {
        case 'enum':
          return column.type.enum[_.get(row, column.field)];
        case 'date':
          return formatValue(_.get(row, column.field), column.type);
        default:
          return _.get(row, column.field);
      }
    },
    [formatValue],
  );

  const getColor = useCallback(
    (row) => {
      const getColumnWithHighlight = columns.find(
        (column) => !!column.highlightRowColor,
      );
      let color = 'black';
      if (getColumnWithHighlight && getColumnWithHighlight.highlightRowColor) {
        getColumnWithHighlight.highlightRowColor.forEach((highlight) => {
          console.log(highlight);

          if (
            highlight.matchValues.includes(row[getColumnWithHighlight.field])
          ) {
            console.log(row[getColumnWithHighlight.field]);

            color = highlight.color;
          }
        });
      }
      return color;
    },
    [columns],
  );

  const handleFieldSort = useCallback(
    (field) => {
      const fields = fieldsSort.filter((item) => item.field !== field.field);
      if (field.sort !== 'OFF') {
        setFieldsSort([...fields, field]);
      } else {
        setFieldsSort(fields);
      }
    },
    [fieldsSort],
  );

  return (
    <>
      <Container perPage={perPage}>
        <FilterPanel>
          {options?.filters?.map((filter) => (
            <FormGroup key={filter.label} name={filter.label}>
              <Select optionsSelect={filter.options} />
            </FormGroup>
          ))}

          {options?.filters && options.filters.length >= 2 && <FaFilter />}
          {options?.search?.searchable && (
            <FormGroup name={options.search.label}>
              <FormInputSearch
                handleChangeSearch={(event) => handleChangeSearch(event)}
                searchInput={searchIpunt}
              />
            </FormGroup>
          )}
        </FilterPanel>
        <table>
          <thead>
            <tr>
              {columns?.map((column, index) => (
                <th key={index}>
                  <HeaderColumn
                    field={column.field}
                    text={column.text}
                    handleFieldSort={handleFieldSort}
                  />
                </th>
              ))}
              {options?.actions?.items && (
                <th id="action-header">{options?.actions?.headerText}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  id="row-loading"
                  colSpan={
                    options?.actions ? columns.length + 1 : columns.length
                  }
                >
                  <ClipLoader size={30} color="#123abc" loading={loading} />
                </td>
              </tr>
            )}
            {dataList?.map((row, indexRow) => (
              <tr
                key={indexRow}
                style={{
                  color: getColor(row),
                }}
              >
                {columnsFields.map((column) => {
                  return <td key={column.field}>{getValue(row, column)}</td>;
                })}

                {options?.actions && (
                  <td id="actions">
                    <div>
                      {options?.actions.items.map((action, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => action.getRow(row)}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
      <StatusBar>
        <TotalPanel>
          {dataList.length === 0
            ? 'Nenhum registro encontrado'
            : `Mostrando de ${
                dataList.length > 0 ? perPage * currentPage - perPage + 1 : 0
              } a ${
                dataList.length + perPage * (currentPage - 1)
              } de ${total} registros`}
        </TotalPanel>
        <FormGroup name="">
          <Select optionsSelect={perPageItems} onChange={handleChangePerPage} />
        </FormGroup>
        {dataList.length >= 1 && (
          <Paginator
            totalPage={totalPage}
            currentPage={currentPage}
            handleChangePage={handleChangePage}
            handleIncrementPage={handleIncrementPage}
            handleDecrementPage={handleDecrementPage}
          />
        )}
      </StatusBar>
    </>
  );
};

export default RemoteSourceDataTable;
