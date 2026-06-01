import React from 'react';
import {
  Briefcase, Laptop, TrendingUp, Gift, Building2, PiggyBank,
  Utensils, Car, Home, HeartPulse, ShoppingBag, Gamepad2, Receipt,
  GraduationCap, Wallet, Coffee, Plane, Music, Book, Dumbbell,
  Smartphone, Coins, CreditCard, DollarSign, Heart, Star, Zap,
  LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  Briefcase, Laptop, TrendingUp, Gift, Building2, PiggyBank,
  Utensils, Car, Home, HeartPulse, ShoppingBag, Gamepad2, Receipt,
  GraduationCap, Wallet, Coffee, Plane, Music, Book, Dumbbell,
  Smartphone, Coins, CreditCard, DollarSign, Heart, Star, Zap,
};

export const ICON_NAMES = Object.keys(MAP);

interface Props {
  name: string;
  className?: string;
  size?: number;
}

const Icon: React.FC<Props> = ({ name, className, size = 18 }) => {
  const Cmp = MAP[name] || Wallet;
  return <Cmp className={className} size={size} />;
};

export default Icon;
