import React from 'react';
import TodoList from '../components/TodoList';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import { auth, db, store, users } from '../services/firebase';
import Select from 'react-select'

class TodoApp extends React.Component {
    constructor() {
      super();
      this.state = { 
        user: auth().currentUser,
        todos: [],
        groupTodos: [],
        todo: {},
        text: '',
        topics: [],
        topic: '',
        users: [],
        selectedUsers: [],
        selectedTopidId: '',
        topicsDD: [],

        items: [],  
        editTodo: false,
        id: 0
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleTopicChange = this.handleTopicChange.bind(this);
      this.handleNewTopicChange = this.handleNewTopicChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleTopicSubmit = this.handleTopicSubmit.bind(this);
    }

    componentDidMount() {
      console.log('componentDidMount');

      const userId = this.state.user.uid;
      let topics = [];
      let users = [];
      let topicsDD = [];
      
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

      var docRef = store.collection("topics").doc(userId).collection("topicList");
      docRef
    .onSnapshot((querySnapshot) => {
      topics = [];
      topicsDD = [];
      querySnapshot.forEach(function(doc) { 
          let topic = { topicId: doc.id, title: doc.data().title }
          topics.push(topic);
          topicsDD.push({value: doc.id, label: doc.data().title})
      });
      console.log('topics', topics);
      this.setState({topics: topics});
      this.setState({topicsDD: topicsDD});
      console.log('changes in topics');
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
          //console.log('todos',doc.data())
          let todo = { todoId: doc.id, text: doc.data().title, type:doc.data().type }
          todos.push(todo);      
      });
      //console.log(todos);
      //console.log(todos.filter(todo => todo.type == "group"));
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


      //this.setState({topics: topics});
      this.setState({users: users});
      

      // store.collection("topics").doc(userId).collection("topicList")
      //   .onSnapshot(function(doc) {
      //     console.log("Current data: ", doc.data);
      // });
      console.log(this.state.users);
    }
  
    handleChange(e) {
      this.setState({ text: e.target.value });
    }

    handleTopicChange(e) {
      //console.log(e.target.value);
      this.setState({ selectedTopidId: e.target.value });
    }

    handleNewTopicChange(e) {
      this.setState({ topic: e.target.value });
    }

    handleUserChange = (e) => {
      console.log(e);
      //this.setState({ selectedUsers: Array.isArray(e) ? e.map(x => x.value) : []});
      this.setState({ selectedUsers: Array.isArray(e) ? e.map(x => x.value) : []});
    }
  
    handleSubmit(e) {
      e.preventDefault();

      //console.log(this.state.selectedTopidId);
      //return;
      
      if (this.state.text.length === 0) {
        return;
      }

      if (this.state.selectedTopidId === 0) {
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
        
        // Firestore
        store.collection("todos").doc(userId).collection("todoList").doc(`todo-${Date.now()}`).set({
          title: text,
          type: "personal",
          topicId: this.state.selectedTopidId
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
              title: text,
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

      }

      this.setState({ text: "" });
      this.setState({ selectedUsers: [] });
    }

    handleTopicSubmit(e) {
      e.preventDefault();

      if (this.state.topic.length === 0) {
        return;
      }

      const userId = this.state.user.uid;
      const { topic } = this.state;
      
      // Firestore
      store.collection("topics").doc(userId).collection("topicList").doc(`${Date.now()}`).set({
        title: topic
      })
      .then(function(docRef) { 
        //console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });

      this.setState({ topic: '' });
    }
  
    handleDelete = todoId => {
      db.ref(`todos/${this.state.user.uid}/${todoId}`).remove();
    };

    handleTopicDelete = topicId => {
      const userId = this.state.user.uid;
      store.collection("topics").doc(userId).collection("topicList").doc(topicId).delete().then(function() {
        console.log("Topic successfully deleted!");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
      //console.log(topicId);
    }
  
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
            <div className="col-md-8">
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
                  <div className="row mt-1">
                    <div className="col-md-6">
                    <Select
                    isMulti
                    name="colors"
                    options={this.state.users}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select User"
                    onChange={this.handleUserChange}
                  />
                    </div>
                    <div className="col-md-6">
                    <select className="form-select" onChange={this.handleTopicChange}
                    >
                      <option value="0">Select Topic</option>
                      {this.state.topics.map(topic => (
                        <option key={topic.topicId} value={topic.topicId} className="border rounded p-3 mt-2">
                          {topic.title}    
                        </option> 
                      ))}
                  </select>
                    </div>
                  </div>
                  

                  <div className="mt-1">
                    
                  </div>
                  <button className={this.state.editTodo ? "btn btn-success mt-2" : "btn btn-info mt-2"}>
                    {this.state.editTodo ? "Edit" : "Add"}
                  </button>
                  </form>
                  </div>

                  {this.state.todos.length == 0 &&
                    <div className="alert alert-info mt-2" role="alert">
                      There are no todo tasks. 
                    </div>}
                    <hr></hr>
                    
                  <TodoList 
                    todos={this.state.todos}
                    topics={this.state.topics} 
                    handleDelete={this.handleDelete}
                    handleEdit={this.handleEdit}
                    sGroup={false}
                  />
              </div>
              <div className="card-footer">
                {this.state.todos.length} Item(s)
              </div>
            </div> 
            <div className="card mt-4">            
                <div className="card-body">
                <div className="card-title"><div className="text-center"><b>Group Todo List</b></div></div>
                  <div className="row">
                  </div>

                  {this.state.groupTodos.length == 0 &&
                    <div className="alert alert-info mt-2" role="alert">
                      There are no todo tasks. 
                    </div>}

                  <TodoList 
                    todos={this.state.groupTodos}
                    topics={this.state.topics}
                    isGroup={true}
                    handleDelete={this.handleDelete}
                    handleEdit={this.handleEdit}
                  />
              </div>
              <div className="card-footer">
                {this.state.groupTodos.length} Item(s)
              </div>
            </div>          
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                <div className="card-title"><div className="text-center"><b>Topics</b></div></div>
                <div className="row">
                  <form onSubmit={this.handleTopicSubmit}>
                  <input
                    id="new-topic"
                    onChange={this.handleNewTopicChange}
                    value={this.state.topic}
                    className="form-control"
                    placeholder="Topic"
                  />
                  <button className="btn btn-info mt-2">Add</button>
                  </form>
                  <ul className="list-unstyled">
                  {this.state.topics.map(topic => (
            <li key={topic.topicId} className="p-1 mt-1">
              {topic.title}
              <div className="float-right">
              <button className="btn btn-sm btn-danger ml-1" onClick={() => this.handleTopicDelete(topic.topicId)}>
              <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
              </button>
              </div>      
            </li> 
          ))}
          </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>     
          </div>
          <Footer />
        </div>
      );
    }
}

export default TodoApp;