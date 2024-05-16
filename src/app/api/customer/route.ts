import { NextResponse } from "next/server";
import Customer from "@/models/Customer";
import connect from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/nextAuthConfig";

export const GET = async (request: Request) => {
  const session = await getServerSession(authOptions)
    if(session){  
  try {
        await connect();
        const customers= await Customer.find({});
        return new NextResponse(JSON.stringify(customers),
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
        const { name, email, phone, details } = await request.json();
        const customer = new Customer({ name, email, phone, details });
        const savedCustomer = await customer.save();
        return new NextResponse(
            JSON.stringify({ message: "Customer created", customer: savedCustomer }),
            { status: 201 }
          );
      } catch (error) {
        // res.status(400).json({ error: 'Error creating customer' });
        console.log(error);
        return new NextResponse(
            JSON.stringify({ error: 'Error creating customer' }),
            { status: 400 }
          );
      }
}else{
  return new NextResponse(
      JSON.stringify({ message: "unAuthorized" }),
      { status: 401 }
  );
}
}

