import HelloWorld from './HelloWorld'
import GANapi from './GANapi';
import './App.css';
import alchemylogo from "./alchemylogo.svg";

function App() {
  return (
    // <div className="App">
    // <HelloWorld></HelloWorld>
    // </div>
    // Attached GANapi below HelloWorld!
    <>
      <HelloWorld />
      {/* <div>Boilerplate to attach gan API <img id="logo" src={alchemylogo}></img></div> */}
      <GANapi />
    </>
  );
}

export default App;
