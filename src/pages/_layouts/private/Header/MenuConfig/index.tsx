import { Menu, MenuItem, MenuList, IconButton } from '@chakra-ui/react';

import ReactSelect from 'components/form/ReactSelect';

import React, { useState } from 'react';
import { MdSettings, MdMenu } from 'react-icons/md';

import UserImage from '../UserImage';

import { Content } from './styles';

const MenuConfig: React.FC = () => {
  const [show, setshow] = useState(false);

  // const handleClick = (): void => {};

  return (
    <>
      <IconButton aria-label="Configurações" icon={<MdSettings size={30} />} />

      {/* <Content className={show ? 'active' : 'teste'}>
        <div>k.,n,mn,nm,</div>
      </Content> */}
    </>
  );
};

export default MenuConfig;
