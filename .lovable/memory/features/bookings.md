---
name: Bookings & Ratings System
description: Guest-host booking requests and post-Shabbat category ratings (hospitality, food, atmosphere)
type: feature
---
- `bookings` table: guest_user_id, host_user_id, host_type, event_date, status (pending→approved→completed), message
- `ratings` table: booking_id, reviewer/reviewed user, hospitality/food/atmosphere ratings (1-5), comment
- Unique constraint: one rating per user per booking
- RLS: guests see own bookings, hosts see theirs, hosts update status, ratings only for completed bookings
- UI: BookingRequestDialog (from Explore), RatingDialog (from MyBookings), MyBookings page at /my-bookings
