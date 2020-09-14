import React from 'react';
import Select from 'react-select'
import { auth, db, store, users } from '../services/firebase';
import { Button, Modal, ModalFooter, ModalBody, ModalHeader } from 'react-bootstrap';

class AddTodo extends React.Component {
  constructor() {
    super();
    this.state = {
      user: auth().currentUser,
      title: '',
      selectedUsers: [],
      editTodo: false,
      errors: [],
      todo: {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleClose = this.handleClose.bind(this);
    //this.handleShow = this.handleShow.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);

    const userId = this.state.user.uid;
    store.collection("todos").doc(userId).collection("todoList")
    .onSnapshot((querySnapshot) => {
      let todos = [];
      querySnapshot.forEach(function(doc) {
        //debugger
          let todo = { todoId: doc.id, title: doc.data().title, type:doc.data().type, topicId: doc.data().topicId, status: doc.data().status }
          todos.push(todo);      
      });
      if (todos.length > 0 && this.props)
        this.setState({ title: todos.filter(todo => todo.todoId == this.props.todo.todoId)[0].title});
      //console.log('todo',this.props.todo)
    });
  }

  componentDidMount(){
    
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  handleInputChange(event) {
    var key = event.target.name;
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  handleChange(e) {
    this.setState({ [e.target.name] : e.target.value });
  }

  // handleChange(e) {
  //   //console.log(e);
  //   console.log(e.target.value);
  //   this.setState({ text: e.target.value });
  //   //console.log(this.state.text);
  // }

  handleUserChange = (e) => {
    //console.log(e)
    //this.setState({ selectedUsers: Array.isArray(e) ? e.map(x => x.value) : []});
    this.setState({ selectedUsers: Array.isArray(e) ? e.map(x => x.value) : []});
  }

  handleSubmit(e) {
    e.preventDefault();
    debugger;
    
    var errors = [];

    if (this.state.title === "") {
      errors.push("title");
    }

    this.setState({
      errors: errors
    });

    if (errors.length > 0) {
      return false;
    }

    const topicId = this.props.topicId;
    const userId = this.state.user.uid;
    const { title } = this.state;
    
    const todo = this.props.todo;

    if (todo && todo.title) {
      var todoRef = store.collection("todos").doc(userId).collection("todoList").doc(todo.todoId);
      todoRef.update({
        title: title
      })
      .then(function() {
        console.log("Document successfully updated!");
      })
      .catch(function(error) {
        console.error("Error updating document: ", error);
      });

      // Edit
      // db.ref(`todos/${userId}/${todo.todoId}`)
      //   .update({
      //     text,
      //     userId
      //   })
      //   .then(_ => {
      //     this.setState({ text: "", todo: {}, editTodo: false });
      //   })
      //   .catch(error => console.log(error.message));
    }
    else {
      // Add Todo
      const todoId = `todo-${Date.now()}`;
      store.collection("todos").doc(userId).collection("todoList").doc(`todo-${Date.now()}`).set({
        title: title,
        type: "personal",
        topicId: topicId,
        status: "pending"
      })
      .then(function(docRef) { 
        //console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });

      if(this.state.selectedUsers.length > 0) {
        this.state.selectedUsers.forEach(uId => {
          store.collection("todos").doc(uId).collection("todoList").doc(`todo-${Date.now()}`).set({
            title: title,
            type: "group",
            topicId: this.state.selectedTopidId
          })
          .then(function(docRef) { 
            //console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
        });
      }

      // db.ref(`todos/${userId}/${todoId}`)
      //   .set({
      //     text,
      //     todoId,
      //     userId
      //   })
      //   .then(_ => {
      //     this.setState({ text: "" });
      //   })
      // .catch(error => console.log(error.message));
    }

    this.setState({ text: "" });
    this.setState({ selectedUsers: [] });
  }

  render() {
    const { show, users, handleClose} = this.props;
    return (
      <Modal show={show} onHide={() => handleClose()} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title ? 'Edit' : 'Add'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmit}>
            <input
              id="new-todo"
              name="title"
              onChange={this.handleChange}
              value={this.state.title}
              className={
                this.hasError("title")
                  ? "form-control is-invalid"
                  : "form-control"
              }
              placeholder="Todo Description"
            />
            <div className="invalid-feedback">
                Please enter description.
            </div>
            <Select
              isMulti
              name="users"
              options={users}
              className="basic-multi-select mt-1"
              classNamePrefix="select"
              placeholder="Select User(s)"
              onChange={this.handleUserChange}
            />
                  {/* <button className={this.state.editTodo ? "btn btn-success mt-2" : "btn btn-info mt-2"}>
                    {this.state.editTodo ? "Edit" : "Add"}
                  </button> */}
                  {/* <button className="btn btn-outline-primary mt-2">Add</button>
                  <button className="btn btn-light mt-2 ml-2" onClick={() => this.cancelAddTodo}>Cancel</button> */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddTodo;
