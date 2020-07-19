const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeSchema = new Schema({
    created_at: {type: String, required: true},
    full_name: {type: String, required: false},
    email: {type: String, required: true},
    phone: {type: String, required: false},
    account: {type: String, required: false},
    tags: {type: Array, required: false},
    subscriptionid: {type: String, required: true}
});

const tbl_active = mongoose.model('active_tbl', activeSchema);

module.exports = tbl_active;