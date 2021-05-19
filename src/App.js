import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { useEffect, useReducer, useState } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsConfig from "./aws-exports";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

import { listLists } from "./graphql/queries";
import { createList } from "./graphql/mutations";
import { onCreateList } from "./graphql/subscriptions";

import MainHeader from "./components/headers/MainHeader";
import Lists from "./components/List/Lists";
import { Button, Container, Form, Icon, Modal } from "semantic-ui-react";

Amplify.configure(awsConfig);

const intitialState = {
  title: "",
  description: "",
};

const listReducer = (state = intitialState, action) => {
  switch (action.type) {
    case "DESCRIPTION_CHANGED":
      return { ...state, description: action.value };
    case "TITLE_CHANGED":
      return { ...state, title: action.value };
    default:
      console.log("Default action for: ", action);
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(listReducer, intitialState);

  const [list, setList] = useState([]);
  const [newList, setNewList] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchList = async () => {
    const { data } = await API.graphql(graphqlOperation(listLists));
    setList(data.listLists.items);
    console.log(data);
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    if (newList !== "") {
      setList([newList, ...list]);
    }
  }, [newList]);

  const addToList = ({ data }) => {
    setNewList(data.onCreateList);
  };

  useEffect(() => {
    let subscription = API.graphql(graphqlOperation(onCreateList)).subscribe({
      next: ({ provider, value }) => addToList(value),
    });
  }, []);

  const toggleModal = (shouldOpen) => {
    setIsModalOpen(shouldOpen);
  };

  const saveList = async () => {
    const { title, description } = state;
    const result = await API.graphql(
      graphqlOperation(createList, { input: { title, description } })
    );
    toggleModal(false);
    console.log("Save data with results", result);
  };

  return (
    <AmplifyAuthenticator>
      <AmplifySignOut />
      <Container style={{ height: "100vh" }}>
        <Button onClick={() => toggleModal(true)} className="floatingButton">
          <Icon name="plus" className="floatingButton_icon" />
        </Button>
        <div className="App">
          <MainHeader />
          <Lists lists={list} />
        </div>
      </Container>
      <Modal open={isModalOpen} dimmer="blurring">
        <Modal.Header>Create List</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              error={true ? false : { content: "Please add name to list" }}
              label="Title"
              placeholder="My List"
              value={state.title}
              onChange={(e) =>
                dispatch({ type: "TITLE_CHANGED", value: e.target.value })
              }
            ></Form.Input>
            <Form.TextArea
              label="Description"
              placeholder="Description about list"
              value={state.description}
              onChange={(e) =>
                dispatch({ type: "DESCRIPTION_CHANGED", value: e.target.value })
              }
            ></Form.TextArea>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => toggleModal(false)} negative>
            Cancel
          </Button>
          <Button onClick={saveList} positive>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </AmplifyAuthenticator>
  );
}

export default App;
