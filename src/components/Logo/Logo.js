import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import face from './face.png';
const Logo = () => {
    return(
       <div className='ma4 mt0'>
           <Tilt className="Tilt br2 shadow-2" options={{ max : 55, reverse: true, speed: 3000 }} style={{ height: 250, width: 250 }} >
           <div className="Tilt-inner pa3"> 
           <img style={{paddingTop: '30px', height: 170}} alt='Logo' src={face}/>
            </div>
           </Tilt>

       </div>
    );
}
export default Logo;