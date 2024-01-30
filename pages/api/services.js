//file untuk confirm servis baru
import { mongooseConnect } from "@/lib/mongoose";
import { Service } from "@/models/Service";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Service.findOne({_id:req.query.id}))
        } else {
        res.json(await Service.find());
        }
    }

    if (method === 'POST') {
        const {title,description,price,images} = req.body;
        const serviceDoc = await Service.create({
            title,description,price,images,
        })
        res.json(serviceDoc);
    }

    if (method === 'PUT') {
        const {title,description,price,images,_id} = req.body;
        await Service.updateOne({_id}, {title,description,price,images});
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Service.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}