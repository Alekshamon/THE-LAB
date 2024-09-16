/* eslint-disable camelcase */
const tables = require("../tables");

const getAllStockEvents = async (req, res) => {
  try {
    const id = req.payload;
    const [admin] = await tables.user.getUserById(id);

    if (admin[0].is_admin !== "admin" && admin[0].is_admin !== "superAdmin") {
      return res.status(401).json({ error: "Vous n'avez pas les droits" });
    }
    const [stockEvents] = await tables.stock_event.getAllStockEvent();
    res.status(200).json(stockEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const createStockEvent = async (req, res) => {
  try {
    const event_id = req.body;
    const user_id = req.payload;

    const checkUserInEvent = await tables.stock_event.checkUserEvent(
      event_id.event_id,
      user_id
    );
    if (checkUserInEvent[0].length > 0) {
      return res
        .status(400)
        .json({ error: "L'utilisateur est déjà inscrit à cet événement" });
    }
    const [stockEvent] = await tables.stock_event.createStockEvent(
      event_id.event_id,
      user_id
    );
    const [updateResult] = await tables.stock_event.decrementEventQuantity(
      event_id.event_id
    );
    if (stockEvent.affectedRows === 1 && updateResult.affectedRows === 1) {
      return res.status(201).json({
        message:
          "Utilisateur ajouté dans evenement et decrementation avec success",
      });
    }
    return res.status(500).json({ error: "Failed to create Stock Event" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

const checkUserEventById = async (req, res) => {
  const user_id = req.payload;
  const [eventsForUser] = await tables.stock_event.checkUserEventById(user_id);
  if (eventsForUser.length === 0) {
    return res
      .status(404)
      .json({ error: "Vous n'êtes pas inscrit a un Event" });
  } else {
    res.status(200).json(eventsForUser);
  }
};

const checkUserEventBUserId = async (req, res) => {
  const user_id = req.payload;
  const [eventsForUser] = await tables.stock_event.checkUserEventByUserId(
    user_id
  );
  if (eventsForUser.length === 0) {
    return res
      .status(404)
      .json({ error: "Vous n'êtes pas inscrit a un Event" });
  } else {
    res.status(200).json(eventsForUser);
  }
};

const checkUserEvent = async (req, res) => {
  try {
    const user_id = req.payload;
    const event_id = req.body;
    const [stockEvent] = await tables.stock_event.checkUserEvent({
      event_id,
      user_id,
    });
    if (stockEvent.length === 0) {
      return res
        .status(404)
        .json({ error: "Vous n'êtes pas inscrit a un Event" });
    } else {
      res.status(200).json(stockEvent);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStockEvents,
  createStockEvent,
  checkUserEventById,
  checkUserEvent,
  checkUserEventBUserId,
};
