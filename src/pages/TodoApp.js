import React from 'react';
import TodoList from '../components/TodoList';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { auth, db, store, users } from '../services/firebase';
import Select from 'react-select'
import add from '../../src/add.png';
import TopicTodo from '../components/TopicTodo';
import AddTopic from '../components/AddTopic';
import TodoTask from '../components/TodoTask';
import AddTodo from '../components/AddTodo';

import { Button, Modal, ModalFooter, ModalBody, ModalHeader } from 'react-bootstrap';

const topicHeading = {
  backgroundColor: "#509EF3",
  "display": "inline-block",
  "padding": ".25em .5em",
  fontSize: "1em",
  fontWeight: "700",
  lineHeight: "1",
  "color": "#fff",
  textAlign: "center",
  whiteSpace: "nowrap",
  verticalAlign: "baseline",
  borderRadius: ".25rem"
}

class TodoApp extends React.Component {
    constructor() {
      super();
      this.state = { 
        user: auth().currentUser,
        users: [],
        topics: [],
        todos: [],
        groupTodos: [],

        todo: {},
        text: '',
        topic: '',
        
        selectedUsers: [],
        selectedTopidId: '',

        topicId: '',

        editTodo: false,
        id: 0,
        showAddTodo : false,
        show: false
      };

      //this.handleChange = this.handleChange.bind(this);
      //this.handleSubmit = this.handleSubmit.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleShow = this.handleShow.bind(this);
      //this.handleUserChange = this.handleUserChange.bind(this);
    }

    handleShow = (topicId) => {
      this.setState({
        show: true,
        topicId: topicId,
        todo: {}
      });
    }

    handleClose(){
      this.setState({show: false});
    }

    componentDidMount() {
      const userId = this.state.user.uid;
      let topics = [];
      let users = [];
      
      // db.ref(`todos/${this.state.user.uid}`).on("value", snapshot => {
      //   let userTodos = [];
      //   snapshot.forEach(snap => {
      //     userTodos.push(snap.val());
      //   });
      //   this.setState({ todos: userTodos });
      // });

    //   users.listUsers()
    //   .then(function(listUsersResult) {
    //   listUsersResult.users.forEach(function(userRecord) {
    //     console.log('user', userRecord.toJSON());
    //   });
    // })
    // .catch(function(error) {
    //   console.log('Error listing users:', error);
    // });

    store.collection("topics").doc(userId).collection("topicList")
    .onSnapshot((querySnapshot) => {
      topics = [];
      querySnapshot.forEach(function(doc) { 
          let topic = { topicId: doc.id, title: doc.data().title }
          topics.push(topic);
      });
      this.setState({topics: topics});
    });

    store.collection("users")
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach(function(doc) {
          let user = { value: doc.data().userId, label: doc.data().email }
          users.push(user);      
      });
      this.setState({users: users});
    });

    store.collection("todos").doc(userId).collection("todoList")
    .onSnapshot((querySnapshot) => {
      let todos = [];
      querySnapshot.forEach(function(doc) {
          let todo = { todoId: doc.id, title: doc.data().title, type:doc.data().type, topicId: doc.data().topicId, status: doc.data().status }
          todos.push(todo);      
      });
      this.setState({ todos: todos.filter(todo => todo.type == "personal") });
      this.setState({ groupTodos: todos.filter(todo => todo.type == "group") });
    });

    // .get()
    // .then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //     });
    // })
    // .catch(function(error) {
    //     console.log("Error getting documents: ", error);
    // })
      
      // store.collection("topics").doc(userId).collection("topicList")
      //   .onSnapshot(function(doc) {
      //     console.log("Current data: ", doc.data);
      // });
      //console.log(this.state.users);
    }
  
    handleDelete = todoId => {
      const userId = this.state.user.uid;
      store.collection("todos").doc(userId).collection("todoList").doc(todoId).delete()
      .then(function() {
        console.log("Topic successfully deleted!");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });

      //db.ref(`todos/${this.state.user.uid}/${todoId}`).remove();
    };
  
    handleEdit = todoId => {
      //alert(todoId);
      // db.ref(`todos/${this.state.user.uid}/${todoId}`)
      //   .once("value")
      //   .then(snapshot => {
      //     this.setState({
      //       todo: snapshot.val(),
      //       text: snapshot.val().text,
      //       editTodo: true
      //     });
      //   });

        this.setState({
          todo: this.state.todos.filter(todo => todo.todoId == todoId)[0],
          text: this.state.todos.filter(todo => todo.todoId == todoId)[0].title,
          editTodo: true,
          show:true
        });
    };
  
    render() {
      return (   
        <div>
          <Header />
          <div className="container">
            <div className="row mt-4">
              <div className="col-md-8">
                <div className="card">            
                  <div className="card-body">
                    <div className="card-title"><div><b>Todo List</b></div></div>
                    {this.state.topics.map(topic => (
                    <div key={topic.topicId} className="row mb-3">
                      <div className="col-md-12">
                        <div style={{backgroundColor: "#E3F0F8"}} className="border rounded p-2">
                          <div className="mb-1">
                            <span style={topicHeading}>{topic.title}</span>
                            <button className="btn btn-sm btn-outline-primary float-right" onClick={() => this.handleShow(topic.topicId)}>Add</button>
                          </div>
                          <hr></hr>
                          {this.state.todos.filter(todo => todo.topicId == topic.topicId).length == 0 &&
                          <div className="alert alert-light p-2" role="alert">
                            No todo was found against this topic.
                          </div>}
                          {this.state.todos.filter(todo => todo.topicId == topic.topicId).map(todo => (
                            <TodoTask 
                              todo={todo}
                              title={todo.title}
                              handleEdit={this.handleEdit}
                            />
                          ))}
                        </div>         
                      </div>
                    </div>
                    ))}
                    {this.state.show &&
                    <AddTodo
                      topicId={this.state.topicId}
                      todo={this.state.todo}
                      title={this.state.text}
                      show={this.state.show}
                      users={this.state.users}
                      handleClose={this.handleClose}
                    /> }
                    {/* <Modal show={this.state.show} onHide={this.handleClose} backdrop="static">
                      <Modal.Header closeButton>
                        <Modal.Title>{this.state.editTodo ? 'Edit' : 'Add'}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <AddTodo 
                          todo={this.state.todo} 
                          users={this.state.users}
                          text={this.state.text}
                          handleChange={this.handleChange}
                          handleUserChange={this.handleUserChange}
                          handleSubmit={this.handleSubmit}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal> */}
                    {/* <TodoList 
                    todos={this.state.todos}
                    topics={this.state.topics} 
                    handleDelete={this.handleDelete}
                    handleEdit={this.handleEdit}
                    isGroup={false}
                    /> */}
                  </div>
                  <div className="card-footer">
                    {this.state.todos.length} Item(s)
                  </div>
                </div>             
                <div className="mt-2"></div>
                <div className="card">            
                  <div className="card-body">
                    <div className="card-title"><b>Group Todo List</b></div>
                    {this.state.topics.map(topic => (
                    <div key={topic.topicId} className="row mb-3">
                      <div className="col-md-12">
                        <div style={{backgroundColor: "#E3F0F8"}} className="border rounded p-2">
                          <div className="mb-1">
                            <span style={topicHeading}>{topic.title}</span>
                            <button className="btn btn-sm btn-outline-primary float-right" onClick={() => this.handleShow(topic.topicId)}>Add</button>
                          </div>
                          <hr></hr>
                          {this.state.groupTodos.filter(todo => todo.topicId == topic.topicId).length == 0 &&
                          <div className="alert alert-light p-2" role="alert">
                            No todo was found against this topic.
                          </div>}
                          {this.state.todos.filter(todo => todo.topicId == topic.topicId).map(todo => (
                            <TodoTask 
                              todo={todo}
                              title={todo.title}
                              handleEdit={this.handleEdit}
                            />
                          ))}
                        </div>         
                      </div>
                    </div>
                    ))}
                  </div>
                  <div className="card-footer">
                    {this.state.groupTodos.length} Item(s)
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <AddTopic />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
}

export default TodoApp;