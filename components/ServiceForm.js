import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ServiceForm({
    _id,
    title: existingTitle,
    images: existingImages,
    description: existingDescription,
    price: existingPrice,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToService, setGoToServices] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    async function saveService(ev) {
        ev.preventDefault();
        const data = { title, description, price, images };
        if (_id) {
            //update
            await axios.put('/api/services', { ...data, _id });
        } else {
            //create
            await axios.post('/api/services', data);
        }
        setGoToServices(true);
    }
    if (goToService) {
        router.push('/services');
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data,);
            setImages(oldImages => {
                return [...oldImages, ...res.data];
            });
            setIsUploading(false);
        }
    }
    function updateImagesOrder(images) {
        setImages(images);
    }
    return (
        <form onSubmit={saveService}>
            <label>Service name</label>
            <input
                type="text"
                placeholder="Service name"
                value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <label>Images</label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable className="flex flex-wrap gap-2" list={images} setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24">
                            <img src={link} alt="" className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 border flex cursor-pointer items-center justify-center rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <input type="file" onChange={uploadImages} className="hidden" />
                </label>
            </div>
            <label>Service description</label>
            <textarea
                type="text"
                placeholder="Add description"
                value={description}
                onChange={ev => setDescription(ev.target.value)} />
            <label>Price (in IDR)</label>
            <input
                type="text"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)} />
            <button type="submit" className="btn-primary">Confirm</button>
        </form>
    )
}