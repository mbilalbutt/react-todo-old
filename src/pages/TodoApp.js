import React from 'react';
import TodoList from '../components/TodoList';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { auth, db } from '../services/firebase';

class TodoApp extends React.Component {

    constructor() {
      super();
      this.state = { 
        user: auth().currentUser,
        todos: [],
        todo: {},
        text: '',

        items: [],  
        editTodo: false,
        id: 0
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
      console.log('componentDidMount');
      db.ref(`todos/${this.state.user.uid}`).on("value", snapshot => {
        let userTodos = [];
        snapshot.forEach(snap => {
          userTodos.push(snap.val());
        });
        console.log('Firebase .on()',userTodos);
        this.setState({ todos: userTodos });
      });
    }
  
    handleChange(e) {
      this.setState({ text: e.target.value });
    }
  
    handleSubmit(e) {
      e.preventDefault();

      if (this.state.text.length === 0) {
        return;
      }

      const userId = this.state.user.uid;
      const { text } = this.state;
      
      const todo = this.state.todo;
      if (todo && todo.text) {
        // Edit
        db.ref(`todos/${userId}/${todo.todoId}`)
          .update({
            text,
            userId
          })
          .then(_ => {
            this.setState({ text: "", todo: {}, editTodo: false });
          })
          .catch(error => console.log(error.message));
      }
      else {
        // Add Todo
        const todoId = `todo-${Date.now()}`;
        db.ref(`todos/${userId}/${todoId}`)
          .set({
            text,
            todoId,
            userId
          })
          .then(_ => {
            this.setState({ text: "" });
          })
        .catch(error => console.log(error.message));
      }

      return;  
      if (this.state.editItem){
        var foundIndex = this.state.items.findIndex(x => x.id == this.state.id);
        const newItem = {
          text: this.state.text,
          id: this.state.id,
          completed: false
        };
        this.state.items[foundIndex] = newItem;
        this.setState({
          items: this.state.items,
          text: "",
          editItem: false,
          id: 0
        });
      }
      else {
        const newItem = {
          text: this.state.text,
          id: Date.now(),
          completed: false
        };
    
        const updatedItems = [...this.state.items, newItem];
    
        this.setState({
          items: updatedItems,
          text: "",
        });
      }
    }
  
    handleDelete = todoId => {
      db.ref(`todos/${this.state.user.uid}/${todoId}`).remove();
    };
  
    handleEdit = todoId => {
      db.ref(`todos/${this.state.user.uid}/${todoId}`)
        .once("value")
        .then(snapshot => {
          this.setState({
            todo: snapshot.val(),
            text: snapshot.val().text,
            editTodo: true
          });
        });
    };
  
    render() {
      return (
        <div>
          <Header />
          <div className="container">
          <div className="row mt-4">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <div className="card">            
                <div className="card-body">
                <div className="card-title"><div className="text-center"><b>Todo List</b></div></div>
                  <div className="row">
                  <form onSubmit={this.handleSubmit}>
                  <input
                    id="new-todo"
                    onChange={this.handleChange}
                    value={this.state.text}
                    className="form-control"
                    placeholder="Todo Description"
                  />
                  <button className={this.state.editTodo ? "btn btn-success mt-2" : "btn btn-info mt-2"}>
                    {this.state.editTodo ? "Edit" : "Add"}
                  </button>
                  </form>
                  </div>

                  {this.state.todos.length == 0 &&
                    <div className="alert alert-info mt-2" role="alert">
                      There are no todo tasks. 
                    </div>}

                  <TodoList 
                    todos={this.state.todos} 
                    handleDelete={this.handleDelete}
                    handleEdit={this.handleEdit}
                  />
              </div>
              <div className="card-footer">
                {this.state.todos.length} Item(s)
              </div>
            </div>           
            </div>
            <div className="col-md-3"></div>
          </div>     
          </div>
          <Footer />
        </div>
      );
    }
}

export default TodoApp;