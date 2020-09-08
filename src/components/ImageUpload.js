import React, {Component} from 'react';
import {storage} from '../services/firebase';
import { auth, db } from '../services/firebase';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      image: null,
      url: '',
      progress: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount(){
    storage.ref('images').child(this.state.user.uid).getDownloadURL().then(url => {
      console.log(url);
      this.setState({url});
    });
  }

  handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({image}));
    }
  }

  handleUpload = () => {
      const {image} = this.state;
      const uploadTask = storage.ref(`images/${this.state.user.uid}`).put(image);

      uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({progress});
      }, 
      (error) => {
        console.log(error);
      },
      () => {
        storage.ref('images').child(image.name).getDownloadURL().then(url => {
        console.log(url);
        this.setState({url});
      })
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-3"></div>
          <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                <img className="img-fluid" src={this.state.url || 'https://www.w3schools.com/w3images/avatar2.png'} height="200" width="200" alt="Uploaded images"/>
                
              </div>
              <div className="text-center">
              {this.state.image ? <progress value={this.state.progress} max="100"/> : ""}
              
              </div>
              
              
            <br/>
            <input className="form-control mt-2" type="file" onChange={this.handleChange}/>
            <button className="btn btn-primary mt-2" onClick={this.handleUpload}>Upload</button>
            <br/>
            
            </div>
            
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>    
    );
  }
}

export default ImageUpload;