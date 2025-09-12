import React from "react";
import toast from "react-hot-toast";
import {
  XCircle, CheckCircle, Info, AlertCircle, Calendar, ShoppingBag, User,
  MessageSquare, GraduationCap, Mail, Clock, Heart, Settings, UserCheck
} from "lucide-react";

const iconMap = {
  XCircle, CheckCircle, Info, AlertCircle, Calendar, ShoppingBag, User,
  MessageSquare, GraduationCap, Mail, Clock, Heart, Settings, UserCheck
};

export const showSuperNotification = (data) => {
  const Icon = iconMap[data.icon] || Info;

  toast.custom((t) => (
    <div
      className={`flex flex-col gap-1 p-3 border-l-4 bg-white rounded-xl shadow-lg w-80 transform transition-all duration-500
      ${t.visible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}
      border-gray-300`}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800">{data.title}</p>
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      <p className="text-gray-600 text-sm">{data.message}</p>
    </div>
  ), {
    duration: data.duration || 2000,
    position: "top-center",
  });
};
