const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51NJwRvSJu8nZs0KVHqnPLubSVMMpRWCCiT317uF8CBkteGJsZ9dgJ30V5ejxeSuC5ocQ9qic9G9luuw0zoZeR2PG00bHT6eG8J");
const { v4: uuidv4 } = require("uuid");
const PORT = 5000;
const app = express();
const bodyparser = require('body-parser')

app.use(express.json());
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(cors());

app.post("/checkout", async(req, res) => {
    console.log( "Request:", req.body);

    let error, status

    try {

      const {product, token} = req.body

      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      })

      const key = uuidv4()

      const charge = await stripe.charges.create(
        {
            amount: product.price * 100,
            currency: "usd", 
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase the ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip,
                },
            },
        },
        {
            key,
        }
      );

      console.log("charge:", {charge});
      status = "success";

    }catch (error){
      console.log(error)
      status = "failure"
    }

    res.json({error, status});

});

// Listen
app.listen(PORT, ()=> {
    console.log("App is listening on port 5000")
})
