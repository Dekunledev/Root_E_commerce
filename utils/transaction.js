const got = require("got");

const collection = async ({
  charged_amount,
  user_name,
  user_email,
  reference,
}) => {
  try {
    const response = await got
      .post("https://api.flutterwave.com/v3/payments", {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
        json: {
          tx_ref: reference,
          amount: charged_amount,
          currency: "NGN",
          payment_options: "card",
          redirect_url: "https://fluttersave.herokuapp.com/home",
          meta: {
            consumer_id: 23,
            consumer_mac: "92a3-912ba-1192a",
          },
          customer: {
            email: user_email,
            // phonenumber: mobileNumber,
            name: user_name,
          },
          customizations: {
            title: "Fluttersave",
            logo: "",
          },
        },
      })
      .json();

    return {
      status: response.status,
      message: response.message,
      link: response.data.link,
    };
  } catch (err) {
    console.log(err.code);
    console.log(err.response.body);
  }
};

module.exports = { collection };
