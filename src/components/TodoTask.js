import React from 'react';
import { auth, db, store, users } from '../services/firebase';

class TodoTask extends React.Component {
  constructor() {
    super()
    this.state = { 
      user: auth().currentUser,
      status: ''
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
  }

  onStatusChange(e) {
    console.log(e.target.value);
    this.setState({
      status: e.target.value
    });

    const userId = this.state.user.uid;

    var todoRef = store.collection("todos").doc(userId).collection("todoList").doc(this.props.todo.todoId);
      todoRef.update({
        status: e.target.value
      })
      .then(function() {
        console.log("Document successfully updated!");
      })
      .catch(function(error) {
        console.error("Error updating document: ", error);
      });
  };

  handleDelete = todoId => {
    const userId = this.state.user.uid;
    //alert('deleted!');
    store.collection("todos").doc(userId).collection("todoList").doc(todoId).delete()
    .then(function() {
      console.log("Topic successfully deleted!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  };

  render() {
    const { handleEdit } = this.props;
    return (
      <div class="shadow-sm mb-2 rounded bg-white">
        <div className="p-2 mb-2">
          {this.props.todo.title}
        </div>
        <div style={{"border-top": "1px solid #BDC3C7"}} className="p-2" >
          <div className="row">
            <div className="col-md-8">
              <div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" id="inprogress" value="inprogress"
                 checked={"inprogress" === this.props.todo.status}
                 onChange={this.onStatusChange}
                > 
                </input>
                <label className="form-check-label" htmlFor="inprogress" >In Progress</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" id="pending" value="pending"
                checked={"pending" === this.props.todo.status}
                onChange={this.onStatusChange}
                ></input>
                <label className="form-check-label" htmlFor="pending">Pending</label>
              </div>
              <div class="form-check form-check-inline">
                <input className="form-check-input" type="radio" id="completed" value="completed"
                checked={"completed" === this.props.todo.status}
                onChange={this.onStatusChange}
                ></input>
                <label className="form-check-label" htmlFor="completed">Completed</label>
              </div>
              </div>
            </div>
            <div  className="col-md-4">
              <div className="float-right inline-block">
                <span style={{"cursor":"pointer"}} className="m-1" onClick={() => handleEdit(this.props.todo.todoId)}>
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                  </svg>
                </span>
                <span style={{"cursor":"pointer"}} className="m-1" onClick={() => this.handleDelete(this.props.todo.todoId)}>
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>   
        </div>
      </div>
    );
  }
}

export default TodoTask;
