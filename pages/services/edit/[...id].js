//edit jasa
import Layout from "@/components/Layout";
import ServiceForm from "@/components/ServiceForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditServicePage() {
    const [serviceInfo, setServiceInfo] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/services?id=' + id).then(response => {
            setServiceInfo(response.data);
        });
    }, [id]);
    return (
        <Layout>
            <h1>Edit service</h1>
            {serviceInfo && ( //menampilkan info yang sudah ada
                <ServiceForm {...serviceInfo} />
            )}
        </Layout>
    );
}