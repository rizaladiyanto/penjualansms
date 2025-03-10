import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { LuLoader } from "react-icons/lu";
import { IoMdCheckmark } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import React from 'react';
import { usePage } from '@inertiajs/react';

const sales = [
    {
        name: "Muhammad Daffa",
        email: "daffa@gmail.com",
        paidAmount: "30.000",
        avatar: "DF",
    },
    {
        name: "Rizal Adriyanto",
        email: "rizaldi@gmail.com",
        paidAmount: "50.000",
        avatar: "RZ",
    },
    {
        name: "Fikri Firdaus",
        email: "fikri@gmail.com",
        paidAmount: "60.000",
        avatar: "FK",
    },
    {
        name: "Azril Argana",
        email: "azril@gmail.com",
        paidAmount: "100.000",
        avatar: "AA",
    },
    {
        name: "Arya Ajissada",
        email: "arya@gmail.com",
        paidAmount: "80.000",
        avatar: "AJ",
    },
];

const chartData = [
    { month: "January", revenue: 186 },
    { month: "February", revenue: 305 },
    { month: "March", revenue: 237 },
    { month: "April", revenue: 73 },
    { month: "May", revenue: 209 },
    { month: "June", revenue: 214 },
  ];
  
  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  };

export default function AdminDashboard() {
    const { auth } = usePage().props;
    if (auth.user.role !== 'admin') {
        return <div>You do not have access to this page.</div>;
    }
    return (
        <>
            <AdminLayout
                header={<h1> Dashboard Admin</h1>}
                children={
                    <>
                        <Head title="Dashboard Admin" />
                        <div className="max-w-screen-xl mx-auto p-5">
                            <div className="grid gap-20 md:grid-cols-2 lg:grid-cols-4">
                                <Card className="bg-white flex flex-row w-60 h-16 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <LuLoader className="w-10 h-10 text-blue-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>2</h2>
                                        <p>Unpaid</p>
                                    </div>
                                </Card>
                                <Card className="bg-white flex flex-row w-60 h-16 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <IoMdCheckmark className="w-10 h-10 text-green-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>7</h2>
                                        <p>Paid</p>
                                    </div>
                                </Card>
                                <Card className="bg-white flex flex-row w-60 h-16 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <IoWarningOutline className="w-10 h-10 text-yellow-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>0</h2>
                                        <p>Expired</p>
                                    </div>
                                </Card>
                                <Card className="bg-white flex flex-row w-60 h-16 text-sm justify-evenly rounded-md shadow">
                                    <div className="my-auto">
                                        <span>
                                            <RxCrossCircled className="w-10 h-10 text-red-600"/>
                                        </span>
                                    </div>
                                    <div className="text-slate-500 my-auto">
                                        <h2>0</h2>
                                        <p>Cancelled</p>
                                    </div>
                                </Card>
                            </div>
                            <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card>
                            <CardHeader>
                                <CardTitle>Total Revenue + $5000</CardTitle>
                                <CardDescription>January - June 2025</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig}>
                                <LineChart
                                    data={chartData}
                                    margin={{
                                    left: 12,
                                    right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Line
                                    dataKey="revenue"
                                    type="linear"
                                    stroke="var(--color-revenue)"
                                    strokeWidth={2}
                                    dot={false}
                                    />
                                </LineChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 font-medium leading-none">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="leading-none text-muted-foreground">
                                Showing total revenue for the last 6 months
                                </div>
                            </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Sales</CardTitle>
                                    <CardDescription>You made 256 sales this month</CardDescription>
                                </CardHeader>
                                <CardContent>
                                <div className="space-y-8">
                                {sales.map((sale) => (
                                    <div key={sale.name} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={sale.avatarUrl} alt={sale.name || "Avatar"} />
                                            <AvatarFallback>{sale.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1 text-sm">
                                            <p className="font-medium leading-none">{sale.name}</p>
                                            <p className="text-muted-foreground">{sale.email}</p>
                                        </div>
                                        <div className="ml-auto font-medium">Rp.{sale.paidAmount}</div>
                                    </div>
                                ))}
                                </div>
                                </CardContent>
                            </Card>
                            </div>
                            <div>
                            </div>
                        </div>
                    </>
                }
                
            />
        </>
    );
}
