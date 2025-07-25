import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function OrderHistory() {
    const { orders } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Order History" />
            <div className="max-w-5xl mx-auto py-16">
                <div className="mb-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator /> 
                            <BreadcrumbItem>
                                <BreadcrumbPage>Order History</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <h1 className="text-2xl font-bold mb-6">Riwayat Pembelian</h1>

                {orders.length === 0 ? (
                    <p className="text-gray-600 mb-56">Belum ada riwayat pembelian.</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="font-semibold">#{order.code}</h2>
                                    <span className={`text-sm font-medium ${order.status === 'CONFIRMED' ? 'text-green-600' : 
                                                                            order.status === 'COMPLETED' ? 'text-blue-600' :
                                                                            order.status === 'CANCELLED' ? 'text-red-600' : 'text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">Tanggal Order: {order.order_date}</p>
                                <ul className="mb-2 list-disc list-inside text-sm text-gray-700">
                                    {order.items.map(item => (
                                        <li key={item.id}>{item.name} × {item.qty}</li>
                                    ))}
                                </ul>
                                <div className="text-sm text-gray-800">
                                    Total: <strong>Rp {Number(order.grand_total).toLocaleString('id-ID')}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
