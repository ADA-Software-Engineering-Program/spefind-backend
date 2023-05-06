const mongoose = require('mongoose');

const { Schema } = mongoose;

const pricingSchema = new Schema({
  pricing: {
    type: String,
    trim: true,
  },
});

const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;
