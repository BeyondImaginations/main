import React, { useState, useRef } from 'react';
import axios from 'axios'

import alchemylogo from "./alchemylogo.svg";

function GANapi() {
  const [gene, setNumber] = useState(0);
  // Initialize img_str with emoji data - no important meaning...
  const [img_str, setText] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBQTFRF7c5J78kt+/Xm78lQ6stH5LI36bQh6rcf7sQp671G89ZZ8c9V8c5U9+u27MhJ/Pjv9txf8uCx57c937Ay5L1n58Nb67si8tVZ5sA68tJX/Pfr7dF58tBG9d5e8+Gc6chN6LM+7spN1pos6rYs6L8+47hE7cNG6bQc9uFj7sMn4rc17cMx3atG8duj+O7B686H7cAl7cEm7sRM26cq/vz5/v767NFY7tJM78Yq8s8y3agt9dte6sVD/vz15bY59Nlb8txY9+y86LpA5LxL67pE7L5H05Ai2Z4m58Vz89RI7dKr+/XY8Ms68dx/6sZE7sRCzIEN0YwZ67wi6rk27L4k9NZB4rAz7L0j5rM66bMb682a5sJG6LEm3asy3q0w3q026sqC8cxJ6bYd685U5a457cIn7MBJ8tZW7c1I7c5K7cQ18Msu/v3678tQ3aMq7tNe6chu6rgg79VN8tNH8c0w57Q83akq7dBb9Nld9d5g6cdC8dyb675F/v327NB6////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/LvB3QAAAMFJREFUeNpiqIcAbz0ogwFKm7GgCjgyZMihCLCkc0nkIAnIMVRw2UhDBGp5fcurGOyLfbhVtJwLdJkY8oscZCsFPBk5spiNaoTC4hnqk801Qi2zLQyD2NlcWWP5GepN5TOtSxg1QwrV01itpECG2kaLy3AYiCWxcRozQWyp9pNMDWePDI4QgVpbx5eo7a+mHFOqAxUQVeRhdrLjdFFQggqo5tqVeSS456UEQgWE4/RBboxyC4AKCEI9Wu9lUl8PEGAAV7NY4hyx8voAAAAASUVORK5CYII=');

  // UseRef to select specific DOM
  /// const geneInput = useRef();

  // To request to communicate with GAN API
  // const request = require('request');

  // To get image
  // var img = new Image();
  
  const onChange = (e) => {
    // To filter out invalid values!
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex
    if (e.target.value === '' || re.test(e.target.value)) {
       setNumber(e.target.value)
    }
  };

  const onReset = () => {
    //setText('');
    setNumber(0);
  };

  // Axios to connect to api server
  const getImage = () => {
    console.log("Let's send requeest to api");

    const options = {
      method: 'POST',
      url: 'http://127.0.0.1:3000/gene',
      headers: { "Content-Type": `application/json`}, // To post data as .json
      data: {
        gene: gene
      },
    }
    
    axios(options)
      .then(function (response) {
        console.log(response);
        // img.src = "data:image/jpeg;base64," + response.data.result;
        setText("data:image/png;base64," + response.data.result)
        // setNumber(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  // Hook ref at input!
  return (
    <div>
      {/*<input name="username" placeholder="UserID" onChange={onChange} value={username} ref={nameInput} />*/}
      <input name="gene" placeholder="Gene" onChange={onChange} value={gene}/>
      <button onClick={onReset}>Reset</button>
      <button onClick={getImage}>run to build image from gene!</button>
      <img id="GANImg" src={img_str}></img>
    </div>
  );
}

export default GANapi;