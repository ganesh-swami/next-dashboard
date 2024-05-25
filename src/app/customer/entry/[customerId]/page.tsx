"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

interface CustomerEntry {
  _id: string;
  item: string;
  totalItem: number;
  rate: number;
  totalAmount: number;
  customerId: string;
  isDeposit: boolean;
  details: string;
  date: string;
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
  const [addNew, setAddNew] = useState(false);

  const customerId = params.customerId as string;
  const [date, setDate] = useState<string>("");
  const [item, setItem] = useState("");
  const [totalItem, setTotalItem] = useState<number>(0);
  const [rate, setRate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDeposit, setIsDeposit] = useState(false);
  const [details, setDetails] = useState("");
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [extraFieldRequired, setExtraFieldRequired] = useState(true);

  useEffect(() => {
    setExtraFieldRequired(!isDeposit);
  }, [isDeposit]);

  const handleSubmit = async () => {
    // e.preventDefault();
    if (date && date !== "" && totalAmount > 0) {
      setIsLoadingAdd(true);
      const timeStamp = new Date(date).getTime();
      try {
        await axios.post("/api/customer/entry", {
          date: timeStamp,
          item,
          totalItem,
          rate,
          totalAmount,
          customerId,
          isDeposit,
          details,
        });
        toast.success("Entry created successfully!");
        // Clear form fields after successful submission
        setItem("");
        setTotalItem(0);
        setRate(0);
        setTotalAmount(0);
        setIsDeposit(false);
        setDetails("");
        // fetch new entries after successful submission
        fetchEntries();
        // reset the state
        setAddNew(false);
        setIsDeposit(false);
      } catch (error) {
        toast.error("Error creating entry. Please try again.");
        console.error("Error creating customer entry:", error);
      } finally {
        setIsLoadingAdd(false);
      }
    } else {
      toast.error("Please fill all the fields");
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(e.target.value));
    if (totalItem && e.target.value) {
      setTotalAmount(totalItem * parseFloat(e.target.value));
    }
  };

  const handleTotalItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalItem(parseInt(e.target.value));
    if (rate && e.target.value) {
      setTotalAmount(parseInt(e.target.value) * rate);
    }
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDeposit(e.target.checked);
    setTotalItem(0);
    setRate(0);
  };

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
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

  useEffect(() => {
    if (customerId && selectedMonth) {
      fetchEntries();
    }
  }, [customerId, selectedMonth]);

  useEffect(() => {
    if (entries.length > 0) {
      const totalAmount = entries.reduce((acc, entry) => {
        if (entry.isDeposit) {
          return acc - entry.totalAmount;
        }
        return acc + entry.totalAmount;
      }, 0);
      setRemaingTotalAmount(totalAmount);
      // console.log(totalAmount);
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
              onClick={() => {
                setAddNew(true);
                setIsDeposit(false);
              }}
              className="text-white bg-blue-600 transition-all hover:bg-blue-800 px-3 py-2 mx-4 rounded-full"
            >
              {" "}
              + Add{" "}
            </button>
            <button
              onClick={() => {
                setAddNew(true);
                setIsDeposit(true);
              }}
              className="text-white bg-red-600 transition-all hover:bg-red-800 px-3 py-2 mx-4 rounded-full"
            >
              {" "}
              - Deposit{" "}
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
      ) : !addNew && entries.length === 0 ? (
        <p>No entries found for the selected customer and month.</p>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
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
            {addNew && (
              <tr>
                {/* <form> */}
                <td className=" whitespace-nowrap">
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2 py-1 rounded-md"
                    required
                  />
                </td>
                <td className=" whitespace-nowrap">
                  <input
                    type="text"
                    id="item"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </td>
                <td className=" whitespace-nowrap">
                  {!isDeposit && (
                    <input
                      type="number"
                      id="totalItem"
                      value={totalItem}
                      onChange={(e) => handleTotalItem(e)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                      required={extraFieldRequired}
                      disabled={isDeposit}
                    />
                  )}
                </td>
                <td className=" whitespace-nowrap">
                  {!isDeposit && (
                    <input
                      type="number"
                      id="rate"
                      value={rate}
                      onChange={(e) => handleRateChange(e)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                      required={extraFieldRequired}
                      disabled={isDeposit}
                    />
                  )}
                </td>
                <td className=" whitespace-nowrap">
                  <input
                    type="number"
                    id="totalAmount"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
                    className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                    required
                  />
                  <button
                    onClick={handleSubmit}
                    className={
                      (isDeposit ? "bg-red-500" : "bg-indigo-500") +
                      " text-sm mx-1 px-2 py-2  text-white rounded-md focus:outline-none"
                    }
                  >
                    {isLoadingAdd ? "..." : isDeposit ? "deposit" : "save"}
                  </button>
                </td>
                {/* </form> */}
              </tr>
            )}
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  {entry.date && new Date(entry.date).toLocaleDateString()}
                </td>
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
                colSpan={4}
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
