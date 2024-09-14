/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const tables = require("../tables");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { formulaId } = req.body;

    if (!formulaId) {
      return res.status(400).json({ error: "Le formulaId est requis" });
    }
    const [privilege] = await tables.privilege.getPrivilegeById(formulaId);

    if (!privilege || !privilege.stripe_price_id) {
      return res
        .status(400)
        .json({ error: "Le priceId correspondant n'a pas été trouvé" });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: privilege.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3310/success`,
      cancel_url: `http://localhost:3310/canceled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPayment = async (req, res, next) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);
    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const payment = await tables.payment.readAll();
    res.json(payment);
  } catch (err) {
    next(err);
  }
};

const addPayment = async (req, res, next) => {
  try {
    const id = req.payload;
    const { amount, payment_method, discount_id } = req.body;
    const [exist] = await tables.payment.queryGetPaymentById(id);
    const [userDiscount] = await tables.user_discount.getIdController({
      user_id: id,
      discount_id: discount_id,
    });
    if (userDiscount.length) {
      const [percent_value] = await tables.discount.queryAddDiscountById(
        discount_id
      );
      const newAmount =
        amount - amount * (percent_value[0].percent_value / 100);
      await tables.payment.queryAddPayment({
        amount: newAmount,
        payment_method,
        discount_id,
        user_id: id,
      });
      res.json({ message: "Payment en cours avec code promo" });
    } else {
      await tables.payment.queryAddPayment({
        amount,
        payment_method,
        discount_id,
        user_id: id,
      });
      res.json({ message: "Payment en cours sans code promo" });
    }
  } catch (err) {
    next(err);
  }
};

const updatePayment = async (req, res) => {
  try {
    const { bill_number } = req.params;
    const [result] = await tables.payment.updatePayment(bill_number, req.body);
    if (result.affectedRows) {
      res.status(200).json({ message: "Payment mis à jour" });
    } else {
      res.status(401).send("probleme");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    await tables.payment.deletePayment({ bill_number: id });
    res.json({ message: "Payment a bien été supprimer" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createCheckoutSession,
  getPayment,
  addPayment,
  updatePayment,
  deletePayment,
};
