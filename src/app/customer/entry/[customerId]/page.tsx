"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface CustomerEntry {
  _id: string;
  item: string;
  totalItem: number;
  rate: number;
  totalAmount: number;
  customerId: string;
  isDeposit: boolean;
  details: string;
}

export default function CustomerEntries({
  params,
}: {
  params: { customerId: string };
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<CustomerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [totalRemaingAmount, setRemaingTotalAmount] = useState(0);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const customerId = params.customerId as string;
        const response = await axios.get(
          `/api/customer/entry/?customerId=${customerId}&month=${selectedMonth}`
        );
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching customer entries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.customerId && selectedMonth) {
      fetchEntries();
    }
  }, [params.customerId, selectedMonth]);

  useEffect(() => {
    if (entries.length > 0) {
      const totalAmount = entries.reduce((acc, entry) => {
        if (entry.isDeposit) {
          return acc - entry.totalAmount;
        }
        return acc + entry.totalAmount;
      }, 0);
      setRemaingTotalAmount(totalAmount);
      console.log(totalAmount);
    }
  }, [entries]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleAdd = () => {
    const customerId = params.customerId;

    if (customerId) {
      router.push(`/customer/entry/create?customerId=${customerId}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Customer Entries</h1>
      <div className="mb-4">
        <div className="flex flex-row justify-between">
          <div className="">
            <button
              onClick={() => handleAdd()}
              className="text-white bg-blue-600 transition-all hover:bg-blue-800 px-3 py-2 mx-4 rounded-full"
            >
              {" "}
              + Add{" "}
            </button>
          </div>
          <div className="flex flex-col">
            <label htmlFor="monthSelect" className="block font-semibold mb-2">
              Select Month:
            </label>
            <select
              id="monthSelect"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
            >
              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (month) => (
                  <option key={month} value={month}>
                    {new Date(0, month - 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No entries found for the selected customer and month.</p>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Item
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              {/* <th className="px-4 py-2 text-left">Details</th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td className="px-4 py-2 whitespace-nowrap">{entry.item}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {entry.totalItem > 0 ? entry.totalItem : ""}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {entry.rate > 0 ? entry.rate : ""}
                </td>
                <td
                  className={
                    entry.isDeposit
                      ? "bg-blue-500 text-white"
                      : "bg-white" + "px-4 py-2 whitespace-nowrap"
                  }
                >
                  {entry.totalAmount}
                </td>
                {/* <td className="px-4 py-2">{entry.customerId}</td> */}
                {/* <td className="px-4 py-2">{entry.isDeposit ? "Yes" : "No"}</td> */}
                {/* <td className="px-4 py-2">{entry.details}</td> */}
              </tr>
            ))}
            <tr>
              <td
                colSpan={3}
                className="px-6 py-3 font-bold border border-slate-200"
              >
                Total Remaining Amount:
              </td>
              <td className="px-6 py-3 font-bold border border-slate-200">
                {totalRemaingAmount}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
