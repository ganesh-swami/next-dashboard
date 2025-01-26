"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { set } from "mongoose";

interface CustomerEntry {
  _id: string;
  item: string;
  weight: number;
  totalItem: number;
  rate: number;
  totalAmount: number;
  customerId: string;
  isDeposit: boolean;
  details: string;
  date: string;
}

interface Customer {
  _id: string;
  name: string;
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
  const [totalNag, setTotalNag] = useState(0);
  const [addNew, setAddNew] = useState(false);
  const customerId = params.customerId as string;
  const [customer, setCustomer] = useState<Customer>({
    _id: customerId,
    name: "",
  });
  const [date, setDate] = useState<string>("");
  const [item, setItem] = useState("");
  const [totalItem, setTotalItem] = useState<number>(0);
  const [rate, setRate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDeposit, setIsDeposit] = useState(false);
  const [details, setDetails] = useState("");
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [extraFieldRequired, setExtraFieldRequired] = useState(true);
  const [weight, setWeight] = useState(0);

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
          weight,
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
        setWeight(0);
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

  const handleWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(parseFloat(e.target.value));
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
      setEntries(response.data.customerEntries);
      setCustomer(response.data.customer);
    } catch (error) {
      console.error("Error fetching customer entries:", error);
      toast.error("Error fetching customer entries");
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
      const totlNag = entries.reduce((acc,entry)=>{
        
        return acc + entry.totalItem;
      },0);
      console.log("totalNag",totlNag);
      setRemaingTotalAmount(totalAmount);
      setTotalNag(totlNag);
      // console.log(totalAmount);
    }
  }, [entries]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleDelete = async (_id: string) => {
    try {
      var result = confirm("Want to delete?");
      if (result) {
        //Logic to delete the item
        const response = await axios.patch(`/api/customer/entry/`, {
          _id: _id,
        });
        toast.success("Entry deleted successfully!");
        fetchEntries();
      }
    } catch (error) {
      toast.error("Error deleting entries");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-12 text-center text-gray-700">
        {customer && customer.name ? customer.name : ""}
      </h1>
      <div className="mb-4 noPrint">
        <div className="flex flex-row justify-between">
          <div className="">
            <button
              onClick={() => {
                setAddNew(true);
                setIsDeposit(false);
              }}
              className="text-white bg-blue-600 transition-all hover:bg-blue-800 px-3 py-2 mx-4 my-1 rounded-full"
            >
              {" "}
              + Add{" "}
            </button>
            <button
              onClick={() => {
                setAddNew(true);
                setIsDeposit(true);
              }}
              className="text-white bg-red-600 transition-all hover:bg-red-800 px-3 py-2 mx-4  my-1 rounded-full"
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
        <>
          <div className="overflow-x-scroll">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border border-slate-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nag
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider noPrint">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 border border-slate-200">
                {addNew && (
                  <tr className="noPrint">
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
                    <td className="whitespace-nowrap">
                      <input
                        type="text"
                        id="item"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        className="w-32 px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </td>
                    <td className=" whitespace-nowrap">
                      {!isDeposit && (
                        <input
                          type="number"
                          id="weight"
                          value={weight}
                          onChange={(e) => handleWeight(e)}
                          className="w-20 px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                          required={extraFieldRequired}
                          disabled={isDeposit}
                        />
                      )}
                    </td>
                    <td className=" whitespace-nowrap">
                      {!isDeposit && (
                        <input
                          type="number"
                          id="totalItem"
                          value={totalItem}
                          onChange={(e) => handleTotalItem(e)}
                          className="w-20 px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
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
                          className="w-20 px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                          required={extraFieldRequired}
                          disabled={isDeposit}
                        />
                      )}
                    </td>
                    <td className="w-40 whitespace-nowrap">
                      <input
                        type="number"
                        id="totalAmount"
                        value={totalAmount}
                        onChange={(e) =>
                          setTotalAmount(parseFloat(e.target.value))
                        }
                        className="w-24 px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </td>
                    <td className="w-40 whitespace-nowrap text-center">
                      <button
                        onClick={handleSubmit}
                        className={
                          (isDeposit ? "bg-red-500" : "bg-indigo-500") +
                          " w-15 text-sm px-4 py-2  text-white rounded-md focus:outline-none"
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
                    <td className="px-4 py-2 whitespace-nowrap">
                      {entry.item}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {entry.weight > 0 ? entry.weight : ""}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {entry.totalItem > 0 ? entry.totalItem : ""}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {entry.rate > 0 ? entry.rate : ""}
                    </td>
                    <td
                      className={
                        (entry.isDeposit ? "text-blue-700 font-bold " : "") +
                        "px-4 py-2 whitespace-nowrap border border-slate-200"
                      }
                    >
                      {entry.isDeposit ? "-" : ""}
                      {entry.totalAmount}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap noPrint">
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="bg-red-600 text-sm hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                          />{" "}
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-2 font-bold border border-slate-200"
                  >
                    Total Remaining Amount:
                  </td>
                  <td
                    colSpan={1}
                    className="px-6 py-2 font-bold border border-slate-200"
                  >
                    
                  </td>
                  <td
                    colSpan={1}
                    className="px-6 py-2 font-bold border border-slate-200"
                  >
                    
                  </td>
                  <td
                    colSpan={2}
                    className="px-4 py-2 font-bold border border-slate-200"
                  >
                    {totalRemaingAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-left mt-8 noPrint">
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Print
            </button>
          </div>
        </>
      )}
    </div>
  );
}
