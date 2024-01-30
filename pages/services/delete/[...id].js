import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteServicePage() {
    const router = useRouter();
    const [serviceInfo, setServiceInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/services?id'+id).then(response => {
            setServiceInfo(response.data);
        });
    });
    function goBack() {
        router.push('/services');
    }
    async function deleteService() {
        await axios.delete('/api/services/?id='+id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Are you sure?</h1>
            <div className="flex gap-2 justify-center">
                <button onClick={deleteService} className="btn-red">Yes</button>
                <button onClick={goBack} className="btn-default">No</button>
            </div>
        </Layout>
    )
}