'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import { IoSearch, IoLocationOutline, IoTimeOutline, IoBusinessOutline, IoCalendarOutline, IoPeopleOutline, IoChevronDown, IoRemoveOutline, IoAddOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { useRouter } from "next/navigation";
import useFetchListing from "../requests/fetchListings";
import { BsBuildings } from "react-icons/bs";
import { GiModernCity } from "react-icons/gi";
import { TiDeleteOutline } from "react-icons/ti";

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'location' | 'recent' | 'business' | 'nearby';
  imageUrl?: string;
}

interface GuestCounts {
  adults: number;
  children: number;
  rooms: number;
}

interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function HotelSearchHomepage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const {listings} = useFetchListing();
  const hotelsListings = listings?.filter((user) => user.category === "Hotel");

  // Property type selection state
  const [showPropertyPopup, setShowPropertyPopup] = useState(false);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const propertyTypes = ['فلل', 'شقق', 'مكاتب', 'بناء'];
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  
  // City selection state
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const cities = ['جدة', 'المدينة', 'مكة', 'العيون', 'المويه', 'القنفدة', 'النعيرية', 'العويقيلية'];
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const propertyRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to center popup function
  const scrollToCenter = (element: HTMLElement) => {
    if (!element) return;
    
    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate the center position
    const elementCenter = elementRect.top + scrollTop + (elementRect.height / 2);
    const viewportCenter = viewportHeight / 2;
    const targetScrollTop = elementCenter - viewportCenter;
    
    // Smooth scroll to the calculated position
    window.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!debouncedQuery) return [];
    return (
      hotelsListings
        ?.filter((hotel) =>
          (hotel.name ?? "").toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          (hotel.location ?? "").toLowerCase().includes(debouncedQuery.toLowerCase())
        )
        .slice(0, 6)
        .map((hotel) => ({
          id: String(hotel.id),
          title: hotel.name ?? "Unnamed Hotel",
          subtitle: hotel.location ?? "Unknown location",
          type: "location" as const,
          imageUrl: hotel.image ?? undefined,
        })) ?? []
    );
  }, [debouncedQuery, hotelsListings]);

  // Scroll to center when popups open
  useEffect(() => {
    if (showCalendar && calendarRef.current) {
      const timer = setTimeout(() => {
        scrollToCenter(calendarRef.current!);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showCalendar]);

  useEffect(() => {
    if (showPropertyPopup && propertyRef.current) {
      const timer = setTimeout(() => {
        scrollToCenter(propertyRef.current!);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showPropertyPopup]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (propertyRef.current && !propertyRef.current.contains(event.target as Node)) {
        setShowPropertyPopup(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  // Property type toggle
  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getPropertyText = () => {
    if (selectedPropertyTypes.length === 0) return "إختر نوع معين";
    if (selectedPropertyTypes.length === 1) return selectedPropertyTypes[0];
    return `${selectedPropertyTypes.length} types`;
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateSelected = (date: Date) => {
    const dateTime = date.getTime();
    return (
      (dateRange.checkIn && dateRange.checkIn.getTime() === dateTime) ||
      (dateRange.checkOut && dateRange.checkOut.getTime() === dateTime)
    );
  };

  const isDateInRange = (date: Date) => {
    if (!dateRange.checkIn || !dateRange.checkOut) return false;
    const dateTime = date.getTime();
    return dateTime > dateRange.checkIn.getTime() && dateTime < dateRange.checkOut.getTime();
  };

  const handleDateClick = (date: Date) => {
    if (!selectingCheckOut && !dateRange.checkIn) {
      setDateRange({ checkIn: date, checkOut: null });
      setSelectingCheckOut(true);
    } else if (selectingCheckOut) {
      if (dateRange.checkIn && date > dateRange.checkIn) {
        setDateRange(prev => ({ ...prev, checkOut: date }));
        setSelectingCheckOut(false);
      } else {
        setDateRange({ checkIn: date, checkOut: null });
      }
    } else {
      setDateRange({ checkIn: date, checkOut: null });
      setSelectingCheckOut(true);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getDateRangeText = () => {
    if (!dateRange.checkIn) return "Check dates";
    if (!dateRange.checkOut) return `${formatDate(dateRange.checkIn)} - Out`;
    return `${formatDate(dateRange.checkIn)} - ${formatDate(dateRange.checkOut)}`;
  };

  // City checkbox toggle
  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const getCityText = () => {
    if (selectedCities.length === 0) return "إختر مدينة معينة";
    if (selectedCities.length === 1) return selectedCities[0];
    return `${selectedCities.length} cities`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = isDateSelected(date);
      const isInRange = isDateInRange(date);
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      
      days.push(
        <button
          key={day}
          onClick={() => !isPast && handleDateClick(date)}
          disabled={isPast}
          className={`w-10 h-10 text-sm rounded-full transition-colors ${
            isPast 
              ? 'text-gray-300 cursor-not-allowed' 
              : isSelected
              ? 'bg-highlights text-white font-semibold'
              : isInRange
              ? 'bg-secondary text-white'
              : isToday
              ? 'bg-background text-white font-semibold'
              : 'hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // include property types, dates, and cities
      const params = new URLSearchParams({
        q: searchQuery,
        propertyTypes: selectedPropertyTypes.join(','),
        checkIn: dateRange.checkIn ? dateRange.checkIn.toISOString() : "",
        checkOut: dateRange.checkOut ? dateRange.checkOut.toISOString() : "",
        cities: selectedCities.join(','),
      });
      router.push(`/en/search-hotel?${params.toString()}`);
    }
  };

  return (
    <div ref={containerRef} className="relative mx-2">
      <div className="relative flex justify-center items-center gap-3 flex-wrap bg-yel py-4 rounded-3xl lg:rounded-full">
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="إبحث عن شقق أو فلل ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="pl-12 pr-4 w-[330px] md:w-full xl:w-[400px] text-gray-700 rounded-3xl h-12 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-highlights focus:border-transparent transition-all shadow-sm"
          />
          <CiLocationOn className="absolute left-6 top-4 text-secondary" size={18} />
        </div>

        {/* City Selection Button */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setShowCalendar(!showCalendar);
              setShowPropertyPopup(false);
              setShowSuggestions(false);
            }}
            className="flex items-center justify-center gap-2 w-40 h-12 bg-white border border-gray-200 hover:border-secondary hover:shadow-md text-gray-700 px-1 py-1 rounded-3xl font-medium transition-all"
          >
            <GiModernCity size={18} className="text-secondary" />
            <span className="text-sm truncate">{getCityText()}</span>
          </button>

          {/* Property Type Selection Button */}
          <button
            type="button"
            onClick={() => {
              setShowPropertyPopup(!showPropertyPopup);
              setShowCalendar(false);
              setShowSuggestions(false);
            }}
            className="flex items-center justify-center gap-2 w-40 h-12 bg-white border border-gray-200 hover:border-secondary hover:shadow-md text-gray-700 px-1 py-1 rounded-3xl font-medium transition-all"
          >
            <BsBuildings size={18} className="text-secondary" />
            <span className="text-sm truncate">{getPropertyText()}</span>
          </button>
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="w-[330px] md:w-48 h-11 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-3xl font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          إبحث
        </button>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && searchQuery && (
        <div
          ref={suggestionsRef}
          className="absolute top-16 left-0 lg:left-4 right-0 mx-2 lg:w-[345px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {suggestions.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No suggestions found for "{searchQuery}"
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                onClick={() => {
                  setSearchQuery(suggestion.title);
                  setShowSuggestions(false);
                  setShowCalendar(false);
                  setShowPropertyPopup(false);
                  router.push(`/en/booking/${suggestion.id}`);
                }}
              >
                <div className="flex-shrink-0 mr-3">
                  {suggestion.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE}/${suggestion.imageUrl}`}
                      alt={suggestion.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <IoLocationOutline className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.subtitle}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Property Type Selection Popup */}
      {showPropertyPopup && (
        <div
          ref={propertyRef}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إختر نوع واحد أو أكثر</h3>
          
          {/* Property Type Checkboxes */}
         <div className="grid grid-cols-1 sm:grid-cols-2  mb-6">
            {propertyTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedPropertyTypes.includes(type)}
                  onChange={() => togglePropertyType(type)}
                  className="w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary focus:ring-2 cursor-pointer"
                />
                <span className="text-gray-900 font-medium">{type}</span>
              </label>
            ))}
          </div>

          {/* Selected property types display */}
          {selectedPropertyTypes.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
       <div className="text-sm text-gray-600 mb-2">اﻹختيارات:</div>
              <div className="flex flex-wrap gap-2">
                {selectedPropertyTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm rounded-full"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => togglePropertyType(type)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <TiDeleteOutline size={22}/>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowPropertyPopup(false);
                setShowCalendar(false);
              }}
              className="w-full bg-secondary hover:bg-neutral text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
            >
              موافق
            </button>
          </div>
        </div>
      )}

      {/* City Selection Popup */}
      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">إختر مدية أو أكثر</h3>
          
          {/* City Checkboxes */}
       <div className="grid grid-cols-1 sm:grid-cols-2  mb-6">
            {cities.map((city) => (
              <label
                key={city}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCities.includes(city)}
                  onChange={() => toggleCity(city)}
                  className="w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary focus:ring-2 cursor-pointer"
                />
                <span className="text-gray-900 font-medium">{city}</span>
              </label>
            ))}

            
          </div>

          {/* Selected cities display */}
          {selectedCities.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">اﻹختيارات:</div>
              <div className="flex flex-wrap gap-2">
                {selectedCities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-sm rounded-full"
                  >
                    {city}
                    <button
                      type="button"
                      onClick={() => toggleCity(city)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                     <TiDeleteOutline size={22}/>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowCalendar(false);
                setShowPropertyPopup(false);
              }}
              className="w-full bg-secondary hover:bg-neutral text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
            >
             موافق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}