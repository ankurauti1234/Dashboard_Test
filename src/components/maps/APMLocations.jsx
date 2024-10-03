'use client'

import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Search } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

// Updated dummy data for Dominican Republic locations with device IDs
const locations = {
  APM1: [
    { name: 'Santo Domingo', lat: 18.4861, lon: -69.9312, deviceId: '100001' },
    { name: 'Santiago', lat: 19.4517, lon: -70.697, deviceId: '100002' },
    { name: 'La Romana', lat: 18.4273, lon: -68.9728, deviceId: '100003' },
  ],
  APM2: [
    { name: 'Puerto Plata', lat: 19.7934, lon: -70.6884, deviceId: '200001' },
    { name: 'San Pedro de Macorís', lat: 18.4539, lon: -69.3086, deviceId: '200002' },
    { name: 'La Vega', lat: 19.2222, lon: -70.5295, deviceId: '200003' },
  ],
  APM3: [
    { name: 'San Francisco de Macorís', lat: 19.3008, lon: -70.2528, deviceId: '300001' },
    { name: 'Higüey', lat: 18.6151, lon: -68.7075, deviceId: '300002' },
    { name: 'Barahona', lat: 18.2085, lon: -71.1008, deviceId: '300003' },
  ],
}

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid #fff;"></div>`,
    iconSize: [15, 15],
    iconAnchor: [7, 7],
  })
}

const icons = {
  APM1: createCustomIcon('#28B7C4'),
  APM2: createCustomIcon('#9F5BC1'),
  APM3: createCustomIcon('#FFA500'),
}



export default function APMLocations() {
  const [selectedAPM, setSelectedAPM] = useState('ALL')
  const [mapKey, setMapKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1)
  }, [selectedAPM])

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getLocations = useMemo(() => {
    let filteredLocations = []

    if (searchQuery) {
      filteredLocations = Object.entries(locations).flatMap(([apm, locs]) =>
        locs
          .filter((loc) => loc.deviceId.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((loc) => ({ ...loc, apm }))
      )
    } else if (selectedAPM === 'ALL') {
      filteredLocations = Object.entries(locations).flatMap(([apm, locs]) =>
        locs.map((loc) => ({ ...loc, apm }))
      )
    } else {
      filteredLocations = locations[selectedAPM ]?.map((loc) => ({ ...loc, apm: selectedAPM })) || []
    }

    return filteredLocations
  }, [searchQuery, selectedAPM])

  const center = useMemo(() => {
    return getLocations.length > 0
      ? [getLocations[0].lat, getLocations[0].lon]
      : [18.7357, -70.1627] // Center of Dominican Republic
  }, [getLocations])

  const renderMap = () => (
    <MapContainer
      key={mapKey}
      center={center}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
      className="z-0 rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {getLocations.map((location, index) => (
        <Marker
          key={index}
          position={[location.lat, location.lon]}
          icon={icons[location.apm ]}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <p className="text-sm text-gray-600">{location.apm}</p>
              <p className="text-sm text-gray-600">Device ID: {location.deviceId}</p>
              <p className="text-xs text-gray-500">
                Lat: {location.lat.toFixed(4)}, Lon: {location.lon.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )

  const renderSkeleton = () => (
    <div className="w-full h-full rounded-xl bg-gray-200 animate-pulse">
      <div className="h-full flex items-center justify-center">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    </div>
  )

  return (
    <div className="relative w-full bg-white rounded-2xl h-full p-2">
      {isLoading ? renderSkeleton() : renderMap()}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex flex-col sm:flex-row w-full justify-between gap-4">
          <div className="flex w-full rounded-full shadow-md overflow-hidden bg-white">
            <input
              className="w-full h-9 px-3 rounded-full"
              placeholder="Search Device ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Device ID"
            />
            <button className="px-3" aria-label="Search">
              <Search />
            </button>
          </div>
          <div className="flex gap-2 w-full justify-center sm:justify-end">
            {['ALL', 'APM1', 'APM2', 'APM3'].map((apm) => {
              const bgColor =
                apm === 'APM1'
                  ? 'bg-[#E4FBFF]'
                  : apm === 'APM2'
                  ? 'bg-[#F7E8FE]'
                  : apm === 'APM3'
                  ? 'bg-[#FFEBCF]'
                  : 'bg-gray-200'

              const circleColor =
                apm === 'APM1'
                  ? 'bg-[#30b0c7]'
                  : apm === 'APM2'
                  ? 'bg-[#af52de]'
                  : apm === 'APM3'
                  ? 'bg-[#ff9500]'
                  : 'bg-gray-400'

              return (
                <button
                  key={apm}
                  onClick={() => {
                    setSelectedAPM(apm)
                    setSearchQuery('')
                  }}
                  className={`flex items-center justify-center rounded-full px-4 py-0 ${
                    selectedAPM === apm ? 'border-2 border-black' : ''
                  } ${bgColor}`}
                  aria-pressed={selectedAPM === apm}
                  aria-label={`Filter by ${apm}`}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${circleColor}`}></div>
                  <div className="text-start">
                    <p className="text-sm font-semibold text-neutral-700">{apm}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}