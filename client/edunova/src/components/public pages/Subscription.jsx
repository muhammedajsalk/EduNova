import React, { useEffect, useState } from "react";
import Footer from "./homePage Components/Footer";
import { SiRazorpay } from "react-icons/si";
import axios from "axios";
import { Link } from "react-router-dom";

const features = [
    { name: "Courses Access", free: "Limited", standard: "All Courses", premium: "All Courses" },
    { name: "Community Forums / Discussions", free: "Yes", standard: "Yes", premium: "Yes" },
    { name: "Peer Chat", free: "No", standard: "Yes", premium: "Yes" },
    { name: "Direct Instructor Messaging", free: "No", standard: "Yes", premium: "Yes" },
    { name: "Bookmarks/Saved Lessons", free: "No", standard: "Yes", premium: "Yes" },
    { name: "Course Progress Tracking", free: "No", standard: "No", premium: "Yes" },
    { name: "Ad-free Experience", free: "No (ads shown)", standard: "Yes", premium: "Yes" },
    { name: "Custom Profile Badge", free: "No", standard: "No", premium: "Yes" },
    { name: "Webinars & Events Access", free: "No", standard: "No", premium: "Yes" },
    { name: "Offline Viewing", free: "No", standard: "No", premium: "Yes" },
    { name: "Personalized Course Recommendations", free: "Yes", standard: "Yes", premium: "Yes" },
    { name: "Access to Public Q&A", free: "Yes", standard: "Yes", premium: "Yes" },
    { name: "Basic Support (Email/FAQ)", free: "Yes", standard: "Yes", premium: "Yes" },
    { name: "Dark/Light Theme Switch", free: "Yes", standard: "Yes", premium: "Yes" },
    { name: "Activity Streaks/Leaderboard Stats", free: "No", standard: "Yes", premium: "Yes" },
    { name: "Learning Reminders/Push Notifications", free: "No", standard: "Yes", premium: "Yes" },
    { name: "Profile Customization (photo, bio)", free: "No", standard: "Yes", premium: "Yes" },
    { name: "Social Sharing (progress/achievements)", free: "No", standard: "No", premium: "Yes" },
    { name: "Group Study Room Access", free: "No", standard: "No", premium: "Yes" },
    { name: "Course Wishlist/Interest Tracker", free: "No", standard: "Yes", premium: "Yes" },
    { name: "Interactive Quizzes", free: "Yes (limited)", standard: "Yes", premium: "Yes" },
];

const SubscriptionPage = () => {

    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get("http://localhost:5000/api/public/me", { withCredentials: true })
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err))
    }, [])
    const [billingCycle, setBillingCycle] = useState("monthly");

    const handlePayment = async (plan) => {
        const amountMap = {
            standard: billingCycle === "monthly" ? 1000 : 10000, // ₹10 or ₹100
            premium: billingCycle === "monthly" ? 2500 : 25000,  // ₹25 or ₹250
        };

        console.log("amountMap", amountMap[plan])
        console.log("courseId", plan + "-" + billingCycle)

        try {
            const res = await axios.post(
                "http://localhost:5000/api/users/payment/purchaseSubscription",
                {
                    amount: amountMap[plan],
                    courseId: plan + "-" + billingCycle,
                    planType:billingCycle
                },
                { withCredentials: true }
            );

            const { order } = res.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Or hardcode it
                amount: order?.amount,
                currency: order?.currency,
                name: "E-Learning Platform",
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
                order_id: order?.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            "http://localhost:5000/api/users/payment/verifyPayment",
                            {
                                razorpay_payment_id: response?.razorpay_payment_id,
                                razorpay_order_id: response?.razorpay_order_id,
                                razorpay_signature: response?.razorpay_signature,
                                planType: plan + "" + billingCycle
                            },
                            { withCredentials: true }
                        );
                        console.log(verifyRes)
                        alert("✅ Payment successful! Access granted.");
                    } catch (err) {
                        const message = err?.response?.data?.message || err?.message || "Something went wrong during payment.";
                        alert(message)
                    }
                },
                theme: {
                    color: "#4F46E5", // Indigo
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Something went wrong during payment.";
            alert(message)
        }
    };


    return (
        <>
            <div className="font-sans text-gray-800 px-4 md:px-20 py-10 mt-10">
                {/* Header */}
                <section className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Choose Your Learning Journey
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Unlock your potential with our flexible learning plans
                    </p>

                    <div className="flex justify-center gap-4 mb-6">
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                value="monthly"
                                checked={billingCycle === "monthly"}
                                onChange={() => setBillingCycle("monthly")}
                                className="mr-1"
                            />
                            Monthly
                        </label>
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                value="annual"
                                checked={billingCycle === "annual"}
                                onChange={() => setBillingCycle("annual")}
                                className="mr-1"
                            />
                            Annual
                        </label>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Free Plan */}
                    <div className="border rounded-lg p-6 text-center shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">Free</h3>
                        <p className="text-3xl font-bold mb-1">$0</p>
                        <p className="text-sm text-gray-500 mb-4">Perfect for getting started</p>
                        <ul className="text-sm text-left space-y-2 mb-6">
                            <li>✔️ Limited courses</li>
                            <li>✔️ Community Forums</li>
                            <li>✔️ Basic Support</li>
                        </ul>
                        <button className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">
                            <Link to={!data || data?.role === "instructor" ? "/login" : "/"}>
                                Get Started
                            </Link>
                        </button>
                    </div>

                    {/* Standard Plan */}
                    <div className="border-2 border-indigo-600 rounded-lg p-6 text-center shadow-lg relative">
                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 text-xs rounded">
                            Most Popular
                        </span>
                        <h3 className="text-xl font-semibold mb-2">Standard</h3>
                        <p className="text-3xl font-bold mb-1">
                            {billingCycle === "monthly" ? "$10" : "$100"}
                            <span className="text-sm font-normal">
                                {billingCycle === "monthly" ? "/month" : "/annual"}
                            </span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Best for active learners
                        </p>
                        <ul className="text-sm text-left space-y-2 mb-6">
                            <li>✔️ All courses access</li>
                            <li>✔️ Peer Chat</li>
                            <li>✔️ Direct Instructor Messaging</li>
                            <li>✔️ Ad-free experience</li>
                        </ul>
                        <button
                            onClick={() => handlePayment("standard")}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                        >
                            Start Standard Plan
                        </button>

                    </div>

                    {/* Premium Plan */}
                    <div className="border rounded-lg p-6 text-center shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">Premium</h3>
                        <p className="text-3xl font-bold mb-1">
                            {billingCycle === "monthly" ? "$25" : "$250"}
                            <span className="text-sm font-normal">
                                {billingCycle === "monthly" ? "/month" : "/annual"}
                            </span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4">Full premium experience</p>
                        <ul className="text-sm text-left space-y-2 mb-6">
                            <li>✔️ Offline Viewing</li>
                            <li>✔️ Webinars & Events</li>
                            <li>✔️ Custom Profile Badge</li>
                            <li>✔️ Dedicated Support</li>
                        </ul>
                        <button
                            onClick={() => handlePayment("premium")}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                        >
                            Go Premium
                        </button>

                    </div>
                </section>

                {/* Comparison Table */}
                <section className="mb-16">
                    <h2 className="text-xl font-semibold text-center mb-6">Compare Plans</h2>
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="min-w-full text-sm border-collapse border text-center">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-3 text-left">Features</th>
                                    <th className="border p-3">Free</th>
                                    <th className="border p-3">Standard</th>
                                    <th className="border p-3">Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((f, i) => (
                                    <tr key={i} className="border-t hover:bg-gray-50">
                                        <td className="text-left p-3">{f.name}</td>
                                        <td>{f.free}</td>
                                        <td>{f.standard}</td>
                                        <td>{f.premium}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Payment Section */}
                <section className="text-center text-sm text-gray-500">
                    <p className="mb-3">Trusted Payment Methods</p>
                    <div className="flex justify-center gap-6">
                        <a href="https://razorpay.com/" target="blank">
                            <SiRazorpay size={40} className="text-indigo-600" />
                        </a>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    );
};

export default React.memo(SubscriptionPage);
