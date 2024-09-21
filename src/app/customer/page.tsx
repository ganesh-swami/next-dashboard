"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  details: string;
}

export default function CustomerList() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/customer");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const viewCustomerEntry = (id: string) => {
    router.push(`/customer/entry/${id}`);
  };

  const hanldeAddCustomer = () => {
    router.push("/customer/create");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">Customer List</h1>
      <div className="flex justify-end">
        <button
          onClick={hanldeAddCustomer}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full m-4"
        >
          Add Customer
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              View
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td className="px-4 py-2 whitespace-nowrap text-black">{customer.name}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <button
                  onClick={() => viewCustomerEntry(customer._id)}
                  className="bg-blue-600 text-sm hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full"
                >
                  view
                </button>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-black">{customer.email}</td>
              <td className="px-4 py-2 whitespace-nowrap text-black">{customer.phone}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                {customer.details}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
