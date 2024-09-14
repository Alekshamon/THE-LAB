/* eslint-disable camelcase */
const AbstractManager = require("./AbstractManager");

class PaymentManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "note" as configuration
    super({ table: "payment" });
  }

  async getPrivilegeById(id) {
    return this.database.query(`SELECT * FROM privilege WHERE id = ?`, [id]);
  }

  async readAll() {
    return this.database.query(`select * from ${this.table}`);
  }

  async queryAddPayment({ amount, payment_method, discount_id, user_id }) {
    return this.database.query(
      `INSERT INTO ${this.table}( amount, payment_method, discount_id, user_id) VALUES ( ?, ?, ?, ?)`,
      [amount, payment_method, discount_id, user_id]
    );
  }

  async queryGetPaymentById(user_id) {
    return this.database.query(
      `select * from ${this.table} where user_id = ?`,
      [user_id]
    );
  }

  updatePayment(bill_number, payment) {
    const columns = Object.keys(payment);
    const valuesColumns = Object.values(payment);
    const values = columns.map((column) => `${column} = ?`).join(", ");

    return this.database.query(
      `UPDATE ${this.table} set ${values} where bill_number=?`,
      [...valuesColumns, bill_number]
    );
  }

  async deletePayment({ bill_number }) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE bill_number = ?`,
      [bill_number]
    );
  }

  async getPaymentById({ bill_number }) {
    return this.database.query(
      `select * from ${this.table} where bill_number = ?`,
      [bill_number]
    );
  }

  async updateStatusPayment({ bill_number }) {
    return this.database.query(
      `UPDATE ${this.table} SET status = true WHERE bill_number = ?`,
      [bill_number]
    );
  }
}

module.exports = PaymentManager;
