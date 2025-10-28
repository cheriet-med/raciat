'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Minus, Clock } from 'lucide-react';
import { LuUsersRound } from 'react-icons/lu';
import useFetchBooking from '@/components/requests/fetchBooking';
import { useSession } from 'next-auth/react';
import LoginButtonReservationsRestaurant from '../header/loginButtonReservationRestaurant';
import { useRouter } from "next/navigation";
import moment from 'moment';
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa";

import { RiChatSmileAiLine } from "react-icons/ri";

import LoginButtonLiveChat from '@/components/header/loginButtonLiveChatContactPage';



const RestaurantBookingComponent = ({bookdata}:any) => {
  // Fetch existing reservations using your hook
  const { Booking, isLoading } = useFetchBooking(bookdata.id);
    const now = moment();
    const router = useRouter();
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Select date');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [isLoadingg, setIsLoadingg] = useState(false);
  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Select time');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Guest selector state
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [partner, setPartner] = useState(false);
  const [select, setSelect] = useState(false);
  const { data: session, status } = useSession( );

  // Refs for popups and their trigger buttons
  const datePickerRef = useRef<HTMLDivElement>(null);
  const datePickerButtonRef = useRef<HTMLButtonElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const timePickerButtonRef = useRef<HTMLButtonElement>(null);
  const guestSelectorRef = useRef<HTMLDivElement>(null);
  const guestSelectorButtonRef = useRef<HTMLButtonElement>(null);

  // Smooth scroll function to center popup
  const scrollToCenter = (popupRef: React.RefObject<HTMLDivElement | null>) => {
    if (popupRef.current) {
      const popup = popupRef.current;
      const popupRect = popup.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate the center position
      const popupCenter = popupRect.top + popupRect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const scrollOffset = popupCenter - viewportCenter;
      
      // Smooth scroll to center the popup
      window.scrollBy({
        top: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  // Close popups when clicking outside - HANDLES ALL THREE POPUPS
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside date picker popup
      if (
        showDatePicker &&
        datePickerRef.current && 
        !datePickerRef.current.contains(event.target as Node) &&
        datePickerButtonRef.current &&
        !datePickerButtonRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }

      // Check if click is outside time picker popup
      if (
        showTimePicker &&
        timePickerRef.current && 
        !timePickerRef.current.contains(event.target as Node) &&
        timePickerButtonRef.current &&
        !timePickerButtonRef.current.contains(event.target as Node)
      ) {
        setShowTimePicker(false);
      }

      // Check if click is outside guest selector popup
      if (
        showGuestSelector &&
        guestSelectorRef.current && 
        !guestSelectorRef.current.contains(event.target as Node) &&
        guestSelectorButtonRef.current &&
        !guestSelectorButtonRef.current.contains(event.target as Node)
      ) {
        setShowGuestSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker, showTimePicker, showGuestSelector]);

  // Generate time slots from 6:00 AM to 11:30 PM (30-minute intervals)
  const generateTimeSlots = (): string[] => {
    const slots = [];
    for (let hour = 6; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Helper function to safely parse dates
  const parseDate = (dateValue: any): string | null => {
    if (!dateValue) return null;
    
    // Skip invalid string values
    if (typeof dateValue === 'string') {
      const trimmedValue = dateValue.trim().toLowerCase();
      if (trimmedValue === 'today' || trimmedValue === 'tomorrow' || trimmedValue === '' || trimmedValue === 'null') {
        console.warn('Skipping invalid date string:', dateValue);
        return null;
      }
    }
    
    try {
      let dateObj;
      
      if (typeof dateValue === 'string') {
        // Handle ISO date strings like "2025-08-18T23:00:00.000Z"
        dateObj = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        dateObj = dateValue;
      } else {
        console.warn('Unexpected date type:', typeof dateValue, dateValue);
        return null;
      }
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date value:', dateValue);
        return null;
      }
      
      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error parsing date:', dateValue, error);
      return null;
    }
  };

  // Count reservations for a specific date
  const getReservationCountForDate = (date: Date): number => {
    if (!Booking || !Array.isArray(Booking)) return 0;
    
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return Booking.filter(reservation => {
      // Only count reservations that have valid restaurant data
      if (!reservation.restaurat_check_in_date || !reservation.restaurat_check_in_time) return false;
      
      const parsedDate = parseDate(reservation.restaurat_check_in_date);
      return parsedDate === dateString;
    }).length;
  };

  // Check if a specific time slot is reserved for a date
  const isTimeSlotReserved = (date: Date, timeSlot: string): boolean => {
    if (!Booking || !Array.isArray(Booking)) return false;
    
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return Booking.some(reservation => {
      // Check if this is a restaurant reservation with valid time
      if (!reservation.restaurat_check_in_time || !reservation.restaurat_check_in_date) return false;
      
      const parsedDate = parseDate(reservation.restaurat_check_in_date);
      return parsedDate === dateString && reservation.restaurat_check_in_time === timeSlot;
    });
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = (): string[] => {
    if (!selectedDateObj) return timeSlots;
    
    return timeSlots.filter(timeSlot => !isTimeSlotReserved(selectedDateObj, timeSlot));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Function to check if a date is unavailable (you can modify this based on your reservation data)
  const isDateUnavailable = (date: Date): boolean => {
    // Check if restaurant is closed on Mondays
    //const isClosedDay = date.getDay() === 1;
     //const isClosedDay1 = date.getDay() === 2;
     console.log(date.getDay())
    // Check if date has 5 or more reservations
    const reservationCount = getReservationCountForDate(date);
    const isFullyBooked = reservationCount >= 5;
    // isClosedDay || isClosedDay1 || 
    return isFullyBooked;
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDateSelected = (date: Date | null): boolean => {
    if (!date || !selectedDateObj) return false;
    return date.getTime() === selectedDateObj.getTime();
  };

  const handleDateClick = (date: Date): void => {
    setSelectedDateObj(date);
    setSelectedDate(formatDate(date));
    setShowDatePicker(false);
    // Reset time selection when date changes
    setSelectedTimeSlot(null);
    setSelectedTime('Select time');
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const resetDate = () => {
    setSelectedDateObj(null);
    setSelectedDate('Select date');
    // Also reset time when date is cleared
    setSelectedTimeSlot(null);
    setSelectedTime('Select time');
  };

  const resetTime = () => {
    setSelectedTimeSlot(null);
    setSelectedTime('Select time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  const updateGuests = (type: keyof typeof guests, increment: boolean): void => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
    }));
  };

  // Handle popup opening with smooth scroll - UPDATED WITH MUTUAL EXCLUSIVITY
  const handleDatePickerOpen = () => {
    setShowDatePicker(!showDatePicker);
    setShowTimePicker(false); // Close other popups
    setShowGuestSelector(false);
    
    if (!showDatePicker) {
      setTimeout(() => {
        scrollToCenter(datePickerRef);
      }, 100);
    }
  };

  const handleTimePickerOpen = () => {
    setShowTimePicker(!showTimePicker);
    setShowDatePicker(false); // Close other popups
    setShowGuestSelector(false);
    
    if (!showTimePicker) {
      setTimeout(() => {
        scrollToCenter(timePickerRef);
      }, 100);
    }
  };

  const handleGuestSelectorOpen = () => {
    setShowGuestSelector(!showGuestSelector);
    setShowDatePicker(false); // Close other popups
    setShowTimePicker(false);
    
    if (!showGuestSelector) {
      setTimeout(() => {
        scrollToCenter(guestSelectorRef);
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if(!selectedDateObj || !selectedTimeSlot){
      setSelect(true)
      return
    }
    setIsLoadingg(true);
    const reservationData = {
      product: bookdata.id,
      user: session?.user?.id,
      restaurat_check_in_date: selectedDateObj,
      restaurat_check_in_time: selectedTimeSlot,
      adults: guests.adults,
      children: guests.children,
      created_at:now.format('MMMM Do YYYY'),
      status:"pending",
      image:bookdata.image,
      receipt:bookdata.receipt,
      total_guests:guests.adults+guests.children,
      total_price:bookdata.average_cost,
      payment_method:"Cash",
      name:bookdata.name,
      category:'Restaurant',
      cancellation_policy:bookdata.cancellation_policy,
      location:bookdata.location,
      user_owner:bookdata.user
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}order/`,
        {
          method: 'POST',
          headers: {
            "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create reservation');
      }

      const data = await response.json();
      
      // Reset form after successful submission
      setSelectedDateObj(null);
      setSelectedDate('Select date');
      setSelectedTimeSlot(null);
      setSelectedTime('Select time');
      
      router.push(`/en/checkout-booking?nb=${data.id}`); 
      // Note: The useFetchBooking hook should automatically refetch data
      // if it's set up to do so, or you might need to trigger a refetch
      
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          >
            <ChevronLeft size={20} className="md:w-4 md:h-4" />
          </button>
          <h3 className="font-semibold text-base md:text-lg">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          >
            <ChevronRight size={20} className="md:w-4 md:h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center text-xs md:text-sm text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-10 md:h-10" />;
            }
            
            const isSelected = isDateSelected(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = date.getTime() < new Date().setHours(0, 0, 0, 0);
            const isUnavailable = isDateUnavailable(date);
            const isDisabled = isPast || isUnavailable;
            const reservationCount = getReservationCountForDate(date);
            const isFullyBooked = reservationCount >= 5;
            
            return (
              <button
                key={index}
                onClick={() => !isDisabled && handleDateClick(date)}
                disabled={isDisabled}
                className={`
                  h-10 md:h-10 text-sm rounded-lg transition-all duration-200 touch-manipulation relative
                  ${isDisabled
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'hover:bg-gray-50 cursor-pointer active:bg-gray-100'
                  }
                  ${isSelected 
                    ? 'bg-secondary text-white hover:bg-highlights' 
                    : ''
                  }
                  ${isToday && !isSelected 
                    ? 'border-2 border-secondary' 
                    : ''
                  }
                  ${isUnavailable && !isPast
                    ? 'bg-black text-white cursor-not-allowed' 
                    : ''
                  }
                  ${isFullyBooked && !isPast && !isUnavailable
                    ? 'bg-background text-white cursor-not-allowed'
                    : ''
                  }
                `}
                title={
                  isFullyBooked ? 'Fully booked (5/5 reservations)' :
                  isUnavailable ? 'Restaurant closed on this date' : 
                  reservationCount > 0 ? `${reservationCount}/5 reservations` : ''
                }
              >
                {date.getDate()}
                {reservationCount > 0 && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {reservationCount}
                  </div>
                )}
                {(isUnavailable || isFullyBooked) && !isPast && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-0.5 h-6 bg-red-400 rotate-45"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">إتصل بنا
         
        </h2>
        <p className="text-sm text-gray-500 mb-6">قم بملئ اﻹستمارة وسنتواصل معك عبر الهاتف أو إختر الدردشة المباشرة</p>

        <div className="space-y-4">


             <div className="space-y-2 items-center">

                    <div className="relative">
                      
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        
                    className="pr-4 h-12 w-full rounded-lg bg-gray-50 border border-bl focus:border-yel focus:ring-1 focus:ring-yel outline-none"       
                        placeholder="أﻷسم الكامل"
                      />
                    </div>
                  
                  </div>

             <div className="space-y-2 items-center">

                    <div className="relative">
                      
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        
                    className="pr-4 h-12 w-full rounded-lg bg-gray-50 border border-bl focus:border-yel focus:ring-1 focus:ring-yel outline-none"       
                   placeholder="رقم الهاتف"
                      />
                    </div>
                  
                  </div>


          <div className="border-t border-gray-200 pt-4">
            {status === "authenticated" ?       
              (session?.user?.is_staff?    
                <button 
                  className="w-full bg-secondary hover:bg-accent text-white font-medium py-3 rounded-3xl disabled:bg-gray-400"
                  onClick={()=> setPartner(true)}
                >
                 أحجز موعد
                </button>:
                <button
                  disabled={isLoadingg}
                  onClick={handleSubmit}
                  className={`w-full flex items-center justify-center gap-2 
                    bg-secondary hover:bg-accent text-white font-medium py-2 rounded-3xl ${
                      isLoadingg
                        ? "bg-secondary hover:bg-accent text-white"
                        : "bg-accent text-white hover:bg-accent"
                    }`}
                >
                  {isLoadingg ? (
                    <>
                      <FaCircleNotch className="animate-spin" />
                      <span> حجز موعد</span>
                    </>
                  ) : (
                    "أحجز موعد"
                  )}
                </button>
              ) 
              : <LoginButtonReservationsRestaurant/>}
          </div>
          
        
                    { status === "authenticated" ?       
                                
                                  <button
                                    
                                    onClick={()=>router.push(`/en/account/messages/?id=10`)}
                                    className="p-1 flex gap-4 justify-center items-center bg-primary w-full h-16 text-yel rounded-lg shadow-lg hover:bg-yel transition-all bg-opacity-95 border border-spacing-1 border-bl"
                                  >
                                    <RiChatSmileAiLine size={32} className='text-bl '/>
                                   <p className='text-bl font-bold'>الدردشة المباشرة</p>
                                   
                                  </button>
                               
                              :  <LoginButtonLiveChat/> }
        </div>
      </div>
    </div>
  );
};

export default RestaurantBookingComponent;