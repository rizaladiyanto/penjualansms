import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import axios from "axios";

export default function EditProduct() {
    const { product } = usePage().props;
    const { data, setData,errors } = useForm({
        name: product?.name || "",
        sku: product?.sku || "",
        type: product?.type || "default_value",
        price: product?.price || "",
        sale_price: product.sale_price || "",
        stock_status: product?.stock_status || "In Stock",
        status: product?.status || "ACTIVE",
        excerpt: product?.excerpt || "",
        body: product?.body || "",
        image: null,
        manage_stock: product.manage_stock === 1 ? true : false,
        qty: product.inventory?.qty || 0,
        low_stock_threshold: product.inventory?.low_stock_threshold || 0,
    });

    const toggleManageStock = async () => {
        try {
            const response = await axios.post(`/api/products/${product.id}/toggle-manage-stock`);
            setData("manage_stock", response.data.manage_stock);
        } catch (error) {
            console.error("Error updating manage stock:", error);
        }
    };
    
    const [preview, setPreview] = useState(product?.featured_image || ""); // Untuk preview gambar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);

        // Generate preview gambar
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
    
    // Append all form fields to FormData
    Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });

    console.log("FormData being sent:");
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    axios
        .post(`/admin/produk/${product.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            console.log("Response:", response.data);
            Swal.fire({
                title: "Success!",
                text: "Product updated successfully",
                icon: "success",
            }).then(() => {
                router.visit = "/admin/products"; // Redirect after success
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Something went wrong",
                icon: "error",
            });
        });
        // console.log(data);
    };

    return (
        <AdminLayout header={<h1 className="text-2xl font-semibold">Edit Product</h1>}>
            <Head title="Edit Product - Admin" />
            <div className="max-w-screen-lg mx-auto">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* General Section */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">SKU</label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData("sku", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder="Unique code for product"
                                />
                                {errors.sku && <div className="text-red-500 text-sm">{errors.sku}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                                <textarea
                                    value={data.excerpt || ""}
                                    onChange={(e) => setData("excerpt", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Detail</label>
                                <textarea
                                    value={data.body || ""}
                                    onChange={(e) => setData("body", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                ></textarea>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Setting Section */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Setting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value=""disabled>--Status--</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </CardContent>
                        <CardHeader>
                            <CardTitle>Price Setting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={data.price || ""}
                                    onChange={(e) => setData("price", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Sale Price</label>
                                <input
                                    type="number"
                                    value={data.sale_price || ""}
                                    onChange={(e) => setData("sale_price", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder="Sale price (optional)"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Foto Produk */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Foto Produk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {preview && (
                                <div className="mb-4">
                                    <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Unggah Foto</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full border-gray-300 shadow-sm"
                                />
                            </div>
                            <div className="mb-4 text-gray-500 text-sm">
                                Klik untuk menjadikan foto sampul.
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Section */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Manage Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="form-check mb-4">
                            <input
                                type="checkbox"
                                className="form-check-input border-gray-300 rounded-sm shadow-sm"
                                checked={data.manage_stock}
                                onChange={(e) => {
                                    setData("manage_stock", e.target.checked);
                                    toggleManageStock(); // Panggil API untuk menyimpan perubahan
                                }}
                            />
                            <label className="ml-2">Enable manage stock?</label>
                            </div>
                            {data.manage_stock && (
                                <>
                                    <div className="mb-4">
                                        <label className="block">Stock Quantity</label>
                                        <input
                                            type="number"
                                            value={data.qty}
                                            onChange={(e) => setData("qty", e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block">Low Stock Threshold</label>
                                        <input
                                            type="number"
                                            value={data.low_stock_threshold}
                                            onChange={(e) => setData("low_stock_threshold", e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tombol Back & Save */}
                    <div className="col-span-1 md:col-span-3 flex justify-end space-x-2">
                        <a
                            href={route("products.index")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Back
                        </a>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
