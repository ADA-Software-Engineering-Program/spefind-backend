const mongoose = require('mongoose')
const {Schema} = mongoose

const callSchema = new Schema({
    channel_name: { type: String, required: true},
    participants: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
}, { timestamps: true, toJSON: { virtuals: true}, toObject: { virtuasl: true }})

callSchema.pre('save', function save(next) {
    if (this.participants.length> 2) {
        throw new Error('Only two participants are allowed in a call')
    }
    next()
})

const Call = mongoose.model('Call', callSchema)

module.exports = { Call }