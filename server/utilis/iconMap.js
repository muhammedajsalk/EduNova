import {
  Bell,
  ShoppingBag,
  MessageSquare,
  AlertCircle,
  XCircle,
  Settings,
  User,
  CheckCircle,
  Calendar,
  Mail,
  Clock,
  Heart,
  Info,
  GraduationCap,
  UserCheck,
} from "lucide-react";

export const ICONS_MAP = {
  bell: Bell,
  shoppingbag: ShoppingBag,
  messagesquare: MessageSquare,
  alertcircle: AlertCircle,
  xcircle: XCircle,
  settings: Settings,
  user: User,
  checkcircle: CheckCircle,
  calendar: Calendar,
  mail: Mail,
  clock: Clock,
  heart: Heart,
  info: Info,
  graduationcap: GraduationCap,
  usercheck: UserCheck,
};

export const getIcon = (iconName) => {
  if (!iconName || typeof iconName !== "string") {
    return Bell;
  }
  return ICONS_MAP[iconName.toLowerCase()] || Bell;
};

