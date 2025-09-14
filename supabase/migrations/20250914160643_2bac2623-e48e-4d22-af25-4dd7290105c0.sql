-- Create locations table for cities/states/countries
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(country, state, city)
);

-- Create stations table for monitoring stations
CREATE TABLE public.stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_name TEXT NOT NULL,
  station_code TEXT,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(station_name, location_id)
);

-- Create pollutants lookup table
CREATE TABLE public.pollutants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  unit TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert common pollutants
INSERT INTO public.pollutants (code, name, unit, description) VALUES
('PM2.5', 'Particulate Matter 2.5', 'μg/m³', 'Fine particles with diameter ≤ 2.5 micrometers'),
('PM10', 'Particulate Matter 10', 'μg/m³', 'Particles with diameter ≤ 10 micrometers'),
('NO2', 'Nitrogen Dioxide', 'μg/m³', 'Nitrogen dioxide gas'),
('NO', 'Nitrogen Monoxide', 'μg/m³', 'Nitrogen monoxide gas'),
('NOx', 'Nitrogen Oxides', 'μg/m³', 'Total nitrogen oxides'),
('NH3', 'Ammonia', 'μg/m³', 'Ammonia gas'),
('CO', 'Carbon Monoxide', 'mg/m³', 'Carbon monoxide gas'),
('SO2', 'Sulfur Dioxide', 'μg/m³', 'Sulfur dioxide gas'),
('O3', 'Ozone', 'μg/m³', 'Ground-level ozone'),
('OZONE', 'Ozone', 'μg/m³', 'Ground-level ozone'),
('Benzene', 'Benzene', 'μg/m³', 'Benzene compound'),
('Toluene', 'Toluene', 'μg/m³', 'Toluene compound'),
('Xylene', 'Xylene', 'μg/m³', 'Xylene compound');

-- Create AQI buckets table
CREATE TABLE public.aqi_buckets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  min_aqi INTEGER NOT NULL,
  max_aqi INTEGER NOT NULL,
  color_code TEXT,
  health_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert AQI bucket classifications
INSERT INTO public.aqi_buckets (name, min_aqi, max_aqi, color_code, health_message) VALUES
('Good', 0, 50, '#00E400', 'Air quality is satisfactory, and air pollution poses little or no risk'),
('Satisfactory', 51, 100, '#FFFF00', 'Air quality is acceptable for most people'),
('Moderate', 101, 200, '#FF7E00', 'Sensitive individuals may experience minor breathing discomfort'),
('Poor', 201, 300, '#FF0000', 'Sensitive people may experience breathing discomfort'),
('Very Poor', 301, 400, '#8F3F97', 'Respiratory illness on prolonged exposure'),
('Severe', 401, 500, '#7E0023', 'Affects healthy people and seriously impacts those with existing diseases');

-- Create air quality readings table for individual pollutant measurements
CREATE TABLE public.air_quality_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  pollutant_id UUID NOT NULL REFERENCES public.pollutants(id) ON DELETE CASCADE,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  min_value DECIMAL(10, 3),
  max_value DECIMAL(10, 3),
  avg_value DECIMAL(10, 3),
  unit TEXT,
  data_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create air quality summary table for daily/hourly AQI summaries
CREATE TABLE public.air_quality_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  aqi DECIMAL(6, 2),
  aqi_bucket_id UUID REFERENCES public.aqi_buckets(id),
  dominant_pollutant TEXT,
  pm25 DECIMAL(10, 3),
  pm10 DECIMAL(10, 3),
  no2 DECIMAL(10, 3),
  no DECIMAL(10, 3),
  nox DECIMAL(10, 3),
  nh3 DECIMAL(10, 3),
  co DECIMAL(10, 3),
  so2 DECIMAL(10, 3),
  o3 DECIMAL(10, 3),
  benzene DECIMAL(10, 3),
  toluene DECIMAL(10, 3),
  xylene DECIMAL(10, 3),
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  wind_speed DECIMAL(5, 2),
  wind_direction TEXT,
  summary_type TEXT DEFAULT 'daily' CHECK (summary_type IN ('hourly', 'daily')),
  data_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(station_id, measured_at, summary_type)
);

-- Create user profiles table for personalized health alerts
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  age INTEGER,
  health_conditions TEXT[],
  sensitivity_level TEXT DEFAULT 'normal' CHECK (sensitivity_level IN ('low', 'normal', 'high')),
  preferred_location_id UUID REFERENCES public.locations(id),
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "push": true,
    "sms": false,
    "threshold_aqi": 150
  }',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health alerts table
CREATE TABLE public.health_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('aqi_threshold', 'pollutant_spike', 'health_advisory')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  aqi_value DECIMAL(6, 2),
  dominant_pollutant TEXT,
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI predictions table
CREATE TABLE public.ai_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  predicted_for TIMESTAMP WITH TIME ZONE NOT NULL,
  predicted_aqi DECIMAL(6, 2),
  predicted_bucket TEXT,
  confidence_score DECIMAL(3, 2),
  weather_factors JSONB,
  model_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(location_id, predicted_for)
);

-- Enable RLS on all tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pollutants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aqi_buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.air_quality_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.air_quality_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access to reference data
CREATE POLICY "Everyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Everyone can view stations" ON public.stations FOR SELECT USING (true);
CREATE POLICY "Everyone can view pollutants" ON public.pollutants FOR SELECT USING (true);
CREATE POLICY "Everyone can view aqi_buckets" ON public.aqi_buckets FOR SELECT USING (true);
CREATE POLICY "Everyone can view air_quality_readings" ON public.air_quality_readings FOR SELECT USING (true);
CREATE POLICY "Everyone can view air_quality_summary" ON public.air_quality_summary FOR SELECT USING (true);
CREATE POLICY "Everyone can view ai_predictions" ON public.ai_predictions FOR SELECT USING (true);

-- Create RLS policies for user-specific data
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own alerts" ON public.health_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.health_alerts FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_air_quality_readings_station_time ON public.air_quality_readings(station_id, measured_at DESC);
CREATE INDEX idx_air_quality_readings_pollutant ON public.air_quality_readings(pollutant_id);
CREATE INDEX idx_air_quality_summary_location_time ON public.air_quality_summary(location_id, measured_at DESC);
CREATE INDEX idx_air_quality_summary_aqi ON public.air_quality_summary(aqi);
CREATE INDEX idx_stations_location ON public.stations(location_id);
CREATE INDEX idx_health_alerts_user_created ON public.health_alerts(user_id, created_at DESC);
CREATE INDEX idx_ai_predictions_location_time ON public.ai_predictions(location_id, predicted_for);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON public.stations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_air_quality_readings_updated_at BEFORE UPDATE ON public.air_quality_readings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_air_quality_summary_updated_at BEFORE UPDATE ON public.air_quality_summary FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Create trigger for automatic user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();