import React from 'react';
import { Provider } from 'react-redux';
import store from './features/store';
import { ChakraProvider } from '@chakra-ui/react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

function App() {
  
  return (
    <ChakraProvider>
      <Provider store={store}>
        <div className="App">
          <h1>Todo List</h1>
          <AddTodo />
          <TodoList />
        </div>
      </Provider>
    </ChakraProvider>    
  );
}

export default App;
