import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Products() {
    const { products, success, search } = usePage().props;
    
    // State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const openEditPage = (product) => {
        router.get(route("products.edit", product.id)); // Redirect ke halaman edit
    };
    // State untuk pagination dan search
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState(search || "");
    const itemsPerPage = 10;
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const offset = currentPage * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
    // Handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };
    // Form handling
    const { data, setData, post, put, delete: destroy, errors, reset } = useForm({
        name: "",
        sku: "",
        category_id: "",
        price: "",
        sale_price: "",
        stock_status: "IN_STOCK",
        status: "ACTIVE",
    });
    const openAddModal = () => {
        reset();
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditMode(true);
        setCurrentProduct(product);
        setData({
            name: product.name,
            sku: product.sku,
            category_id: product.category_id,
            price: product.price,
            sale_price: product.sale_price,
            stock_status: product.stock_status,
            status: product.status,
            featured_image: product.featured_image,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editMode
            ? put(route("products.update", currentProduct.id), { onSuccess: () => setIsModalOpen(false) })
            : post(route("products.store"), { onSuccess: () => setIsModalOpen(false) });
    };

    const handleDelete = (product) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("products.destroy", product.id), {
                    onSuccess: () => Swal.fire("Deleted!", "Product has been deleted.", "success"),
                });
            }
        });

    // Handle perubahan input pencarian
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route("products.index"), { search: searchTerm }, { preserveState: true });
        }, 500); // Delay 500ms untuk debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Menampilkan pesan sukses dengan SweetAlert
    useEffect(() => {
        if (success) {
            Swal.fire({ icon: "success", title: "Success", text: success, timer: 3000, showConfirmButton: false });
        }
    }, [success]);

    };

    console.log(products);

    return (
        <AdminLayout header={<h1>Products</h1>}>
            <Head title="Products - Admin" />
            <div className="max-w-screen-xl mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Add Button */}
                    <button
                        onClick={openAddModal}
                        className="w-20 h-6 flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                    >
                        <FaPlus className="mr-2" />
                        Add
                    </button>
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="border px-4 py-2 rounded-md w-64 pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">SKU</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Stock</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products && products.length > 0 ? (
                                    paginatedProducts.map((product, index) => (
                                        <tr key={product.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">
                                                <img
                                                    src={product.featured_image}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-md shadow"
                                                />
                                            </td>

                                            <td className="border border-gray-300 px-4 py-2">{product.sku}</td>
                                            <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{product.price}</td>
                                            <td className="border border-gray-300 px-4 py-2">{product.status}</td>
                                            <td className="border border-gray-300 px-4 py-2">{product.stock_status}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openEditPage(product)}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        <div className="mt-6">
                            <ReactPaginate
                                previousLabel={"← Previous"}
                                nextLabel={"Next →"}
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                                containerClassName={"flex justify-center mt-4 space-x-2"}
                                pageClassName={"px-3 py-1 border rounded-md"}
                                previousClassName={"px-4 py-2"}
                                nextClassName={"px-4 py-2"}
                                activeClassName={"bg-blue-500 text-white font-bold"}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md w-96 transition-all duration-200 transform">
                        <h2 className="text-lg font-bold mb-4">{editMode ? "Edit Product" : "Add Product"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">SKU</label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData("sku", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
                                    {errors.sku && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData("type", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                        <option value="" disabled selected>Type</option>
                                        <option value="SIMPLE">SIMPLE</option>
                                </select>
                                {errors.type && <div className="text-red-500 text-sm">{errors.type}</div>}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                    {editMode ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
