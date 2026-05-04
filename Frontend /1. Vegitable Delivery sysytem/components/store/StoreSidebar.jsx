
'use client'

import { usePathname } from "next/navigation"
import {
  HomeIcon,
  LayoutListIcon,
  SquarePenIcon,
  SquarePlusIcon,
  MessageSquareWarningIcon,
  WalletIcon, UserIcon
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const StoreSidebar = ({ storeInfo, onClose }) => {

  const pathname = usePathname()

  const sidebarLinks = [
    { name: 'Dashboard', href: '/store', icon: HomeIcon },
    { name: 'Add Product', href: '/store/add-product', icon: SquarePlusIcon },
    { name: 'Manage Product', href: '/store/manage-product', icon: SquarePenIcon },
    { name: 'Orders', href: '/store/orders', icon: LayoutListIcon },
    { name: 'User Complaints', href: '/store/complaints', icon: MessageSquareWarningIcon },
    { name: 'Account Details', href: '/store/account', icon: UserIcon },
     { name: 'Payments', href: '/store/payments', icon: WalletIcon },
  ]

  return (
    <div className="flex flex-col h-full w-64 bg-white">

      {/* 🔹 Store Info */}
      <div className="flex flex-col gap-2 items-center py-6">
        <Image
          className="w-14 h-14 rounded-full shadow"
          src={storeInfo?.logo}
          alt="store"
          width={80}
          height={80}
        />
        <p className="text-slate-700 font-medium">
          {storeInfo?.name}
        </p>
      </div>

      {/* 🔹 Links */}
      <div className="mt-4">

        {sidebarLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            onClick={onClose} // ✅ close sidebar on click (mobile)
            className={`
              relative flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-slate-50 transition
              ${pathname === link.href ? 'bg-slate-100 text-slate-800' : ''}
            `}
          >

            <link.icon size={20} />

            {/* ✅ TEXT ALWAYS VISIBLE */}
            <span className="text-sm font-medium">
              {link.name}
            </span>

            {pathname === link.href && (
              <span className="absolute right-0 top-2 bottom-2 w-1 bg-green-500 rounded-l"></span>
            )}

          </Link>
        ))}

      </div>

    </div>
  )
}

export default StoreSidebar