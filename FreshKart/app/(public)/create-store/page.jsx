

'use client'

import { assets } from "@/assets/assets"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { useRouter } from "next/navigation"
import 'leaflet/dist/leaflet.css' // make sure leaflet is installed

// NOTE: Leaflet is dynamically imported inside MapPicker to avoid SSR issues.

export default function CreateStore() {

  const router = useRouter()
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    pincode: "",
    location: null, // { lat, lng }
    image: ""
  })

  const onChangeHandler = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
  }

  const fetchSellerStatus = async () => {
    try {
      setLoading(true)
      await new Promise((res) => setTimeout(res, 500))
      setAlreadySubmitted(false)
      setStatus("")
      setMessage("")
    } finally {
      setLoading(false)
    }
  }

  const onSubmitHandler = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!storeInfo.username || !storeInfo.name || !storeInfo.email || !storeInfo.contact || !storeInfo.address || !storeInfo.pincode) {
          reject(new Error("Please fill in all required fields."))
          return
        }

        setLoading(true)
        await new Promise((res) => setTimeout(res, 1000))

        // Here you'd send storeInfo (including location) to your backend.
        // If you have an image file, use FormData and POST to your API.

        const simulatedResponse = {
          success: true,
          status: "pending",
          message: "Your store has been submitted and is pending admin approval."
        }

        if (simulatedResponse.success) {
          setAlreadySubmitted(true)
          setStatus(simulatedResponse.status)
          setMessage(simulatedResponse.message)
          resolve(simulatedResponse)
        } else reject(new Error(simulatedResponse.message))
      } catch (err) {
        reject(new Error("Something went wrong. Please try again."))
      } finally {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    fetchSellerStatus()
  }, [])

  if (loading) return <Loading />

  return (
    <>
      {!alreadySubmitted ? (
        <div className="mx-6 min-h-[70vh] my-16">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              toast.promise(
                onSubmitHandler(),
                {
                  loading: "Submitting store details...",
                  success: "Store submitted successfully!",
                  error: (err) => err.message || "Submission failed"
                }
              )
            }}
            className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-600"
          >
            {/* Title */}
            <div>
              <h1 className="text-3xl ">Register Your <span className="text-slate-800 font-medium">Farm / Store</span></h1>
              <p className="max-w-lg text-sm text-slate-600 mt-2">
                Join FreshKart to sell fresh vegetables and fruits to customers in your area.
                Submit your store details for verification — we'll activate your store after admin approval.
              </p>
            </div>

            {/* Logo upload */}
            <label className="mt-6 cursor-pointer flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">Store Logo</span>
              <div className="flex items-center gap-4">
                <Image
                  src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area}
                  className="rounded-lg mt-2 h-20 w-28 object-cover border"
                  alt="store logo preview"
                  width={150}
                  height={100}
                />
                <span className="text-sm text-slate-500">Upload a clear square logo (JPG/PNG)</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })}
                hidden
              />
            </label>

            {/* Form Fields */}
            <div className="w-full max-w-lg mt-4">
              <label className="text-sm text-slate-700">Username</label>
              <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="unique-store-username" className="border border-slate-300 outline-slate-400 w-full p-3 rounded mt-2" required />
            </div>

            <div className="w-full max-w-lg">
              <label className="text-sm text-slate-700">Store Name</label>
              <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Ex: GreenLeaf Farms" className="border border-slate-300 outline-slate-400 w-full p-3 rounded mt-2" required />
            </div>

            <div className="w-full max-w-lg">
              <label className="text-sm text-slate-700">Description</label>
              <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={4} placeholder="Short description about your farm, produce, and practices" className="border border-slate-300 outline-slate-400 w-full p-3 rounded mt-2 resize-none" />
            </div>

            <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700">Email</label>
                <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="store@example.com" className="border border-slate-300 outline-slate-400 w-full p-3 rounded mt-2" required />
              </div>
              <div>
                <label className="text-sm text-slate-700">Contact Number</label>
                <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="+91 98xxxxxxxx" className="border border-slate-300 outline-slate-400 w-full p-3 rounded mt-2" required />
              </div>
            </div>

            <div className="w-full max-w-lg">
              <label className="text-sm text-slate-700">Address</label>
              <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={3} placeholder="Full address (village/street, city, district, state)" className="border border-slate-300 outline-slate-400 w-full p-3 rounded mt-2 resize-none" required />
            </div>

            {/* Pincode Field */}
            <div className="w-full max-w-lg">
              <label className="text-sm text-slate-700">Pincode</label>
              <input name="pincode" onChange={onChangeHandler} value={storeInfo.pincode} type="text" placeholder="Enter your area pincode" className="border border-slate-300 outline-slate-400 w-full p-3 rounded mt-2" required />
            </div>

            {/* Map Picker */}
            <div className="w-full max-w-lg mt-4">
              <label className="text-sm text-slate-700">Pin your exact location</label>
              <MapPicker
                address={storeInfo.address}
                onLocationSelected={(loc, prettyAddress) => setStoreInfo({ ...storeInfo, location: loc, address: prettyAddress || storeInfo.address })}
              />
              <p className="text-xs text-slate-500 mt-2">
                Click the map or drag the marker to set the exact store location. Customers nearby will see your store for delivery options.
              </p>

              {/* show coords for debugging / backend */}
              {storeInfo.location && (
                <div className="mt-3 text-xs text-slate-600">
                  Selected coordinates: <span className="font-medium">{storeInfo.location.lat.toFixed(5)}, {storeInfo.location.lng.toFixed(5)}</span>
                </div>
              )}
            </div>

            <button type="submit" className="bg-green-600 text-white px-12 py-3 rounded mt-6 mb-40 hover:bg-green-700 active:scale-95 transition font-medium">
              Submit Store
            </button>
          </form>
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
          <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-700 text-center max-w-2xl">{message || "Your store has already been submitted."}</p>
          {status === "pending" && <p className="mt-5 text-slate-500">Status: <span className="font-semibold">Pending approval</span></p>}
          {status === "approved" && <p className="mt-5 text-slate-500">Status: <span className="font-semibold">Approved</span></p>}
          {status === "rejected" && <p className="mt-5 text-red-500">Status: <span className="font-semibold">Rejected — please contact support</span></p>}
        </div>
      )}
    </>
  )
}

/**
 * MapPicker component
 * - loads Leaflet dynamically
 * - shows a map centered on either:
 *    1) address (Nominatim lookup)
 *    2) browser geolocation (if user clicks "Use my location")
 *    3) fallback to Baripada (default)
 * - places a draggable marker; clicking map moves it
 * - calls onLocationSelected({lat, lng}, prettyAddress)
 */
function MapPicker({ address = '', onLocationSelected }) {
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const containerRef = useRef(null)
  const [loadingMap, setLoadingMap] = useState(true)
  const [query, setQuery] = useState(address || '')
  const [statusMsg, setStatusMsg] = useState('')

  // default coords -> Baripada
  const defaultCenter = { lat: 21.9336, lng: 86.7102 }
  const leafletRef = useRef(null)

  useEffect(() => {
    let map, L

    const init = async () => {
      setLoadingMap(true)
      L = (await import('leaflet')).default
      leafletRef.current = L

      // create map only once
      if (!mapRef.current) {
        map = L.map(containerRef.current, {
          center: [defaultCenter.lat, defaultCenter.lng],
          zoom: 13,
          scrollWheelZoom: true
        })
        mapRef.current = map

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)

        // marker
        const mk = L.marker([defaultCenter.lat, defaultCenter.lng], { draggable: true }).addTo(map)
        markerRef.current = mk

        mk.on('dragend', async () => {
          const pos = mk.getLatLng()
          onLocationSelected({ lat: pos.lat, lng: pos.lng }, null)
          // optionally reverse geocode to get address
        })

        map.on('click', (e) => {
          const { lat, lng } = e.latlng
          markerRef.current.setLatLng([lat, lng])
          onLocationSelected({ lat, lng }, null)
        })
      } else {
        map = mapRef.current
      }

      // if initial address provided, try geocode
      if (address) {
        await geocodeAddress(address, (latlng, pretty) => {
          map.setView([latlng.lat, latlng.lng], 15)
          markerRef.current.setLatLng([latlng.lat, latlng.lng])
          onLocationSelected(latlng, pretty)
        })
      }

      setLoadingMap(false)
    }

    init()

    return () => {
      // do NOT remove map on unmount to avoid Leaflet errors with Next HMR;
      // if you want full cleanup, call map.remove() here.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // function to geocode address via Nominatim
  const geocodeAddress = async (addr, cb) => {
    try {
      setStatusMsg('Searching address...')
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const data = await res.json()
      if (data && data.length > 0) {
        const top = data[0]
        const latlng = { lat: parseFloat(top.lat), lng: parseFloat(top.lon) }
        const pretty = top.display_name
        setStatusMsg('')
        cb(latlng, pretty)
      } else {
        setStatusMsg('Address not found.')
      }
    } catch (err) {
      console.error(err)
      setStatusMsg('Geocoding failed.')
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query) return
    if (!mapRef.current) return
    await geocodeAddress(query, (latlng, pretty) => {
      mapRef.current.setView([latlng.lat, latlng.lng], 15)
      markerRef.current.setLatLng([latlng.lat, latlng.lng])
      onLocationSelected(latlng, pretty)
    })
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatusMsg('Geolocation not supported by your browser.')
      return
    }
    setStatusMsg('Locating...')
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      if (mapRef.current) {
        mapRef.current.setView([latitude, longitude], 15)
        markerRef.current.setLatLng([latitude, longitude])
        onLocationSelected({ lat: latitude, lng: longitude }, null)
        setStatusMsg('')
      }
    }, (err) => {
      console.error(err)
      setStatusMsg('Unable to retrieve your location.')
    }, { timeout: 10000 })
  }

  return (
    <div className="mt-3">
      <div className="flex gap-2 mb-2 max-w-lg">
        <form onSubmit={handleSearch} className="flex w-full gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search address (street, city, pincode...)"
            className="w-full p-2 border rounded"
          />
          <button className="px-4 py-2 bg-slate-800 text-white rounded" type="submit">Search</button>
        </form>
        <button type="button" onClick={useMyLocation} className="px-4 py-2 bg-green-600 text-white rounded">Use my location</button>
      </div>

      <div ref={containerRef} className="w-full h-64 rounded-lg border" />

      <div className="mt-2 text-xs text-slate-500">
        {loadingMap ? 'Loading map...' : statusMsg || 'Click map or drag marker to set location.'}
      </div>
    </div>
  )
}
