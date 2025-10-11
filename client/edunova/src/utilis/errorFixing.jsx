import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Home, BookOpen, Mail, ArrowLeft, Wrench, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const ErrorFixingPage = () => {
    const [isRetrying, setIsRetrying] = useState(false);
    const [animationStep, setAnimationStep] = useState(0);
    const [fixingStep, setFixingStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setAnimationStep(prev => (prev + 1) % 3);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fixingTimer = setInterval(() => {
            setFixingStep(prev => (prev + 1) % 4);
        }, 1500);
        return () => clearInterval(fixingTimer);
    }, []);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => {
            setIsRetrying(false);
            // Add your retry logic here
        }, 2000);
    };

    const FloatingElement = ({ delay, children }) => (
        <div
            className={`animate-bounce`}
            style={{ animationDelay: `${delay}ms`, animationDuration: '3s' }}
        >
            {children}
        </div>
    );

    // Man fixing animation component
    const ManFixingAnimation = () => (
        <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Computer/Server */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-gray-700 rounded-lg">
                <div className="w-full h-3 bg-emerald-400 rounded-t-lg"></div>
                <div className="p-2">
                    <div className="grid grid-cols-3 gap-1">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 rounded ${i < fixingStep + 2 ? 'bg-emerald-400' : 'bg-gray-500'
                                    } transition-colors duration-500`}
                            ></div>
                        ))}
                    </div>
                </div>
                {/* Screen glow */}
                <div className="absolute inset-0 bg-emerald-400 opacity-20 rounded-lg animate-pulse"></div>
            </div>

            {/* Man figure */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-x-8">
                {/* Head */}
                <div className="w-8 h-8 bg-amber-200 rounded-full mb-1 relative">
                    <div className="absolute top-1 left-2 w-1 h-1 bg-gray-700 rounded-full"></div>
                    <div className="absolute top-1 right-2 w-1 h-1 bg-gray-700 rounded-full"></div>
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-gray-700 rounded-full"></div>
                </div>

                {/* Body */}
                <div className="w-6 h-12 bg-emerald-600 rounded-t-lg mx-auto relative">
                    {/* Arms */}
                    <div
                        className={`absolute -left-2 top-2 w-4 h-2 bg-emerald-600 rounded-full transform transition-transform duration-500 ${fixingStep % 2 === 0 ? 'rotate-45' : '-rotate-12'
                            }`}
                    ></div>
                    <div className="absolute -right-2 top-2 w-4 h-2 bg-emerald-600 rounded-full transform -rotate-45"></div>
                </div>

                {/* Legs */}
                <div className="flex justify-center space-x-1">
                    <div className="w-2 h-8 bg-blue-800 rounded-b-lg"></div>
                    <div className="w-2 h-8 bg-blue-800 rounded-b-lg"></div>
                </div>
            </div>

            {/* Tools */}
            <div
                className={`absolute top-4 right-8 transform transition-all duration-500 ${fixingStep % 2 === 0 ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
                    }`}
            >
                <Wrench className="w-6 h-6 text-emerald-600" />
            </div>

            <div
                className={`absolute top-12 left-8 transform transition-all duration-700 ${fixingStep % 3 === 0 ? 'rotate-45 scale-105' : 'rotate-0 scale-100'
                    }`}
            >
                <Settings
                    className="w-5 h-5 text-emerald-500 animate-spin"
                    style={{ animationDuration: '3s' }}
                />
            </div>

            {/* Progress indicators */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full mb-1 transition-all duration-500 ${i <= fixingStep ? 'bg-emerald-400 scale-110' : 'bg-gray-300 scale-100'
                            }`}
                    />
                ))}
            </div>

            {/* Fixing text bubble */}
            <div className="absolute top-2 right-2 bg-white rounded-lg px-3 py-1 shadow-lg border-2 border-emerald-200 animate-bounce">
                <span className="text-xs font-medium text-emerald-700">Fixing...</span>
                <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-gradient-to-br  via-teal-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto">
                {/* Main Error Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 text-center transform animate-slideInUp border border-emerald-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Animation */}
                        <div className="order-2 lg:order-1">
                            <ManFixingAnimation />
                        </div>

                        {/* Right Side - Content */}
                        <div className="order-1 lg:order-2 text-left lg:text-left">
                            {/* Animated Error Icon */}
                            <div className="relative mb-8 flex justify-center lg:justify-start">
                                <div
                                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-1000 ${animationStep === 0
                                            ? 'bg-red-100 scale-100'
                                            : animationStep === 1
                                                ? 'bg-yellow-100 scale-110'
                                                : 'bg-emerald-100 scale-105'
                                        }`}
                                >
                                    <AlertTriangle
                                        className={`w-12 h-12 transition-all duration-1000 ${animationStep === 0
                                                ? 'text-red-500 rotate-0'
                                                : animationStep === 1
                                                    ? 'text-yellow-500 rotate-12'
                                                    : 'text-emerald-500 -rotate-12'
                                            }`}
                                    />
                                </div>

                                {/* Pulse rings */}
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-20"></div>
                                <div
                                    className="absolute inset-2 rounded-full border-2 border-teal-200 animate-ping opacity-30"
                                    style={{ animationDelay: '0.5s' }}
                                ></div>
                            </div>

                            {/* Error Message */}
                            <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Oops! Something went wrong
                                </h1>
                                <p className="text-lg text-gray-600 mb-2">We are working to fix this error.</p>
                                <p className="text-sm text-gray-500">
                                    Please try again in a few moments or contact support if the issue persists.
                                </p>
                            </div>

                            {/* Error Code */}
                            <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                                <div className="inline-block bg-emerald-100 rounded-lg px-4 py-2">
                                    <span className="text-sm font-mono text-emerald-700">Error Code: ELP-500</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4 mb-8 animate-fadeIn" style={{ animationDelay: '0.9s' }}>
                                <button
                                    onClick={handleRetry}
                                    disabled={isRetrying}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                                >
                                    <RefreshCw
                                        className={`w-5 h-5 mr-3 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180'
                                            } transition-transform duration-500`}
                                    />
                                    {isRetrying ? 'Retrying...' : 'Try Again'}
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Link to={'/'}>
                                        <button className="flex items-center justify-center py-3 px-6 border-2 border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 group">
                                            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                            Go Home
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="border-t border-emerald-200 pt-6 animate-fadeIn" style={{ animationDelay: '1.2s' }}>
                                <p className="text-sm text-gray-500 mb-4">Still having trouble? We're here to help!</p>
                                <button className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors duration-300 group">
                                    <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-sm font-medium">Contact Support</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Tips - Full Width */}
                <div className="mt-8 animate-fadeIn" style={{ animationDelay: '1.5s' }}>
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100">
                        <h3 className="font-semibold text-gray-700 mb-6 text-center">Quick Fixes to Try:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm text-gray-600">
                            <div className="flex items-center justify-center p-4 bg-white/60 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all duration-300">
                                <span>Refresh the page</span>
                            </div>
                            <div className="flex items-center justify-center p-4 bg-white/60 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all duration-300">
                                <span>Check your connection</span>
                            </div>
                            <div className="flex items-center justify-center p-4 bg-white/60 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all duration-300">
                                <span>Clear browser cache</span>
                            </div>
                            <div className="flex items-center justify-center p-4 bg-white/60 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all duration-300">
                                <span>Try another browser</span>
                            </div>
                            <div className="flex items-center justify-center p-4 bg-white/60 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all duration-300">
                                <span>Disable extensions</span>
                            </div>
                            <div className="flex items-center justify-center p-4 bg-white/60 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all duration-300">
                                <span>Restart device</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorFixingPage;
