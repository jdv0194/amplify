import React from "react";
import { Item } from "semantic-ui-react";

const List = ({ title, description, createdAt }) => {
  return (
    <Item>
      <Item.Image
        size="tiny"
        src="https://react.semantic-ui.com/images/wireframe/image.png"
      />
      <Item.Content>
        <Item.Header>{title}</Item.Header>
        <Item.Description>{description}</Item.Description>
        <Item.Extra>{new Date(createdAt).toDateString()}</Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default List;
