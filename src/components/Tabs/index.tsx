import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Container } from './styles';

interface ITabProps {
  key: string;
  title: string;
  componente: JSX.Element;
}

interface IDefaultTabsProps {
  id: string;
  initialTab: string;

  tabs: ITabProps[];
}

const DefaultTabs: React.FC<IDefaultTabsProps> = ({
  id,
  initialTab = '',
  tabs,
}) => {
  const [key, setKey] = useState(initialTab);

  return (
    <Container className="tabs">
      <Tabs id={id} activeKey={key} onSelect={(k: string) => setKey(k)}>
        {tabs.map((tab) => (
          <Tab eventKey={tab.key} key={tab.key} title={tab.title}>
            {tab.componente}
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default DefaultTabs;
