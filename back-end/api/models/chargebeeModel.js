const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chargebeeSchema = new Schema({
    chargebee: {type: Array, required: true}
});

const tbl_chargebee = mongoose.model('chargebee_tbl', chargebeeSchema);

module.exports = tbl_chargebee;