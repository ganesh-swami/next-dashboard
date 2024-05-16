import { NextResponse } from "next/server";
import CustomerEntry from "@/models/CustomerEntry";
import connect from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/nextAuthConfig";

export const GET = async (request: Request) => {
    const session = await getServerSession(authOptions)
    if(session){
        try {
            const { searchParams } = new URL(request.url);
            const customerId = searchParams.get("customerId");
            const searchMonth: string | null = searchParams.get("month");
            const month: number = searchMonth ? parseInt(searchMonth) : new Date().getMonth() + 1;
            const date = new Date();
            const startOfCurrentMonth = new Date(date.getFullYear(), month-1, 1);
            const endOfCurrentMonth = new Date(date.getFullYear(), month, 0);
            await connect();
            const customerEntries= await CustomerEntry.find({
                customerId,
                createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
            });
            return new NextResponse(JSON.stringify(customerEntries?customerEntries : []),
            { status: 200 });
        } catch (error) {
            return new NextResponse(
                JSON.stringify({ message: "Not Found" }),
                { status: 400 }
            );
        }
    }
    else{
        return new NextResponse(
            JSON.stringify({ message: "unAuthorized" }),
            { status: 401 }
        );
    }
}

export const POST = async (request: Request) => {
    const session = await getServerSession(authOptions)
    if(session){
        try {
            await connect();
            const {
                item,
                totalItem,
                rate,
                totalAmount,
                customerId,
                isDeposit,
                details,
            } = await request.json();
        
        const customerEntry = new CustomerEntry({
            item,
            totalItem,
            rate,
            totalAmount,
            customerId,
            isDeposit,
            details,
        });

        const savedCustomerEntry = await customerEntry.save();
            return new NextResponse(
                JSON.stringify({ message: "Customer Entry created", customer: savedCustomerEntry }),
                { status: 201 }
            );
        } catch (error) {
            // res.status(400).json({ error: 'Error creating customer' });
            console.log(error);
            return new NextResponse(
                JSON.stringify({ error: 'Error creating customer Entry' }),
                { status: 400 }
            );
        }
    }
    else{
        return new NextResponse(
            JSON.stringify({ message: "unAuthorized" }),
            { status: 401 }
        );
    }
}

