import React from "react";
import { Item } from "semantic-ui-react";
import List from "./List";

const Lists = ({ lists }) => {
  return (
    <div>
      <Item.Group>
        {lists.map((item) => {
          return (
            <List key={item.id} {...item}>
              {item.title}
            </List>
          );
        })}
      </Item.Group>
    </div>
  );
};

export default Lists;
