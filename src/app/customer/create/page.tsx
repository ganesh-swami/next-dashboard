"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreateCustomer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/customer", { name, email, phone, details });
      toast.success("Customer created successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setDetails("");
    } catch (error) {
      toast.error("Error creating customer!");
      console.error("Error creating customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-black">Create Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-500 text-white font-bold py-2 rounded-md focus:outline-none focus:bg-indigo-600"
        >
          {isLoading ? "Creating..." : "Create Customer"}
        </button>
      </form>
    </div>
  );
}
