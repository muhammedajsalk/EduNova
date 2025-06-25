import React, { useState } from "react";
import Navbar from "./homePage Components/navbar";
import Footer from "./homePage Components/Footer";

const SubscriptionPage = () => {
    const [billingCycle, setBillingCycle] = useState("monthly");

    return (
        <>
            <Navbar />
            <div className="font-sans text-gray-800 px-4 md:px-20 py-10 mt-10">
                {/* Header */}
                <section className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Choose Your Learning Journey
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Unlock your potential with our flexible learning plans
                    </p>

                    {/* Billing Toggle */}
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

                {/* Plans */}
                <section className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Free Plan */}
                    <div className="border rounded-lg p-6 text-center shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">Free</h3>
                        <p className="text-3xl font-bold mb-1">$0</p>
                        <p className="text-sm text-gray-500 mb-4">Perfect for getting started</p>
                        <ul className="text-sm text-left space-y-2 mb-6">
                            <li>✔️ Access to free courses</li>
                            <li>✔️ Community access</li>
                            <li>✔️ Limited course materials</li>
                        </ul>
                        <button className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300">
                            Get Started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="border-2 border-indigo-600 rounded-lg p-6 text-center shadow-lg relative">
                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 text-xs rounded">
                            Most Popular
                        </span>
                        <h3 className="text-xl font-semibold mb-2">Pro</h3>
                        <p className="text-3xl font-bold mb-1">
                            {billingCycle === "monthly" ? "$29" : "$290"}
                            <span className="text-sm font-normal">/month</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Most popular for individual learners
                        </p>
                        <ul className="text-sm text-left space-y-2 mb-6">
                            <li>✔️ Unlimited course access</li>
                            <li>✔️ Downloadable resources</li>
                            <li>✔️ Certificate of completion</li>
                            <li>✔️ Priority support</li>
                        </ul>
                        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                            Start Pro Plan
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="border rounded-lg p-6 text-center shadow-sm">
                        <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                        <p className="text-3xl font-bold mb-1">$299</p>
                        <p className="text-sm text-gray-500 mb-4">Best value for teams</p>
                        <ul className="text-sm text-left space-y-2 mb-6">
                            <li>✔️ Team management tools</li>
                            <li>✔️ Custom analytics</li>
                            <li>✔️ Analytics dashboard</li>
                            <li>✔️ Dedicated support</li>
                        </ul>
                        <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                            Contact Sales
                        </button>
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="mb-16">
                    <h2 className="text-xl font-semibold text-center mb-6">Compare Plans</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-collapse border text-center">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-3 text-left">Features</th>
                                    <th className="border p-3">Free</th>
                                    <th className="border p-3">Pro</th>
                                    <th className="border p-3">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ["Course access", true, true, true],
                                    ["Downloadable resources", false, true, true],
                                    ["Certificate of completion", false, true, true],
                                    ["Offline viewing", false, false, true],
                                    ["Tools & Resources", false, true, true],
                                    ["Learning dashboard", false, true, true],
                                    ["Progress tracking", false, true, true],
                                    ["Custom notes", false, true, true],
                                    ["Practice exercises", false, true, true],
                                    ["Email support", true, true, true],
                                    ["Priority support", false, true, true],
                                    ["Live chat", false, false, true],
                                    ["Dedicated manager", false, false, true],
                                ].map(([feature, free, pro, ent], i) => (
                                    <tr key={i} className="border-t">
                                        <td className="text-left p-3">{feature}</td>
                                        <td>{free ? "✔️" : "—"}</td>
                                        <td>{pro ? "✔️" : "—"}</td>
                                        <td>{ent ? "✔️" : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Payment Methods */}
                <section className="text-center text-sm text-gray-500">
                    <p className="mb-3">Trusted Payment Methods</p>
                    <div className="flex justify-center gap-4">
                        <img src="https://via.placeholder.com/40x25?text=VISA" alt="Visa" />
                        <img src="https://via.placeholder.com/40x25?text=MC" alt="Mastercard" />
                        <img src="https://via.placeholder.com/40x25?text=AMEX" alt="Amex" />
                        <img src="https://via.placeholder.com/40x25?text=PayPal" alt="PayPal" />
                        <img src="https://via.placeholder.com/40x25?text=GPay" alt="Google Pay" />
                    </div>
                </section>
            </div>
            <Footer />
        </>

    );
};

export default SubscriptionPage;
