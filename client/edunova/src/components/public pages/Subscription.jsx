import React, { useEffect, useState } from "react";
import Footer from "./homePage Components/Footer";
import { SiRazorpay } from "react-icons/si";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import {
    Check, X, Star, Zap, Crown, Shield, Sparkles, ArrowRight,
    TrendingUp, Users, MessageCircle, Download, Calendar, Award,
    BookOpen, Wifi, WifiOff, Bell, Heart, ChevronRight, CheckCircle,
    Lock, Unlock, Gem, Rocket, Target, Gift
} from 'lucide-react';

const features = [
    { name: "Courses Access", free: "Limited", standard: "All Courses", premium: "All Courses", icon: BookOpen },
    { name: "Community Forums / Discussions", free: "Yes", standard: "Yes", premium: "Yes", icon: Users },
    { name: "Peer Chat", free: "No", standard: "Yes", premium: "Yes", icon: MessageCircle },
    { name: "Direct Instructor Messaging", free: "No", standard: "Yes", premium: "Yes", icon: MessageCircle },
    { name: "Bookmarks/Saved Lessons", free: "No", standard: "Yes", premium: "Yes", icon: Heart },
    { name: "Course Progress Tracking", free: "No", standard: "No", premium: "Yes", icon: TrendingUp },
    { name: "Ad-free Experience", free: "No", standard: "Yes", premium: "Yes", icon: Shield },
    { name: "Custom Profile Badge", free: "No", standard: "No", premium: "Yes", icon: Award },
    { name: "Webinars & Events Access", free: "No", standard: "No", premium: "Yes", icon: Calendar },
    { name: "Offline Viewing", free: "No", standard: "No", premium: "Yes", icon: Download },
    { name: "Personalized Recommendations", free: "Yes", standard: "Yes", premium: "Yes", icon: Target },
    { name: "Access to Public Q&A", free: "Yes", standard: "Yes", premium: "Yes", icon: MessageCircle },
    { name: "Basic Support (Email/FAQ)", free: "Yes", standard: "Yes", premium: "Yes", icon: Shield },
    { name: "Dark/Light Theme Switch", free: "Yes", standard: "Yes", premium: "Yes", icon: Sparkles },
    { name: "Activity Streaks/Leaderboard", free: "No", standard: "Yes", premium: "Yes", icon: TrendingUp },
    { name: "Learning Reminders", free: "No", standard: "Yes", premium: "Yes", icon: Bell },
    { name: "Profile Customization", free: "No", standard: "Yes", premium: "Yes", icon: Users },
    { name: "Social Sharing", free: "No", standard: "No", premium: "Yes", icon: Heart },
    { name: "Group Study Room Access", free: "No", standard: "No", premium: "Yes", icon: Users },
    { name: "Course Wishlist", free: "No", standard: "Yes", premium: "Yes", icon: Heart },
    { name: "Interactive Quizzes", free: "Limited", standard: "Yes", premium: "Yes", icon: Target },
];

const SubscriptionPage = () => {
    const [data, setData] = useState(null);
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [hoveredPlan, setHoveredPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/public/me`, { withCredentials: true })
            .then((res) => setData(res.data.data))
            .catch((err) => {});
    }, []);

    const handlePayment = async (plan) => {
        setLoading(true);
        const amountMap = {
            standard: billingCycle === "monthly" ? 1000 : 10000,
            premium: billingCycle === "monthly" ? 2500 : 25000,
        };

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/payment/purchaseSubscription`,
                {
                    amount: amountMap[plan],
                    courseId: plan + "-" + billingCycle,
                    planType: billingCycle
                },
                { withCredentials: true }
            );

            const { order } = res.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order?.amount,
                currency: order?.currency,
                name: "E-Learning Platform",
                description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
                order_id: order?.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            `${import.meta.env.VITE_API_BASE_URL}/api/users/payment/verifyPayment`,
                            {
                                razorpay_payment_id: response?.razorpay_payment_id,
                                razorpay_order_id: response?.razorpay_order_id,
                                razorpay_signature: response?.razorpay_signature,
                                planType: plan + "" + billingCycle
                            },
                            { withCredentials: true }
                        );
                        toast.success("Payment successful! Access granted.");
                    } catch (err) {
                        const message = err?.response?.data?.message || err?.message || "Something went wrong during payment.";
                        toast.error(message);
                    }
                },
                theme: {
                    color: "#10b981",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Something went wrong during payment.";
            toast.warning(message);
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            id: 'free',
            name: 'Free',
            icon: Sparkles,
            price: 0,
            description: 'Perfect for getting started',
            color: 'gray',
            gradient: 'from-gray-400 to-gray-600',
            features: [
                'Access to basic courses',
                'Community forum access',
                'Basic email support',
                'Limited quizzes',
                'Public Q&A access'
            ],
            notIncluded: [
                'Ad-free experience',
                'Direct messaging',
                'Offline downloads'
            ]
        },
        {
            id: 'standard',
            name: 'Standard',
            icon: Zap,
            price: billingCycle === 'monthly' ? 1000 : 10000,
            description: 'Best for active learners',
            color: 'emerald',
            gradient: 'from-emerald-500 to-teal-600',
            popular: true,
            features: [
                'All courses access',
                'Ad-free experience',
                'Peer chat & messaging',
                'Direct instructor messaging',
                'Bookmarks & saved lessons',
                'Activity streaks',
                'Learning reminders'
            ],
            notIncluded: [
                'Offline viewing',
                'Webinars access',
                'Custom profile badge'
            ]
        },
        {
            id: 'premium',
            name: 'Premium',
            icon: Crown,
            price: billingCycle === 'monthly' ? 2500 : 25000,
            description: 'Full premium experience',
            color: 'purple',
            gradient: 'from-purple-500 to-pink-600',
            features: [
                'Everything in Standard',
                'Offline viewing',
                'Webinars & events access',
                'Custom profile badge',
                'Course progress tracking',
                'Group study rooms',
                'Social sharing features',
                'Priority support'
            ],
            notIncluded: []
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20 mt-10">
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative px-4 md:px-20 py-16">
                    <section className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full text-emerald-700 font-semibold text-sm mb-6">
                            <Gift className="w-4 h-4" />
                            <span>Save 20% with annual billing</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent">
                            Choose Your Learning Path
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            Unlock your full potential with our flexible learning plans designed for every journey
                        </p>

                        <div className="flex justify-center mb-12">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-1.5 shadow-lg border border-emerald-100">
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setBillingCycle("monthly")}
                                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                            billingCycle === "monthly"
                                                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle("annual")}
                                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                            billingCycle === "annual"
                                                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        Annual
                                        <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                                            Save 20%
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
                        {plans.map((plan, index) => {
                            const Icon = plan.icon;
                            const isHovered = hoveredPlan === plan.id;
                            
                            return (
                                <div
                                    key={plan.id}
                                    onMouseEnter={() => setHoveredPlan(plan.id)}
                                    onMouseLeave={() => setHoveredPlan(null)}
                                    className={`relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 ${
                                        plan.popular
                                            ? "border-2 border-emerald-500 shadow-2xl transform scale-105"
                                            : "border border-gray-200 shadow-lg hover:shadow-2xl"
                                    } ${isHovered ? "transform -translate-y-2" : ""}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                                                <Star className="w-4 h-4" fill="currentColor" />
                                                Most Popular
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center mb-8">
                                        <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center shadow-xl transform ${isHovered ? "scale-110 rotate-3" : ""} transition-all duration-300`}>
                                            <Icon className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <p className="text-gray-600">{plan.description}</p>
                                    </div>

                                    <div className="text-center mb-8">
                                        <div className="flex items-end justify-center gap-1">
                                            <span className="text-lg text-gray-600">₹</span>
                                            <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                                {plan.price.toLocaleString()}
                                            </span>
                                            <span className="text-gray-600 mb-2">
                                                /{billingCycle === "monthly" ? "mo" : "yr"}
                                            </span>
                                        </div>
                                        {billingCycle === "annual" && plan.id !== 'free' && (
                                            <p className="text-sm text-emerald-600 font-semibold mt-2">
                                                Save ₹{((plan.price / 10) * 12 - plan.price).toLocaleString()}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {plan.features.slice(0, 5).map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.features.length > 5 && (
                                            <div className="text-sm text-emerald-600 font-semibold pl-8">
                                                +{plan.features.length - 5} more features
                                            </div>
                                        )}
                                    </div>

                                    {plan.id === 'free' ? (
                                        <Link to={!data || data?.role === "instructor" ? "/login" : "/"}>
                                            <button className="w-full py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center justify-center gap-2 group">
                                                Get Started
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => handlePayment(plan.id)}
                                            disabled={loading}
                                            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group ${
                                                plan.popular
                                                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl"
                                                    : "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200"
                                            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {loading ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    {plan.popular ? "Start " + plan.name + " Plan" : "Choose " + plan.name}
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </section>

                    <section className="mb-20 max-w-6xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Detailed Feature Comparison
                            </h2>
                            <p className="text-gray-600">See what's included in each plan</p>
                        </div>

                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                                            <th className="text-left p-6 font-bold text-gray-900">Features</th>
                                            <th className="text-center p-6 font-bold text-gray-900">Free</th>
                                            <th className="text-center p-6 font-bold text-gray-900 bg-gradient-to-r from-emerald-100 to-teal-100">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Zap className="w-5 h-5 text-emerald-600" />
                                                    Standard
                                                </div>
                                            </th>
                                            <th className="text-center p-6 font-bold text-gray-900">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Crown className="w-5 h-5 text-purple-600" />
                                                    Premium
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {features.map((feature, index) => {
                                            const Icon = feature.icon;
                                            return (
                                                <tr 
                                                    key={index} 
                                                    className={`border-t border-gray-100 hover:bg-emerald-50/30 transition-colors ${
                                                        index % 2 === 0 ? "bg-gray-50/50" : ""
                                                    }`}
                                                >
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-3">
                                                            <Icon className="w-5 h-5 text-emerald-600" />
                                                            <span className="font-medium text-gray-900">{feature.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center p-6">
                                                        {feature.free === "Yes" || feature.free.includes("Yes") ? (
                                                            <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                                        ) : feature.free === "No" ? (
                                                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                                                        ) : (
                                                            <span className="text-sm text-gray-600">{feature.free}</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center p-6 bg-emerald-50/30">
                                                        {feature.standard === "Yes" ? (
                                                            <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                                        ) : feature.standard === "No" ? (
                                                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                                                        ) : (
                                                            <span className="text-sm text-gray-600">{feature.standard}</span>
                                                        )}
                                                    </td>
                                                    <td className="text-center p-6">
                                                        {feature.premium === "Yes" ? (
                                                            <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                                        ) : feature.premium === "No" ? (
                                                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                                                        ) : (
                                                            <span className="text-sm text-gray-600">{feature.premium}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Trust Section */}
                    <section className="text-center max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                            </div>
                            
                            <div className="relative z-10">
                                <Rocket className="w-16 h-16 mx-auto mb-6" />
                                <h3 className="text-3xl font-bold mb-4">Ready to Start Learning?</h3>
                                <p className="text-xl mb-8 text-white/90">
                                    Join 50,000+ learners already transforming their careers
                                </p>
                                
                                <div className="flex flex-wrap justify-center gap-8 mb-8">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        <span>Secure Payment</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-5 h-5" />
                                        <span>SSL Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>30-Day Money Back</span>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4 items-center">
                                    <span className="text-sm">Powered by</span>
                                    <a href="https://razorpay.com/" target="_blank" rel="noopener noreferrer" className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all">
                                        <SiRazorpay size={40} className="text-white" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <ToastContainer position="top-right" autoClose={3000} />
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>

            <Footer />
        </>
    );
};

export default React.memo(SubscriptionPage);