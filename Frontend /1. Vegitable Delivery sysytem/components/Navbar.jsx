"use client";

import { Search, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/lib/features/auth/authSlice";
import toast from "react-hot-toast";
import api from "@/lib/api";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.length;

  const { isLoggedIn, user, loading } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return; // prevent empty search

    router.push(`/shop?search=${encodeURIComponent(search)}`);
    setSearch(""); // optional: clear input after search
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      toast.success("Logged out successfully"); // ✅ ADD
    } catch (err) {
      toast.error("Logout failed");
    }

    dispatch(logoutUser());

    router.push("/");

    setTimeout(() => {
      router.refresh();
    }, 100);
  };

  // ✅ prevent flicker
  if (loading) return null;

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
          {/* LOGO */}
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-700"
          >
            <span className="text-green-600">Fresh</span>Kart
            <span className="text-green-600 text-5xl">.</span>
            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 py-0.5 rounded-full text-white bg-green-500">
              plus
            </p>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>

            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} />
              <input
                className="w-full bg-transparent outline-none"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            {/* 🔥 CART FIXED */}
            <div
              onClick={() => {
                if (!isLoggedIn) {
                  router.push("/login");
                } else {
                  router.push("/cart");
                }
              }}
              className="relative flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 left-3 text-[10px] text-white bg-slate-600 px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {/* AUTH */}
            {!isLoggedIn ? (
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="capitalize">{user?.name || "User"}</span>
                </div>

                {/* DROPDOWN */}
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded hidden group-hover:block z-50">
                  <button
                    onClick={() => router.push("/account")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Account
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE */}
          <div className="sm:hidden">
            {/* HAMBURGER */}
            <button onClick={() => setMenuOpen(true)}>
              <Menu size={28} />
            </button>

            {/* DRAWER */}
            {menuOpen && (
              <div className="fixed inset-0 bg-black/40 z-50">
                <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-5 flex flex-col gap-6">
                  {/* CLOSE */}
                  <div className="flex justify-end">
                    <button onClick={() => setMenuOpen(false)}>
                      <X size={24} />
                    </button>
                  </div>

                  {/* LINKS */}
                  <Link href="/" onClick={() => setMenuOpen(false)}>
                    Home
                  </Link>
                  <Link href="/shop" onClick={() => setMenuOpen(false)}>
                    Shop
                  </Link>
                  <Link href="/about" onClick={() => setMenuOpen(false)}>
                    About
                  </Link>
                  <Link href="/contact" onClick={() => setMenuOpen(false)}>
                    Contact
                  </Link>

                  {/* 🔥 MOBILE CART FIX */}
                  <div
                    onClick={() => {
                      if (!isLoggedIn) {
                        router.push("/login");
                      } else {
                        router.push("/cart");
                      }
                      setMenuOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    Cart
                  </div>

                  <hr />

                  {/* AUTH */}
                  {!isLoggedIn ? (
                    <button
                      onClick={() => {
                        router.push("/login");
                        setMenuOpen(false);
                      }}
                      className="bg-indigo-500 text-white py-2 rounded"
                    >
                      Login
                    </button>
                  ) : (
                    <>
                      <p className="font-semibold capitalize">
                        {user?.name || "User"}
                      </p>

                      <button
                        onClick={() => {
                          router.push("/account");
                          setMenuOpen(false);
                        }}
                        className="text-left"
                      >
                        My Account
                      </button>

                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="text-red-500 text-left"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;
