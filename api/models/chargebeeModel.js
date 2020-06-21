const mongoose = require('mongoose');

const { Schema } = mongoose;

const chargeSchema = new Schema(
  {
    task1: {
      type: String,
      required: 'task1 cannot be blank'
    },
    task2: {
      type: String,
      required: 'task2  cannot be blank'
    }
  },
  { collection: 'chargebee' }
);

module.exports = mongoose.model('chargebee', chargeSchema);