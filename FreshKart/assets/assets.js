import gs_logo from "./gs_logo.jpg"
import happy_store from "./happy_store.webp"
import upload_area from "./upload_area.svg"
import hero_model_img from "./hero_model_img.png"
import hero_product_img1 from "./hero_product_img1.png"
import hero_product_img2 from "./hero_product_img2.png"
import product_img1 from "./product_img1.jpg"
import product_img2 from "./product_img1.jpg"
import product_img3 from "./product_img3.jpg"
import product_img4 from "./product_img4.jpg"
import product_img5 from "./product_img5.jpg"
import product_img6 from "./product_img6.avif"
import product_img7 from "./product_img7.avif"
import product_img8 from "./product_img8.avif"
import product_img9 from "./product_img9.avif"
import product_img10 from "./product_img10.avif"
import product_img11 from "./product_img11.avif"
import product_img12 from "./product_img12.avif"
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";
import profile_pic1 from "./profile_pic1.jpg"
import profile_pic2 from "./profile_pic2.jpg"
import profile_pic3 from "./profile_pic3.jpg"
import vegitable_basket from "./vegitable_Basket.png"

export const assets = {
    upload_area, hero_model_img,
    hero_product_img1, hero_product_img2, gs_logo,
    product_img1, product_img2, product_img3, product_img4, product_img5, product_img6,
    product_img7, product_img8, product_img9, product_img10, product_img11, product_img12,vegitable_basket
}

export const categories = [
  "Leafy Greens",
  "Root Vegetables",
  "Fruits",
  "Organic Herbs",
  "Exotic Veggies",
  "Seasonal Produce"
];


export const dummyRatingsData = [
  {
    id: "rat_1",
    rating: 4.6,
    review:
      "Very fresh and crisp — the spinach and coriander were spotless and lasted the whole week. Delivery was on time and packaging kept everything intact. Will order again.",
    user: { name: "Asha Kumar", image: profile_pic1 },
    productId: "prod_1",
    createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    updatedAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    product: { name: "Fresh Spinach (250g)", category: "Leafy Greens", id: "prod_1" }
  },
  {
    id: "rat_2",
    rating: 5.0,
    review:
      "Excellent quality carrots — sweet and crunchy. The organic tag is genuine. Easy checkout and friendly delivery person. Highly recommend for weekly veggies.",
    user: { name: "Rohan Singh", image: profile_pic2 },
    productId: "prod_2",
    createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    updatedAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    product: { name: "Organic Carrots (1kg)", category: "Root Vegetables", id: "prod_2" }
  },
  {
    id: "rat_3",
    rating: 4.4,
    review:
      "Tomatoes were juicy and ripe — perfect for making sabzi. Packaging kept them from bruising. A little late once, but customer support sorted it quickly.",
    user: { name: "Priya Sharma", image: profile_pic3 },
    productId: "prod_3",
    createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    updatedAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    product: { name: "Vine Tomatoes (500g)", category: "Fruits & Veg", id: "prod_3" }
  },
  {
    id: "rat_4",
    rating: 4.8,
    review:
      "Great selection of mixed greens for salads. Leaves were clean and tender. Loved the minimal plastic and recyclable packaging.",
    user: { name: "Vikram Patel", image: profile_pic1 },
    productId: "prod_4",
    createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    updatedAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    product: { name: "Salad Mix (200g)", category: "Leafy Greens", id: "prod_4" }
  },
  {
    id: "rat_5",
    rating: 4.1,
    review:
      "Good potatoes and onions. One bag had a couple of small blemishes but overall quality was decent for the price. Offers are useful.",
    user: { name: "Suman Gupta", image: profile_pic2 },
    productId: "prod_5",
    createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    updatedAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    product: { name: "Potato & Onion Combo (2kg)", category: "Root Vegetables", id: "prod_5" }
  },
  {
    id: "rat_6",
    rating: 5.0,
    review:
      "The organic herb bundle (mint, coriander, curry leaves) was fantastic — fragrant and long-lasting. Perfect for everyday cooking.",
    user: { name: "Anjali Rao", image: profile_pic3 },
    productId: "prod_6",
    createdAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    updatedAt: "Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)",
    product: { name: "Organic Herb Bundle", category: "Organic Herbs", id: "prod_6" }
  }
];


export const dummyStoreData = {
  id: "store_1",
  userId: "user_1",
  name: "FreshBasket",
  description:
    "At FreshBasket, we bring you farm-fresh vegetables and fruits straight from trusted local farmers. Enjoy healthy, organic, and chemical-free produce delivered right to your doorstep — fresh every day, every order.",
  username: "freshbasket",
  address: "Plot No. 21, Green Market Complex, Sector 5, Bhubaneswar, Odisha, India",
  status: "approved",
  isActive: true,
  logo: happy_store, // replace with your vegetable logo later
  email: "support@freshbasket.in",
  contact: "+91 9876543210",
  createdAt: "2025-09-04T09:04:16.189Z",
  updatedAt: "2025-09-04T09:04:44.273Z",
  user: {
    id: "user_31dOriXqC4TATvc0brIhlYbwwc5",
    name: "Ravi Patel",
    email: "ravi.patel@freshbasket.in",
    image: gs_logo
  }
}


export const productDummyData = [
  {
    id: "prod_1",
    name: "Fresh Spinach (Palak) - 250g",
    description:
      "Hand-picked spinach leaves, washed and packed fresh. Tender greens perfect for saag, dals, and soups. Grown by local farmers and delivered within 24 hours to keep maximum freshness.",
    mrp: 40,
    price: 29,
    images: [product_img1, product_img2],
    category: "Leafy Greens",
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    rating: dummyRatingsData,
    createdAt: "Sun Oct 05 2025 08:32:14 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 08:32:14 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_2",
    name: "Organic Carrots - 1kg",
    description:
      "Crisp, sweet organic carrots ideal for salads, juicing, and cooking. Grown without harmful pesticides and carefully packed to avoid bruising during delivery.",
    mrp: 80,
    price: 69,
    images: [product_img3],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Root Vegetables",
    rating: dummyRatingsData,
    createdAt: "Sun Oct 05 2025 09:12:45 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 09:12:45 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_3",
    name: "Vine Tomatoes - 500g",
    description:
      "Juicy vine-ripened tomatoes with rich flavor — perfect for curries, chutneys, and salads. Packed gently to maintain their natural freshness and flavor.",
    mrp: 60,
    price: 49,
    images: [product_img4],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Fruits & Veg",
    rating: dummyRatingsData,
    createdAt: "Sun Oct 05 2025 09:57:02 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 09:57:02 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_4",
    name: "Potato (Aloo) - 2kg",
    description:
      "Premium grade potatoes — versatile and great for aloo sabzi, fries, and daily cooking. Cleaned and sorted for consistent quality.",
    mrp: 120,
    price: 99,
    images: [product_img5],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Root Vegetables",
    rating: dummyRatingsData,
    createdAt: "Sun Oct 05 2025 10:35:18 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 10:35:18 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_5",
    name: "Onion - 1kg",
    description:
      "Fresh onions with strong aroma and long shelf life. Perfect for Indian gravies, curries, and pickles. Sourced from trusted local farms.",
    mrp: 60,
    price: 49,
    images: [product_img6],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Daily Staples",
    rating: [...dummyRatingsData, ...dummyRatingsData],
    createdAt: "Sun Oct 05 2025 11:21:09 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 11:21:09 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_6",
    name: "Mixed Salad Pack - 200g",
    description:
      "Ready-to-eat salad mix with lettuce, baby spinach, and rocket leaves. Freshly washed, chilled, and perfect for healthy meals or sandwiches.",
    mrp: 99,
    price: 79,
    images: [product_img7],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Salad Essentials",
    rating: [...dummyRatingsData, ...dummyRatingsData],
    createdAt: "Sun Oct 05 2025 12:08:43 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 12:08:43 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_7",
    name: "Coriander (Dhania) - 100g",
    description:
      "Fresh coriander leaves — aromatic and hand-picked daily. Ideal for garnishing, chutneys, and seasoning Indian dishes. Farm-fresh and naturally grown.",
    mrp: 30,
    price: 24,
    images: [product_img8],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Organic Herbs",
    rating: [...dummyRatingsData, ...dummyRatingsData],
    createdAt: "Sun Oct 05 2025 12:49:56 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 12:49:56 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_8",
    name: "Cucumber (Kheera) - 500g",
    description:
      "Crisp, hydrating cucumbers perfect for salads, sandwiches, and raita. Delivered fresh from local organic farms every morning.",
    mrp: 50,
    price: 39,
    images: [product_img9],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Fruits & Veg",
    rating: [...dummyRatingsData, ...dummyRatingsData],
    createdAt: "Sun Oct 05 2025 13:15:22 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 13:15:22 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_9",
    name: "Bell Peppers (Capsicum) - 3pcs Mixed",
    description:
      "Assorted bell peppers in green, red, and yellow — crunchy and flavorful. Great for stir-fries, salads, or roasted dishes.",
    mrp: 120,
    price: 99,
    images: [product_img10],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Exotic Veggies",
    rating: [...dummyRatingsData, ...dummyRatingsData],
    createdAt: "Sun Oct 05 2025 14:03:39 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 14:03:39 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_10",
    name: "Fresh Ginger (Adrak) - 250g",
    description:
      "Aromatic ginger with rich flavor and freshness — perfect for Indian curries, tea, and traditional remedies. Carefully cleaned and packed.",
    mrp: 70,
    price: 55,
    images: [product_img11],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Daily Staples",
    rating: [...dummyRatingsData, ...dummyRatingsData],
    createdAt: "Sun Oct 05 2025 14:51:18 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 14:51:18 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_11",
    name: "Banana (Robusta) - 1 dozen",
    description:
      "Sweet, ripe bananas from Kerala farms. Perfect for breakfast, milkshakes, and snacks. Handled with care to avoid bruising.",
    mrp: 60,
    price: 49,
    images: [product_img12],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Fruits",
    rating: [...dummyRatingsData, ...dummyRatingsData],
    createdAt: "Sun Oct 05 2025 15:27:44 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 15:27:44 GMT+0530 (India Standard Time)",
  },
  {
    id: "prod_12",
    name: "Cauliflower (Gobi) - 1pc",
    description:
      "Farm-fresh cauliflower with tightly packed florets and natural color. Ideal for gobi paratha, curries, and sabzi. Delivered pesticide-free.",
    mrp: 55,
    price: 44,
    images: [product_img1],
    storeId: "store_1",
    inStock: true,
    store: dummyStoreData,
    category: "Daily Vegetables",
    rating: [...dummyRatingsData, ...dummyRatingsData],
    createdAt: "Sun Oct 05 2025 16:09:33 GMT+0530 (India Standard Time)",
    updatedAt: "Sun Oct 05 2025 16:09:33 GMT+0530 (India Standard Time)",
  },
];


export const ourSpecsData = [
    { 
        title: "Fresh Farm Delivery", 
        description: "Fresh vegetables and fruits picked daily from local farms and delivered straight to your doorstep — crisp, clean, and full of goodness.", 
        icon: SendIcon, 
        accent: '#05DF72' 
    },
    { 
        title: "Instant Replacement", 
        description: "Not happy with the freshness? Get an instant replacement — no questions asked, no waiting.", 
        icon: ClockFadingIcon, 
        accent: '#FF8904' 
    },
    { 
        title: "24/7 Customer Support", 
        description: "Have a query or issue? Our friendly support team is always ready to help you — anytime, any day.", 
        icon: HeadsetIcon, 
        accent: '#A684FF' 
    }
];



export const addressDummyData = {
    id: "addr_1",
    userId: "user_1",
    name: "Sipun Kumar",
    email: "contact@sipunkumar.com",
    street: "Ward No. 5, Takatpur Road",
    city: "Baripada",
    state: "Odisha",
    zip: "757001",
    country: "India",
    phone: "+91 9437001234",
    createdAt: 'Sun Oct 05 2025 10:24:37 GMT+0530 (India Standard Time)',
}


export const couponDummyData = [
    { code: "NEW20", description: "20% Off for New Users", discount: 20, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:31.183Z" },
    { code: "NEW10", description: "10% Off for New Users", discount: 10, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:50.653Z" },
    { code: "OFF20", description: "20% Off for All Users", discount: 20, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:00.811Z" },
    { code: "OFF10", description: "10% Off for All Users", discount: 10, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:21.279Z" },
    { code: "PLUS10", description: "20% Off for Members", discount: 10, forNewUser: false, forMember: true, isPublic: false, expiresAt: "2027-03-06T00:00:00.000Z", createdAt: "2025-08-22T11:38:20.194Z" }
]

export const dummyUserData = {
    id: "user_31dQbH27HVtovbs13X2cmqefddM",
    name: "Swapna",
    email: "swapna@example.com",
    image: gs_logo,
    cart: {}
}

export const orderDummyData = [
    {
        id: "cmemm75h5001jtat89016h1p3",
        total: 214.2,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:15:03.929Z",
        updatedAt: "2025-08-22T09:15:50.723Z",
        isCouponUsed: true,
        coupon: dummyRatingsData[2],
        orderItems: [
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlydnx0017tat8h3rg92hz", quantity: 1, price: 89, product: productDummyData[0], },
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlxgnk0015tat84qm8si5v", quantity: 1, price: 149, product: productDummyData[1], }
        ],
        address: addressDummyData,
        user: dummyUserData
    },
    {
        id: "cmemm6jv7001htat8vmm3gxaf",
        total: 421.6,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:14:35.923Z",
        updatedAt: "2025-08-22T09:15:52.535Z",
        isCouponUsed: true,
        coupon: couponDummyData[0],
        orderItems: [
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm1f3y001dtat8liccisar", quantity: 1, price: 229, product: productDummyData[2], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm0nh2001btat8glfvhry1", quantity: 1, price: 99, product: productDummyData[3], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemlz8640019tat8kz7emqca", quantity: 1, price: 199, product: productDummyData[4], }
        ],
        address: addressDummyData,
        user: dummyUserData
    }
]

export const storesDummyData = [
    {
        id: "store_01vegFreshFarm",
        userId: "user_54vFbG93HVtovfs34X9cmfreshVeg",
        name: "GreenLeaf Farms",
        description: "GreenLeaf Farms brings you hand-picked, pesticide-free vegetables straight from our local fields. Freshness you can see, taste, and trust — every single day.",
        username: "greenleaffarms",
        address: "Farmers Market Road, Baripada, Mayurbhanj, Odisha, India",
        status: "approved",
        isActive: true,
        logo: "/images/greenleaf_logo.png", // replace with your actual store logo
        email: "contact@greenleaffarms.in",
        contact: "+91 8895012345",
        createdAt: "2025-10-05T08:22:16.189Z",
        updatedAt: "2025-10-05T09:10:44.273Z",
        user: dummyUserData,
    },
    {
        id: "store_02vegFreshHub",
        userId: "user_54vFbG93HVtovfs34X9cmfreshVeg",
        name: "FreshHarvest Mart",
        description: "FreshHarvest Mart connects local farmers directly to your kitchen. Enjoy premium-quality fruits and vegetables sourced daily from trusted farms around Odisha.",
        username: "freshharvestmart",
        address: "Main Street, Station Bazaar, Baripada, Odisha, India",
        status: "approved",
        isActive: true,
        logo: "/images/freshharvest_logo.png", // replace with your actual store logo
        email: "hello@freshharvestmart.in",
        contact: "+91 9321587460",
        createdAt: "2025-10-05T08:34:15.155Z",
        updatedAt: "2025-10-05T09:00:47.162Z",
        user: dummyUserData,
    }
]


export const dummyAdminDashboardData = {
    "orders": 6,
    "stores": 2,
    "products": 12,
    "revenue": "9059.10",
    "allOrders": [
        { "createdAt": "2025-08-20T08:46:58.239Z", "total": 145.6 },
        { "createdAt": "2025-08-22T08:46:21.818Z", "total": 97.2 },
        { "createdAt": "2025-08-22T08:45:59.587Z", "total": 54.4 },
        { "createdAt": "2025-08-23T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-23T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-23T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-24T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-24T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-25T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:30:29.713Z", "total": 110.1 }
    ]
}

export const dummyStoreDashboardData = {
    "ratings": dummyRatingsData,
    "totalOrders": 2,
    "totalEarnings": 636,
    "totalProducts": 5
}