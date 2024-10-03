'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  AlertTriangle,
  Wifi,
  Battery,
  Cog,
  BellRing,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const alertTypeIcons = {
  5: Bell,
  6: AlertTriangle,
  7: Battery,
  16: Wifi,
  17: Cog,
}

const alertTypeColors = {
  Generated: "bg-[#EEF6FA]",
  Pending: "bg-[#FFF9E0]",
  Resolved: "bg-[#E8F9EC] ",
};

const alertTypeBadgeColors = {
  Generated: "bg-[#32ADE6]",
  Pending: "bg-[#FFB800]",
  Resolved: "bg-[#34C759]",
};

const alertTypeTextColors = {
  Generated: "text-[#32ADE6]",
  Pending: "text-[#FFB800]",
  Resolved: "text-[#34C759]",
};



export default function AlertsSlider() {
  const [alerts, setAlerts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [visibleCards, setVisibleCards] = useState(5)

  const handleResize = useCallback(() => {
    if (window.innerWidth < 640) {
      setVisibleCards(1)
    } else if (window.innerWidth < 1024) {
      setVisibleCards(3)
    } else {
      setVisibleCards(5)
    }
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const fetchAlerts = useCallback(async (page = 1, filterType = null) => {
    setIsLoading(true)
    setError(null)
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/events/alerts?page=${page}&limit=${visibleCards}`
      if (filterType && filterType !== 'ALL') {
        url += `&AlertType=${filterType}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch alerts')
      }
      const data = await response.json()

      setAlerts(data.events)
      setTotalPages(Math.ceil(data.total / data.limit))
    } catch (error) {
      console.error('Error fetching alerts:', error)
      setError('Failed to load alerts. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [visibleCards])

  useEffect(() => {
    fetchAlerts(currentPage, activeFilter)
  }, [currentPage, activeFilter, visibleCards, fetchAlerts])

  const handlePageChange = (direction) => {
    const newPage =
      direction === 'next'
        ? Math.min(currentPage + 1, totalPages)
        : Math.max(currentPage - 1, 1)
    setCurrentPage(newPage)
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const formatTimestamp = (ts) => {
    return new Date(ts).toLocaleString()
  }

  const renderPlaceholder = () => (
    <Card className="border-2 transition-all flex-shrink-0 w-full min-h-[150px]">
      <CardContent className="flex flex-col justify-center items-center h-full p-4">
        <Skeleton className="w-12 h-12 rounded-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold mb-4 sm:mb-0">All Meter Alarms</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {['ALL', 'Generated', 'Pending', 'Resolved'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'secondary' : 'outline'}
              onClick={() => handleFilterChange(filter)}
              className={`min-w-[100px] rounded-full ${
                activeFilter === filter
                  ? `border-2 ${alertTypeColors[filter] || ''}`
                  : ''
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  alertTypeBadgeColors[filter] || 'bg-gray-400'
                }`}
              ></span>
              {filter}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-[-20px] z-10 bg-white rounded-full shadow-lg size-6"
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <div className="w-full bg-white p-2 overflow-hidden rounded-lg">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array(visibleCards).fill(null).map((_, index) => (
                <React.Fragment key={index}>{renderPlaceholder()}</React.Fragment>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {alerts.length > 0
                ? alerts.map((alert) => {
                    const IconComponent = alertTypeIcons[alert.Type] || Cog
                    return (
                      <Card
                        key={alert._id}
                        className={` transition-all flex-shrink-0 w-full h-fit border-0  ${
                          alertTypeColors[alert.AlertType]
                        } group relative overflow-hidden`}
                      >
                        <CardHeader className="p-2">
                          <div className="flex justify-between items-center">
                            <IconComponent
                              className={`${
                                alertTypeTextColors[alert.AlertType]
                              } size-6`}
                            />
                            <Badge
                              className={`${
                                alertTypeBadgeColors[alert.AlertType]
                              } text-white size-10 rounded-full -rotate-12 `}
                            >
                              <BellRing />
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-2">
                          <div className="flex flex-col">
                            <p className="text-lg font-bold line-clamp-2">{alert.eventName}</p>
                            <p className="text-sm text-gray-700">{formatTimestamp(alert.TS)}</p>
                          </div>
                        </CardContent>
                        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="text-white text-center p-4">
                            <p className="mb-1">Device ID: {alert.DEVICE_ID}</p>
                          </div>
                        </div>
                      </Card>
                    )
                  })
                : Array(visibleCards)
                    .fill(null)
                    .map((_, index) => (
                      <React.Fragment key={index}>{renderPlaceholder()}</React.Fragment>
                    ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-[-20px] z-10 bg-white rounded-full shadow-lg size-6"
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages || isLoading}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <div className="flex justify-center items-center mt-6">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  )
}