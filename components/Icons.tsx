
import React from 'react';
import {
  Menu, Search, Eye, EyeOff, Bell, User, MessageSquare,
  Home, CreditCard, Receipt, HandCoins, ArrowRightLeft,
  Smartphone, Barcode, ChevronRight, Share2, MoreHorizontal,
  ChevronDown, Send, Lock, Wallet, FileText, CircleDollarSign, Download,
  Building2, QrCode, Copy, Contact, RotateCcw, Calendar, Edit3, X, Check, Settings,
  ScanFace, LogOut, Camera
} from 'lucide-react';

// Custom Pix Icon
export const PixIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z" />
    <path d="m14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z" />
  </svg>
);

// Santander Flame Logo (SVG)
export const SantanderLogo = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 51.75 48.81"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    <path d="M26.21 0c0.24,1.17 0.67,2.3 1.28,3.36l8.11 13.91c0.91,1.58 1.41,3.33 1.49,5.08 8.67,2.25 14.66,7.02 14.66,12.54 0,7.69 -11.59,13.92 -25.88,13.92 -14.29,0 -25.87,-6.23 -25.87,-13.92 0,-5.52 5.99,-10.29 14.66,-12.53 -0.09,2.08 0.4,4.18 1.49,6.04l8.1 13.91c0.62,1.06 1.05,2.2 1.29,3.37l0.33 -0.58c2.01,-3.45 2.01,-7.69 0,-11.13l-6.5 -11.17c-1.98,-3.43 -1.98,-7.66 0.02,-11.09l0.34 -0.58c0.24,1.16 0.66,2.3 1.28,3.36l9.72 16.69c0.62,1.07 1.05,2.2 1.29,3.37l0.33 -0.58c2.01,-3.45 2.01,-7.69 0,-11.13l-6.48 -11.13c-2,-3.44 -2,-7.69 0,-11.13l0.34 -0.58z" />
  </svg>
);

// Custom Hand holding Money icon
export const LoansIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="-57.6 -57.6 691.20 691.20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M271.06,144.3l54.27,14.3a8.59,8.59,0,0,1,6.63,8.1c0,4.6-4.09,8.4-9.12,8.4h-35.6a30,30,0,0,1-11.19-2.2c-5.24-2.2-11.28-1.7-15.3,2l-19,17.5a11.68,11.68,0,0,0-2.25,2.66,11.42,11.42,0,0,0,3.88,15.74,83.77,83.77,0,0,0,34.51,11.5V240c0,8.8,7.83,16,17.37,16h17.37c9.55,0,17.38-7.2,17.38-16V222.4c32.93-3.6,57.84-31,53.5-63-3.15-23-22.46-41.3-46.56-47.7L282.68,97.4a8.59,8.59,0,0,1-6.63-8.1c0-4.6,4.09-8.4,9.12-8.4h35.6A30,30,0,0,1,332,83.1c5.23,2.2,11.28,1.7,15.3-2l19-17.5A11.31,11.31,0,0,0,368.47,61a11.43,11.43,0,0,0-3.84-15.78,83.82,83.82,0,0,0-34.52-11.5V16c0-8.8-7.82-16-17.37-16H295.37C285.82,0,278,7.2,278,16V33.6c-32.89,3.6-57.85,31-53.51,63C227.63,119.6,247,137.9,271.06,144.3ZM565.27,328.1c-11.8-10.7-30.2-10-42.6,0L430.27,402a63.64,63.64,0,0,1-40,14H272a16,16,0,0,1,0-32h78.29c15.9,0,30.71-10.9,33.25-26.6a31.2,31.2,0,0,0,.46-5.46A32,32,0,0,0,352,320H192a117.66,117.66,0,0,0-74.1,26.29L71.4,384H16A16,16,0,0,0,0,400v96a16,16,0,0,0,16,16H372.77a64,64,0,0,0,40-14L564,377a32,32,0,0,0,1.28-48.9Z" />
  </svg>
);

// Custom Clover/Flower icon
export const DinDinIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="-2.99 -2.99 35.87 35.87"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M14.308,13.048c0.355,0.35,0.924,0.35,1.28,0c1.22-1.203,3.813-3.803,4.451-4.792c0.908-1.406,1.812-2.566,1.812-4.591 S20.211,0,18.186,0c-1.416,0-2.63,0.812-3.24,1.987C14.336,0.812,13.123,0,11.707,0C9.682,0,8.042,1.64,8.042,3.665 S8.947,6.85,9.854,8.256C10.495,9.244,13.088,11.845,14.308,13.048z" />
    <path d="M15.587,16.848c-0.355-0.351-0.925-0.351-1.28,0c-1.22,1.202-3.813,3.804-4.452,4.791 c-0.907,1.406-1.813,2.566-1.813,4.593c0,2.023,1.64,3.663,3.665,3.663c1.416,0,2.63-0.812,3.24-1.985 c0.611,1.175,1.824,1.985,3.24,1.985c2.024,0,3.665-1.64,3.665-3.663c0-2.025-0.904-3.187-1.812-4.593 C19.402,20.65,16.807,18.049,15.587,16.848z" />
    <path d="M27.908,14.947c1.174-0.61,1.985-1.824,1.985-3.24c0-2.025-1.64-3.665-3.664-3.666c-2.024,0-3.186,0.906-4.592,1.813 c-0.987,0.639-3.59,3.232-4.792,4.452c-0.351,0.355-0.351,0.924,0,1.279c1.202,1.22,3.805,3.813,4.792,4.453 c1.406,0.907,2.566,1.812,4.592,1.812c2.023,0,3.664-1.642,3.664-3.666C29.896,16.771,29.083,15.557,27.908,14.947z" />
    <path d="M13.048,15.587c0.35-0.354,0.35-0.925,0-1.28c-1.203-1.22-3.804-3.813-4.792-4.452C6.851,8.948,5.69,8.042,3.667,8.042 c-2.025,0-3.665,1.641-3.665,3.666c0,1.416,0.813,2.63,1.987,3.24c-1.175,0.61-1.987,1.823-1.987,3.239 c0,2.023,1.64,3.663,3.665,3.665c2.024,0,3.185-0.905,4.59-1.812C9.245,19.4,11.845,16.807,13.048,15.587z" />
  </svg>
);

// Custom Staggered Menu icon
export const MenuStaggeredIcon = ({ className, size = 24, strokeWidth = 2.5 }: { className?: string, size?: number, strokeWidth?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="14" y2="18" />
  </svg>
);

// Custom Address Book icon
export const AddressBookIcon = ({ className, size = 24, strokeWidth = 2 }: { className?: string, size?: number, strokeWidth?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    <circle cx="12" cy="8" r="2" />
    <path d="M8 14a4 4 0 0 1 8 0" />
  </svg>
);

// Custom "Trazer Dinheiro" icon (Money with circular arrows)
export const BringMoneyIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v20" opacity="0.5" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    <path d="M19 15l3 3-3 3" />
    <path d="M22 18c0-5-3-9-8-9" />
    <path d="M5 9L2 6l3-3" />
    <path d="M2 6c0 5 3 9 8 9" />
  </svg>
);


export const Icons = {
  Menu, Search, Eye, EyeOff, Bell, User, MessageSquare,
  Home, CreditCard, Receipt, HandCoins, ArrowRightLeft,
  Smartphone, Barcode, ChevronRight, Share2, MoreHorizontal,
  ChevronDown, Send, Pix: PixIcon, Lock,
  Loans: LoansIcon, DinDin: DinDinIcon,
  MenuStaggered: MenuStaggeredIcon,
  Wallet, FileText, CircleDollarSign, Download,
  Building2, QrCode, Copy, Contact: AddressBookIcon, RotateCcw,
  Calendar, Edit3, SantanderLogo, BringMoney: BringMoneyIcon, X, Check,
  Settings, ScanFace, LogOut, Camera
};
