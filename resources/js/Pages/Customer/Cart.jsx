import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaRegTrashCan } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Cart(){
    const { cart } = usePage().props
    const [loading, setLoading] = useState(false);

    const reloadCart = () => {
        router.reload({ only: ['cart'], preserveScroll: true });
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/checkout');
            const { snapToken } = response.data;

            const snapScript = document.createElement('script');
            snapScript.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            snapScript.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
            snapScript.async = true;
            document.body.appendChild(snapScript);

            snapScript.onload = () => {
                window.snap.pay(snapToken, {
                    onSuccess: function (result) {
                        Swal.fire('Berhasil', 'Pembayaran berhasil!', 'success');
                        window.location.href = '/checkout/success';
                    },
                    onPending: function (result) {
                        Swal.fire('Menunggu', 'Pembayaran sedang diproses.', 'info');
                    },
                    onError: function (result) {
                        Swal.fire('Gagal', 'Terjadi kesalahan saat pembayaran.', 'error');
                    },
                    onClose: function () {
                        Swal.fire('Dibatalkan', 'Kamu belum menyelesaikan pembayaran.', 'warning');
                    }
                });
            };
        } catch (error) {
            console.error("Checkout error:", error);
            if (error.response?.status === 422) {
                Swal.fire('Gagal', error.response.data.error, 'error');
            } else {
                Swal.fire('Gagal', 'Checkout gagal. Coba lagi.', 'error');
            }
        }
        setLoading(false);
    };

    const handleRemove = (itemId) => {
        Swal.fire({
            title: 'Yakin ingin menghapus?',
            text: 'Item ini akan dihapus dari keranjang kamu!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('cart.item.remove', itemId), {
                    onSuccess: () => {
                        console.log('Coupon removed successfully');
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Item berhasil dihapus!',
                            timer: 1000,
                            showConfirmButton: false,
                        }).then(() => {
                            reloadCart();
                        })
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops',
                            text: 'Gagal menghapus item.',
                        }).then(() => {
                            reloadCart();
                        })
                    }
                });
            }
        });
    };    
    
    function handleIncrease(item) {
        router.put(route('cart.item.update', item.id), {
            qty: item.qty + 1,
        })
    }
    
    function handleDecrease(item) {
        if (item.qty > 1) {
            router.put(route('cart.item.update', item.id), {
                qty: item.qty - 1,
            })
        }
    }

    const { data, setData, post, processing } = useForm({ code: '' });
    const handleApplyCoupon = (e) => {
        e.preventDefault();
        post(route('cart.apply-coupon'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Kode promo berhasil diterapkan.',
                }).then(() => {
                    reloadCart();
                })
            },            
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: errors.code || 'Terjadi kesalahan.',
                }).then(() => {
                    reloadCart();
                })
            }
        });
        setData('code', '');
        reloadCart();
    };

    const handleRemoveCoupon = () => {
        Swal.fire({
            title: 'Yakin ingin membatalkan?',
            text: 'Penggunaan kupon ini akan dibatalkan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, batalkan!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('cart.remove-coupon'), {
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Kupon dibatalkan',
                            text: 'Diskon telah dihapus dari keranjang.',
                            timer: 1000,
                            showConfirmButton: false,
                        }).then(() => {
                            reloadCart();
                        })
                    },
                    onError: (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: error.message || 'Gagal membatalkan kupon.',
                        }).then(() => {
                            reloadCart();
                        })
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Cart" />

            <div className="py-12">
                <div className="max-w-7xl mb-4 mx-auto sm:px-6 lg:px-8">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator /> 
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Cart</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="py-10">
                        <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                    </div>

                    <div className="flex space-x-3 items-start">
                        <div className="w-2/3 flex flex-col space-y-3 max-h-[80vh] overflow-y-auto">
                            {cart?.items?.length > 0 ? (
                                cart.items.map((item) => (
                                    <div key={item.id} className="bg-white p-3 border-2 border-gray-200 flex flex-col rounded-lg">
                                        <div className="flex justify-between space-x-2">
                                            <div className="w-1/2 flex">
                                                <img
                                                    src={item.product?.featured_image_url || '/images/default.png'}
                                                    alt={item.product?.name}
                                                    className="w-16 h-auto object-cover rounded-md border"
                                                />
                                                <div className="flex flex-col ml-3 justify-between">
                                                    <div>
                                                        <p className="font-semibold underline">{item.product?.name}</p>
                                                        <p className="text-xs">Rp. {Number(item.product?.price).toLocaleString('id-ID')}</p>
                                                    </div>
                                                    <div className="flex space-x-1 cursor-pointer" onClick={() => handleRemove(item.id)}>
                                                        <FaRegTrashCan className="text-xs" />
                                                        <p className="text-xs underline">Remove</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-2/5 flex justify-between h-20 space-x-3 p-3">
                                                <div className="w-1/2 flex">
                                                    <div className="w-6 h-auto py-1 place-items-center bg-slate-200 border-y-2 border-l-2 border-slate-300 my-auto rounded-l-sm hover:bg-slate-300 cursor-pointer" 
                                                    onClick={() => handleDecrease(item)}>
                                                        <FiMinus />
                                                    </div>
                                                    <div className="w-16 h-auto place-items-center bg-slate-200 border-y-2 border-slate-300 my-auto">
                                                        <p>{item.qty}</p>
                                                    </div>
                                                    <div className="w-6 h-auto py-1 place-items-center bg-slate-200 border-y-2 border-r-2 border-slate-300 my-auto rounded-r-sm hover:bg-slate-300 cursor-pointer"
                                                    onClick={() => handleIncrease(item)}>
                                                        <FiPlus />
                                                    </div>
                                                </div>
                                                <div className="w-1/2 flex justify-end my-auto">
                                                    <p>Rp. {(item.qty * item.product?.price).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    Tidak ada barang di keranjang.
                                </div>
                            )}
                        </div>

                        <div className="w-1/3 flex flex-col ">
                            <div className="p-3 bg-white border-2 border-gray-200 rounded-lg">
                                <h1 className="mb-5 font-semibold">Summary</h1>

                                <div className="flex flex-col justify-between space-y-0 mb-4">
                                    <div className="border-2 border-gray-200 p-2 flex justify-between text-sm rounded-t-md">
                                        <p>Subtotal Barang</p>
                                        <p>Rp. {Number(cart?.base_total_price || 0).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="border-x-2 border-gray-200 p-2 flex justify-between text-sm">
                                        <p>Diskon</p>
                                        <p className="text-red-500">- Rp. {Number(cart.discount_amount).toLocaleString('id-ID')}</p>
                                    </div>
                                    
                                    {cart?.jerigen_count > 0 && (
                                        <div className="border-x-2 border-t-2 border-gray-200 p-2 flex justify-between text-sm">
                                            <p>Biaya Jerigen (20.000 x {cart.jerigen_count})</p>
                                            <p>Rp. {(cart.jerigen_count * 20000).toLocaleString('id-ID')}</p>
                                        </div>
                                    )}

                                    <div className="border-2 border-gray-200 p-2 flex justify-between text-sm font-semibold rounded-b-md">
                                        <p>Grandtotal</p>
                                        <p>Rp. {Number(cart?.grand_total || 0).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                                >
                                    {loading ? "Processing..." : "Checkout"}
                                </button>
                            </div>

                            <div className="p-3 bg-white border-2 border-gray-200 rounded-lg mt-4">
                                <h1 className="mb-5 font-semibold">Promo</h1>

                                {cart?.coupon ? (
                                    <div className="p-2 border-2 border-gray-200 mb-2 text-sm text-green-600 rounded-md">
                                        Kupon <strong>{cart.coupon.code}</strong> sedang aktif — Diskon Rp {Number(cart.discount_amount).toLocaleString('id-ID')}<br/>

                                        <button
                                            onClick={handleRemoveCoupon}
                                            className=" text-red-500 underline text-xs"
                                        >
                                            Batalkan
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm mb-2">Gunakan kode promo untuk mendapatkan diskon tambahan.</p>
                                )}

                                {!cart?.coupon && (
                                    <form onSubmit={handleApplyCoupon}>
                                        <input
                                            type="text"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder="Masukkan kode promo"
                                            className="border-2 border-gray-200 p-2 rounded-md w-full mb-2"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 w-full"
                                        >
                                            Gunakan Kode Promo
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
