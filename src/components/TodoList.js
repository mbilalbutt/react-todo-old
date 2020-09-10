import React from 'react';

class TodoList extends React.Component {

    render() {
      const { todos, handleDelete, handleEdit, topics, isGroup } = this.props;
      return (
        <div className="row">
          <div className="col-md-12 ">
          <ul className="list-unstyled">
          {this.props.todos.map(todo => (
            <li key={todo.todoId} className="border rounded p-3 mt-2">
              {todo.text}<span class="badge bg-warning text-dark ml-2">{topics.length>0 ? topics.filter(topic => topic.Id == todo.topicId)[0].title : ""}</span>
              <div className="float-right">
              {isGroup == false ? 
              <button href="" className="btn btn-sm btn-info p-1" onClick={() => handleEdit(todo.todoId)}>Edit</button> : ''
              }
              <button className="btn btn-sm btn-danger ml-1 p-1" onClick={() => handleDelete(todo.todoId)}>Delete</button>
              </div>    
            </li> 
          ))}
        </ul>
          </div>
          
        </div> 
      );
    }
  }

export default TodoList;
