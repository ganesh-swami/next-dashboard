"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function EnterCustomerEntry() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");
  const [item, setItem] = useState("");
  const [totalItem, setTotalItem] = useState<number>(0);
  const [rate, setRate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDeposit, setIsDeposit] = useState(false);
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extraFieldRequired, setExtraFieldRequired] = useState(true);

  useEffect(() => {
    setExtraFieldRequired(!isDeposit);
  }, [isDeposit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/customer/entry", {
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
    } catch (error) {
      toast.error("Error creating entry. Please try again.");
      console.error("Error creating customer entry:", error);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="container mx-auto p-6">
      {customerId ? (
        <>
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold mb-4">Customer Entry</h1>
            <button
              onClick={() => window.history.back()}
              className="text-white bg-blue-600 hover:bg-blue-800 rounded-full m-2 px-4 py-2"
            >
              Back
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="item" className="block font-semibold">
                Item:
              </label>
              <input
                type="text"
                id="item"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="totalItem" className="block font-semibold">
                Total Item:
              </label>
              <input
                type="number"
                id="totalItem"
                value={totalItem}
                onChange={(e) => handleTotalItem(e)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                required={extraFieldRequired}
                disabled={isDeposit}
              />
            </div>
            <div>
              <label htmlFor="rate" className="block font-semibold">
                Rate:
              </label>
              <input
                type="number"
                id="rate"
                value={rate}
                onChange={(e) => handleRateChange(e)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                required={extraFieldRequired}
                disabled={isDeposit}
              />
            </div>
            <div>
              <label htmlFor="isDeposit" className="block font-semibold">
                Is Deposit:
              </label>
              <input
                type="checkbox"
                id="isDeposit"
                checked={isDeposit}
                onChange={(e) => handleDepositChange(e)}
                className="px-4 py-2"
              />
            </div>
            <div>
              <label htmlFor="totalAmount" className="block font-semibold">
                Total Amount:
              </label>
              <input
                type="number"
                id="totalAmount"
                value={totalAmount}
                onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="details" className="block font-semibold">
                Details:
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md focus:outline-none"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}
