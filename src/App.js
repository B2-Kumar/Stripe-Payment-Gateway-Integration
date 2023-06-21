import React, {useState} from 'react'
import logo from './logo.svg';
import './App.css';
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'


function App() {
  const [product] = useState({
    name : "React from FB",
    price: 50,
    description: "facebook"
  });

  async function handleToken(token, addresses){
    const response = await axios.post('http://localhost:5000/checkout', {token, product})

    

    console.log(response.status)

    if(response.status === 200){
      console.log("Payment is successful")
    }else {
      console.log("Payment Failed")
    }

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <StripeCheckout stripeKey={"pk_test_51NJwRvSJu8nZs0KVpJ4t46RLpMLDpAXh2UPsHtGKBfhB970AySuo8MZLixHhT64fOW39k2HkoKLnTmHy8Z9CqWvv0074khVqaQ"} token= {handleToken} name='Buy React' amount={product.price * 100} billingAddress shippingAddress>
          <button className='btn-large blue'>Buy React for {product.price}$ </button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
