import React from "react";
import {
  LayoutGrid, Package, Library, BookOpen, Bookmark, MapPin, Settings, Truck,
  Wallet, ShieldCheck, Flag, ScrollText, Lock, CloudUpload, FileText,
  CreditCard, Star, Clock, Check, Search, Heart, ShoppingCart, Store, Gift,
  GraduationCap, Zap, Scale, Palette, Landmark, Microscope, Baby, Image,
  ShoppingBag, Smartphone, Download, Map, Shuffle, Trash2, ShieldLock,
  AlertTriangle, Menu, X, User, Sparkles, CircleDollarSign, CirclePlay,
} from "lucide-react";

const ICONS = {
  LayoutGrid, Package, Library, BookOpen, Bookmark, MapPin, Settings, Truck,
  Wallet, ShieldCheck, Flag, ScrollText, Lock, CloudUpload, FileText,
  CreditCard, Star, Clock, Check, Search, Heart, ShoppingCart, Store, Gift,
  GraduationCap, Zap, Scale, Palette, Landmark, Microscope, Baby, Image,
  ShoppingBag, Smartphone, Download, Map, Shuffle, Trash2, ShieldLock,
  AlertTriangle, Menu, X, User, Sparkles, CircleDollarSign, CirclePlay,
};

export default function Icone({ name, size = 18, strokeWidth = 1.8, className = "" }) {
  const Component = ICONS[name] || CirclePlay;
  return <Component size={size} strokeWidth={strokeWidth} className={`shrink-0 ${className}`} aria-hidden="true" />;
}
