import { Schema, model } from "mongoose"

const billSchema = Schema ({
    billnumber: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "cart",
        required: true
    },
    totalpayable: {
        type: Number,
        required: true
    }
},
{
    versionKey: false
})

export default model('bill', billSchema)