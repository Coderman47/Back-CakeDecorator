const { Router } = require("express");
const router = Router();
const mercadopago = require("mercadopago");

const client = new mercadopago.MercadoPagoConfig({
  accessToken:
    "TEST-2565852588308195-101420-97a8d3758ae1a68fe91dcd1b88c5ecde-243341609",
  options: { timeout: 5000 },
});

const preference = new mercadopago.Preference(client);

preference
  .create({
    external_reference: "teste",
    items: [
      {
        id: "4567",
        title: "Dummy Title",
        description: "Dummy description",
        picture_url: "http://www.myapp.com/myimage.jpg",
        category_id: "eletronico",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 100,
      },
    ],
    payment_methods: {
      default_payment_method_id: "master",
      excluded_payment_types: [
        {
          id: "ticket",
        },
      ],
      excluded_payment_methods: [
        {
          id: "",
        },
      ],
      installments: 12,
      default_installments: 1,
    },
  })
  .then((result) => {
    console.log("SUCCES: ");
    console.log(result);
  })
  .catch((error) => {
    console.log("ERROR: ");
    console.log(error);
  });

module.exports = router;
