import React, { Component } from 'react';
import Clarifai from 'clarifai';
import './App.css';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Navigation from './components/navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import 'tachyons';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
  apiKey: '65fc885013ef486ea3559b7d35bcde06'
});




const particlesParameters = {
  particles: {
    number: {
      value: 80,
        density: {
        enable: true,
        value_area: 800
      }
    }
  }
}


 
class App extends Component {

constructor() {
  super()
  this.state = {
    input: '',
    imageUrl:'',
    box: {},
    route: 'signin',
    IsSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      password: '',
      entries: 0,
      joined: '',
    }
  }
}





onRouteChange = (route) => {
  if(route === 'home') {
    this.setState({IsSignedIn: true});
  } else {
    this.setState({IsSignedIn: false})
  }
  
  this.setState({route:route})
}

loadUser = (data) => {
  this.setState({user: data})
}

calculateFaceLocation = (response) => {
    const faceLocation = response.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    console.log(faceLocation)

    return {
      leftCol: faceLocation.left_col * width,
      topRow: faceLocation.top_row * height,
      rightCol: width - (faceLocation.right_col * width),
      bottomRow: height - (faceLocation.bottom_row * height) 
    }
}

displayFaceBox = (box) => {
  this.setState({box:box});
}

onInputChange = (event) => {
   this.setState({input: event.target.value})
}
onSubmitButton = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response => {
      if(response) {
        fetch('http://localhost:3001/image', {
          method:'put',
           headers: {'Content-type':'application/json'},
           body:JSON.stringify({
               id: this.state.user.id
           })
        })
        .then(response=>response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries:count }))
            
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))})
    .catch(err => console.log(err));
     
};

render() {
  return (
    <div className="App">
       <Particles className='particles' 
              params={particlesParameters}
             
            />
     <Navigation IsSignedIn={this.state.IsSignedIn} onRouteChange={this.onRouteChange} />
      { this.state.route === 'home'
        ?<div>
            <Logo />
            <Rank  
            name={this.state.user.name}
            entries={this.state.user.entries}/>
            <ImageLinkForm 
            onInputChange={this.onInputChange}
            onSubmitButton={this.onSubmitButton}
            />
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        :( 
          this.state.route === 'signin'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
      }
    
    </div>
  );
}}

export default App;
