import React, { useEffect, useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Lightbulb, 
  Target, 
  Rocket, 
  Monitor, 
  Palette,
  Brain,
  Code,
  Sparkles,
  UserCheck,
  UserPlus,
  Share2,
  GitBranch,
  Zap,
  Award
} from 'lucide-react';

const KnowledgeNetworkLoader = () => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    // Generate random connections
    const interval = setInterval(() => {
      const newConnection = {
        id: Date.now(),
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        endX: Math.random() * 100,
        endY: Math.random() * 100
      };
      setConnections(prev => [...prev.slice(-4), newConnection]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Icon components array for floating elements
  const floatingIcons = [
    { Icon: BookOpen, color: 'text-emerald-400' },
    { Icon: Lightbulb, color: 'text-green-400' },
    { Icon: Target, color: 'text-teal-400' },
    { Icon: Rocket, color: 'text-emerald-500' },
    { Icon: Monitor, color: 'text-green-500' },
    { Icon: Palette, color: 'text-teal-500' }
  ];

  // User role icons
  const userRoleIcons = [
    { Icon: GraduationCap, label: 'Instructor' },
    { Icon: Brain, label: 'Student' },
    { Icon: Users, label: 'Community' }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 overflow-hidden">
      <div className="relative w-full h-screen">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
                 backgroundSize: '50px 50px',
                 animation: 'grid-move 10s linear infinite'
               }}>
          </div>
        </div>

        {/* Dynamic Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          {connections.map(conn => (
            <line
              key={conn.id}
              x1={`${conn.startX}%`}
              y1={`${conn.startY}%`}
              x2={`${conn.endX}%`}
              y2={`${conn.endY}%`}
              stroke="url(#emerald-gradient)"
              strokeWidth="2"
              className="animate-draw-line opacity-50"
            />
          ))}
          <defs>
            <linearGradient id="emerald-gradient">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central Learning Hub */}
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Main Platform Logo */}
            <div className="w-32 h-32 md:w-40 md:h-40 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full animate-spin-slow opacity-30 blur-xl"></div>
              <div className="absolute inset-0 bg-gray-950 rounded-full flex items-center justify-center border-2 border-transparent bg-clip-padding"
                   style={{
                     backgroundImage: 'linear-gradient(#030712, #030712), linear-gradient(45deg, #34d399, #10b981, #14b8a6)',
                     backgroundOrigin: 'border-box',
                     backgroundClip: 'padding-box, border-box'
                   }}>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <GitBranch className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    EduNova
                  </div>
                  <div className="text-xs md:text-sm text-gray-400">PLATFORM</div>
                </div>
              </div>
            </div>

            {/* Orbiting User Nodes */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const radius = 80;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const roleIndex = i % 3;
                const RoleIcon = userRoleIcons[roleIndex].Icon;
                
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 animate-pulse"
                    style={{
                      transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  >
                    <div className="relative group">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center transform transition-transform group-hover:scale-110">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-950 rounded-full flex items-center justify-center">
                          <RoleIcon className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 animate-role-toggle" />
                        </div>
                      </div>
                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                           style={{
                             background: i % 2 === 0 ? '#10b981' : '#14b8a6',
                             boxShadow: `0 0 10px ${i % 2 === 0 ? '#10b981' : '#14b8a6'}`
                           }}>
                      </div>
                      {/* Connection Indicator */}
                      {i % 3 === 0 && (
                        <div className="absolute -top-2 -left-2">
                          <Share2 className="w-3 h-3 text-emerald-300 animate-ping" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Knowledge Bits */}
            <div className="absolute -inset-32">
              {floatingIcons.map((item, i) => {
                const { Icon, color } = item;
                return (
                  <div
                    key={i}
                    className={`absolute ${color} animate-float-random`}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  >
                    <div className="relative">
                      <Icon className="w-6 h-6 md:w-8 md:h-8" />
                      <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Energy Rings */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border border-teal-500/20 rounded-full animate-ping animation-delay-200"></div>
              <div className="absolute inset-0 border border-green-500/20 rounded-full animate-ping animation-delay-400"></div>
            </div>
          </div>
        </div>

        {/* Loading Text and Stats */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <div className="space-y-4">
            {/* Main Loading Text */}
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 animate-pulse" />
              <div className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 animate-pulse">
                Connecting Knowledge Network
              </div>
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 animate-pulse" />
            </div>
            
            {/* Subtitle */}
            <div className="text-sm md:text-base text-gray-400 flex items-center justify-center space-x-2">
              <Code className="w-4 h-4 text-emerald-500" />
              <span>Where everyone learns, everyone teaches</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            
            {/* Live Stats */}
            <div className="flex justify-center space-x-2 mt-4">
              <div className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-full backdrop-blur-sm flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-semibold animate-pulse">
                  Students: {Math.floor(Math.random() * 1000) + 500}
                </span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/30 rounded-full backdrop-blur-sm flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-teal-400" />
                <span className="text-xs text-teal-300 font-semibold animate-pulse animation-delay-200">
                  Instructors: {Math.floor(Math.random() * 1000) + 500}
                </span>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center items-center space-x-3 mt-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-10 left-10">
          <Brain className="w-8 h-8 text-emerald-500/30 animate-pulse" />
        </div>
        <div className="absolute top-10 right-10">
          <Lightbulb className="w-8 h-8 text-teal-500/30 animate-pulse animation-delay-200" />
        </div>
        <div className="absolute bottom-10 left-10">
          <Target className="w-8 h-8 text-green-500/30 animate-pulse animation-delay-400" />
        </div>
        <div className="absolute bottom-10 right-10">
          <Rocket className="w-8 h-8 text-emerald-500/30 animate-pulse animation-delay-600" />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeNetworkLoader;