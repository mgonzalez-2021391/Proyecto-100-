import { model, Schema} from "mongoose"

const cartSchema = Schema ({
    ordernumber: {
        type: Number,
        unique: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
},{
    versionKey: false
})

export default model('cart', cartSchema)