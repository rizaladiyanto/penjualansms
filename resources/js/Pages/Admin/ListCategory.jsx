import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, Link, useForm, router } from "@inertiajs/react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Index() {
    const { categories, search, success } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(search || "");
    const [currentPage, setCurrentPage] = useState(0);


    const openAddModal = () => {
        reset();
        setEditMode(false);
        setShowModal(true);
    };
    
    const openEditModal = (category) => {
        setEditMode(true);
        setCurrentCategory(category);
        setData({ name: category.name });
        setShowModal(true);
    };
    
    // State untuk modal
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    // Pagination configuration
    const itemsPerPage = 5;
    const offset = currentPage * itemsPerPage;
    const paginatedCategories = Array.isArray(categories) ? categories.slice(offset, offset + itemsPerPage) : [];
    const pageCount = Array.isArray(categories) ? Math.ceil(categories.length / itemsPerPage) : 0;
    
    // Form handling
    const { data, setData, post, put, errors, reset } = useForm({
        name: "",
        parent_id: "",
    });

    // Handle page change for pagination
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Menampilkan pesan sukses dengan SweetAlert
    

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (editMode) {
            put(route("categories.update", currentCategory.id), {
                onSuccess: () => {
                    setShowModal(false);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Category updated successfully!",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                },
            });
        } else {
            post(route("categories.store"), {
                onSuccess: () => {
                    setShowModal(false);
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Category added successfully!",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                },
            });
        }
    };

    const handleDelete = (category) => {
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
                router.delete(route("categories.destroy", category.id), {
                    onSuccess: () => {
                        Swal.fire("Deleted!", "Category has been deleted.", "success");
                    },
                    onError: (errors) => {
                        Swal.fire("Error!", "Failed to delete category.", "error");
                    }
                });
            }
        });
    };
    
    
    const [showSuccessAlert, setShowSuccessAlert] = useState(true);

    useEffect(() => {
        if (success && showSuccessAlert) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: success,
                timer: 3000,
                showConfirmButton: false,
            });
            setShowSuccessAlert(false); // Hentikan pemanggilan ulang setelah sukses ditampilkan
        }
    }, [success, showSuccessAlert]);

    // Handle perubahan input pencarian
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route("categories.index"), { search: searchTerm }, { preserveState: true });
        }, 500); // Delay 500ms untuk debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    console.log(categories);

    return (
        <AdminLayout header={<h1>Categories</h1>}>
            <Head title="Categories - Admin" />
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
                            placeholder="Search categories..."
                            className="border px-4 py-2 rounded-md w-64 pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
                {/* Table */}
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Category Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCategories.length > 0 ? (
                                    paginatedCategories.map((category, index) => (
                                        <tr key={category.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">
                                                {offset + index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(category)}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category)}
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
                                        <td colSpan="3" className="text-center py-4">
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="mt-6 ">
                        {/* Pagination */}
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
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md w-96 transition-all duration-200 transform">
                        <h2 className="text-lg font-bold mb-4">{editMode ? "Edit Category" : "Add Category"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
