import { Schema, model } from "mongoose"

const productSchema = Schema ({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    sold: {
        type: Number,
        required: true,
        default: 0
    },
    state: {
        type: String,
        enum: ['AVAILABLE', 'SOLD_OUT'],
        default: 'SOLD_OUT',
        required: true
    }
}, {
    versionKey: false
})

export default model("product", productSchema)