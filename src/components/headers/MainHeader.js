import React from "react";
import { Header, Icon } from "semantic-ui-react";

const MainHeader = () => {
  return (
    <div>
      <Header as="h1" textAlign="center" icon className="mt-1 mb-1">
        <Icon name="users" />
        <Header.Content>Amplify</Header.Content>
      </Header>
    </div>
  );
};

export default MainHeader;
