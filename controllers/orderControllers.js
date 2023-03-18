const Order = require("../models/order");
const Cart = require("../models/Cart");
const User = require("../models/User");

const { collection } = require("../utils/transaction");

const { v4 } = require("uuid");

// const Flutterwave = require("flutterwave-node-v3");
// const flw = new Flutterwave(
//   process.env.FLW_PUBLIC_KEY,
//   process.env.FLW_SECRET_KEY
// );

const get_orders = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ userId }).sort({ date: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to get orders. Please try again.
                          Error: ${err}`,
    });
  }
};

const checkout = async (req, res) => {
  try {
    const userId = req.params.id;
    // const { source } = req.body;
    let cart = await Cart.findOne({ userId });
    let user = await User.findOne({ _id: userId });
    const user_email = user.email;
    const user_name = user.name;
    if (cart) {
      const charged_amount = cart.bill;
      const reference = v4();

      const depositResult = await Promise.all([
        collection({
          charged_amount,
          user_name,
          user_email,
          reference,
        }),
      ]);

      const failedTxns = depositResult.filter(
        (result) => result.status !== "success"
      );

      if (failedTxns.length) {
        const errors = failedTxns.map((a) => a.message);
        return res.status(401).json({
          status: false,
          message: errors,
        });
      }

      return res.status(200).json(depositResult[0]);
      //   if (charge) {
      //     const order = await Order.create({
      //       userId,
      //       items: cart.items,
      //       bill: cart.bill,
      //     });
      //     const data = await Cart.findByIdAndDelete({ _id: cart.id });
      //     return res.status(201).send(order);
      //   }
    } else {
      res.status(500).json("You do not have items in cart");
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to perform transaction. Please try again.
          Error: ${err}`,
    });
  }
};

// verify transaction from the webhook and update the database
const verifyWebhook = async (req, res) => {
  try {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];
    if (!signature || signature !== secretHash) {
      return res.status(401).end();
    }
    const payload = req.body;
    // It's a good idea to log all received events.
    console.log(payload);

    const csEmail = payload.customer?.email;
    const txAmount = payload.amount;
    const txReference = payload.txRef;

    // for collection webhook
    if (payload.status === "successful" && payload.currency === "NGN") {
      let user = await User.findOne({ email: csEmail });

      if (!user) {
        return {
          status: false,
          statusCode: 404,
          message: `User ${csEmail} doesn't exist`,
        };
      }

      const userId = user._id;

      let cart = await Cart.findOne({ userId });

      const order = await Order.create({
        userId,
        items: cart.items,
        bill: cart.bill,
      });

      await Cart.findByIdAndDelete({ _id: cart.id });

      return res.status(201).json({
        status: true,
        message: "Deposit Successful",
        data: { order },
      });
    }

    return res.status(401).json({
      status: true,
      message: "Transfer Failed",
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to perform transaction. Please try again.
        Error: ${err}`,
    });
  }
};

module.exports = { get_orders, checkout, verifyWebhook };
