-- Create the bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  car_type text NOT NULL,
  pickup_date date NOT NULL,
  return_date date NOT NULL,
  pickup_location text NOT NULL,
  drop_location text,
  special_requests text,
  total_amount numeric(10, 2) NOT NULL,
  status text DEFAULT 'pending' NOT NULL, -- e.g., 'pending', 'confirmed', 'completed', 'cancelled'
  payment_intent_id text UNIQUE, -- Link to Stripe PaymentIntent
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Add indexes for faster queries
CREATE INDEX idx_bookings_user_id ON public.bookings (user_id);
CREATE INDEX idx_bookings_pickup_date ON public.bookings (pickup_date);

-- Set up Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings." ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own bookings
CREATE POLICY "Users can insert their own bookings." ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (e.g., status changes, though typically done by admin)
CREATE POLICY "Users can update their own bookings." ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users cannot delete bookings (typically only admin can)
-- CREATE POLICY "Users cannot delete bookings." ON public.bookings
--   FOR DELETE USING (false);
