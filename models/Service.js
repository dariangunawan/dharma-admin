import {model, Schema, models} from "mongoose";

const ServiceSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    images: [{type:String}],
}, {
    timestamps: true,
});

export const Service = models.Service || model('Service', ServiceSchema);