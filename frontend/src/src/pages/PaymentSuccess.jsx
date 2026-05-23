import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  useEffect(() => {
    // Clear cart or show success message
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="flex flex-col items-center space-y-4">
        <CheckCircle className="h-20 w-20 text-green-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <Link
          to="/orders"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
        >
          View My Orders
        </Link>
        <Link to="/" className="text-purple-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
