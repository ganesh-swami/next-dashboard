import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/nextAuthConfig";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      await connect();
      const { id } = params;

      // Check if customer exists
      const customer = await Customer.findById(id);
      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }

      // Delete the customer
      await Customer.findByIdAndDelete(id);

      return NextResponse.json(
        { message: "Customer deleted successfully" },
        { status: 200 }
      );
    } else {
      return new NextResponse(JSON.stringify({ message: "unAuthorized" }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Error deleting customer" },
      { status: 500 }
    );
  }
}
