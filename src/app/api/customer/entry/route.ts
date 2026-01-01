import { NextResponse } from "next/server";
import CustomerEntry from "@/models/CustomerEntry";
import Customer from "@/models/Customer";
import connect from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/nextAuthConfig";

export const GET = async (request: Request) => {
    const session = await getServerSession(authOptions)
    if(session){
        // new here
        try {
            const { searchParams } = new URL(request.url);
            const customerId = searchParams.get("customerId");
            const searchMonth: string | null = searchParams.get("month");
            const month: number = searchMonth ? parseInt(searchMonth) : new Date().getMonth() + 1;
            const date = new Date();
            const startOfCurrentMonth = new Date(date.getFullYear()-1, month-1, 1);
            const endOfCurrentMonth = new Date(date.getFullYear()-1, month, 0);
            await connect();
            const customerEntries= await CustomerEntry.find({
                customerId,
                isDeleted:false,
                date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
            });
            const customer = await Customer.findOne({_id:customerId});
                
            const result = {
                customerEntries: customerEntries ? customerEntries : [],
                customer:customer,
            };
            return new NextResponse(JSON.stringify(result),
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
                weight,
                rate,
                totalAmount,
                customerId,
                isDeposit,
                date,
                details,
            } = await request.json();
        
        const customerEntry = new CustomerEntry({
            item,
            totalItem,
            weight,
            rate,
            totalAmount,
            customerId,
            isDeposit,
            date,
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

export const PATCH = async (request: Request) => {
    const session = await getServerSession(authOptions)
    if(session){
        try {
            await connect();
            const {
                _id
            } = await request.json();

            await CustomerEntry.findOneAndUpdate({_id}, {isDeleted:true});
            return new NextResponse(
                JSON.stringify({ message: "Customer Entry deleted" }),
                { status: 200 }
            );
        }
        catch (error) {
            return new NextResponse(
                JSON.stringify({ message: "Error while delete" }),
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
