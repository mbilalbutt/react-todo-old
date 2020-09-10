import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from "../../services/firebase";

function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/app">MyTodo</Link>
                
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ml-auto">
      </ul>
      <Link className="btn btn-success" to="/profile">Profile</Link>
      <button className="btn btn-warning ml-1" onClick={() => auth().signOut()}>
                        Logout
                </button>
    </div>
            </div>            
        </nav> 
    );
}

export default Header;