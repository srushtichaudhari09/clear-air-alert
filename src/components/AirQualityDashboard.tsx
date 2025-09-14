import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wind, MapPin, AlertTriangle, Heart, Thermometer, Eye, Droplets, Bot, Zap, TrendingUp, Clock } from "lucide-react";

interface AirQualityData {
  aqi: number;
  location: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  visibility: number;
  timestamp: string;
  forecast?: {
    next6h: number;
    next12h: number;
    next24h: number;
  };
}

interface AIInsight {
  prediction: string;
  confidence: number;
  recommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface HealthProfile {
  hasAsthma: boolean;
  hasHeartCondition: boolean;
  age: number;
  sensitivityLevel: 'low' | 'medium' | 'high';
}

const AirQualityDashboard = () => {
  const [airQualityData, setAirQualityData] = useState<AirQualityData>({
    aqi: 85,
    location: "New York, NY",
    pm25: 35.2,
    pm10: 45.8,
    o3: 0.089,
    no2: 0.045,
    so2: 0.012,
    co: 1.2,
    temperature: 22,
    humidity: 65,
    pressure: 1013.25,
    windSpeed: 3.2,
    visibility: 10,
    timestamp: new Date().toISOString(),
    forecast: {
      next6h: 88,
      next12h: 92,
      next24h: 78
    }
  });

  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight>({
    prediction: "Air quality is expected to worsen slightly in the next 6 hours due to increased traffic and reduced wind dispersal.",
    confidence: 87,
    recommendation: "Consider postponing outdoor exercise until evening when conditions improve.",
    riskLevel: 'medium'
  });
  
  const [healthProfile] = useState<HealthProfile>({
    hasAsthma: true,
    hasHeartCondition: false,
    age: 35,
    sensitivityLevel: 'medium'
  });

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return { category: "Good", color: "air-excellent", bgColor: "air-excellent-bg" };
    if (aqi <= 100) return { category: "Moderate", color: "air-good", bgColor: "air-good-bg" };
    if (aqi <= 150) return { category: "Unhealthy for Sensitive Groups", color: "air-moderate", bgColor: "air-moderate-bg" };
    if (aqi <= 200) return { category: "Unhealthy", color: "air-unhealthy", bgColor: "air-unhealthy-bg" };
    return { category: "Very Unhealthy", color: "air-hazardous", bgColor: "air-hazardous-bg" };
  };

  const getHealthRecommendation = (aqi: number, profile: HealthProfile) => {
    const { category } = getAQICategory(aqi);
    
    if (category === "Good") {
      return "Air quality is excellent! Perfect for all outdoor activities.";
    }
    
    if (category === "Moderate") {
      return profile.hasAsthma 
        ? "Consider limiting prolonged outdoor activities. Keep rescue inhaler handy."
        : "Air quality is acceptable for most people.";
    }
    
    if (category === "Unhealthy for Sensitive Groups") {
      return profile.hasAsthma || profile.hasHeartCondition
        ? "⚠️ Avoid outdoor activities. Stay indoors with air purification."
        : "Sensitive individuals should limit outdoor exposure.";
    }
    
    return "🚨 Health Alert: Everyone should avoid outdoor activities. Keep windows closed.";
  };

  const handleLocationUpdate = async () => {
    if (!location.trim()) return;
    
    setLoading(true);
    // TODO: When Supabase is connected, this will call real APIs
    setTimeout(() => {
      setAirQualityData(prev => ({
        ...prev,
        location: location,
        aqi: Math.floor(Math.random() * 200) + 10,
        timestamp: new Date().toISOString()
      }));
      setLoading(false);
    }, 1500);
  };

  const aqiInfo = getAQICategory(airQualityData.aqi);
  const healthRec = getHealthRecommendation(airQualityData.aqi, healthProfile);
  const isUnhealthy = airQualityData.aqi > 100;

  return (
    <div className="min-h-screen bg-gradient-bg p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-clean bg-clip-text text-transparent mb-2">
            AirGuard AI
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg px-4">
            AI-Powered Real-time Air Quality Monitoring & Health Alerts
          </p>
        </div>

        {/* Location Search */}
        <div className="flex justify-center mb-6">
          <div className="flex w-full max-w-md gap-2 px-4">
            <Input
              placeholder="Enter your location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-card border-card-border"
              onKeyPress={(e) => e.key === 'Enter' && handleLocationUpdate()}
            />
            <Button 
              variant="default" 
              className="shrink-0" 
              onClick={handleLocationUpdate}
              disabled={loading}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {loading ? 'Loading...' : 'Update'}
            </Button>
          </div>
        </div>

        {/* Main AQI Display - Enhanced Responsive */}
        <Card className="max-w-2xl mx-auto mb-4 sm:mb-6 shadow-elevated bg-gradient-card border-card-border mx-4 sm:mx-auto">
          <CardHeader className="text-center pb-2 px-4 sm:px-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wind className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-lg sm:text-xl text-foreground">{airQualityData.location}</CardTitle>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Last updated: {new Date(airQualityData.timestamp).toLocaleTimeString()}
            </div>
          </CardHeader>
          <CardContent className="text-center px-4 sm:px-6">
            <div className="relative mb-4">
              <div className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-${aqiInfo.color} mb-2`}>
                {airQualityData.aqi}
              </div>
              <Badge 
                className={`bg-${aqiInfo.bgColor} text-${aqiInfo.color} border-${aqiInfo.color}/20 px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium`}
              >
                {aqiInfo.category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Section - NEW */}
        <Card className="max-w-2xl mx-auto mb-4 sm:mb-6 shadow-clean bg-gradient-card border-card-border mx-4 sm:mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              AI Insights & Predictions
              <Badge className="ml-auto bg-accent/10 text-accent border-accent/20 text-xs">
                {aiInsights.confidence}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-primary">AI Prediction</p>
                  <p className="text-xs sm:text-sm text-card-foreground leading-relaxed">
                    {aiInsights.prediction}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 bg-accent/5 rounded-lg border border-accent/10">
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-accent">Smart Recommendation</p>
                  <p className="text-xs sm:text-sm text-card-foreground leading-relaxed">
                    {aiInsights.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Cards - NEW */}
        {airQualityData.forecast && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto mb-4 sm:mb-6 px-4 sm:px-0">
            <Card className="shadow-clean bg-gradient-card border-card-border">
              <CardHeader className="pb-2 px-3 sm:px-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  6h
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4">
                <div className="text-lg sm:text-xl font-bold text-foreground">{airQualityData.forecast.next6h}</div>
                <p className="text-xs text-muted-foreground">AQI</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-clean bg-gradient-card border-card-border">
              <CardHeader className="pb-2 px-3 sm:px-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  12h
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4">
                <div className="text-lg sm:text-xl font-bold text-foreground">{airQualityData.forecast.next12h}</div>
                <p className="text-xs text-muted-foreground">AQI</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-clean bg-gradient-card border-card-border">
              <CardHeader className="pb-2 px-3 sm:px-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  24h
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4">
                <div className="text-lg sm:text-xl font-bold text-foreground">{airQualityData.forecast.next24h}</div>
                <p className="text-xs text-muted-foreground">AQI</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Health Alert */}
        {isUnhealthy && (
          <Alert className="max-w-2xl mx-auto mb-4 sm:mb-6 border-alert bg-alert/5 mx-4 sm:mx-auto">
            <AlertTriangle className="h-4 w-4 text-alert" />
            <AlertDescription className="text-alert-foreground text-sm">
              <strong>Health Alert:</strong> Air quality may be unhealthy for sensitive individuals.
            </AlertDescription>
          </Alert>
        )}

        {/* Personalized Health Recommendations */}
        <Card className="max-w-2xl mx-auto mb-4 sm:mb-6 shadow-clean bg-gradient-card border-card-border mx-4 sm:mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              Personalized Health Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground text-sm sm:text-base leading-relaxed">
              {healthRec}
            </p>
            {healthProfile.hasAsthma && (
              <div className="mt-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                <p className="text-xs sm:text-sm text-warning-foreground font-medium">
                  💨 Asthma Alert: Keep your rescue inhaler accessible
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Responsive Pollutant Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto px-4 lg:px-0">
          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2 px-3 sm:px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">PM2.5</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4">
              <div className="text-xl sm:text-2xl font-bold text-foreground">{airQualityData.pm25}</div>
              <p className="text-xs text-muted-foreground">µg/m³</p>
            </CardContent>
          </Card>

          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2 px-3 sm:px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">PM10</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4">
              <div className="text-xl sm:text-2xl font-bold text-foreground">{airQualityData.pm10}</div>
              <p className="text-xs text-muted-foreground">µg/m³</p>
            </CardContent>
          </Card>

          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2 px-3 sm:px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Thermometer className="h-3 w-3" />
                <span className="hidden sm:inline">Temperature</span>
                <span className="sm:hidden">Temp</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4">
              <div className="text-xl sm:text-2xl font-bold text-foreground">{airQualityData.temperature}°C</div>
              <p className="text-xs text-muted-foreground">Current</p>
            </CardContent>
          </Card>

          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2 px-3 sm:px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                <span className="hidden sm:inline">Humidity</span>
                <span className="sm:hidden">Humid</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4">
              <div className="text-xl sm:text-2xl font-bold text-foreground">{airQualityData.humidity}%</div>
              <p className="text-xs text-muted-foreground">Relative</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Weather Metrics - Enhanced */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mt-4 sm:mt-6 px-4 sm:px-0">
          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2 px-3 sm:px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Wind className="h-3 w-3" />
                Wind
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4">
              <div className="text-lg sm:text-xl font-bold text-foreground">{airQualityData.windSpeed}</div>
              <p className="text-xs text-muted-foreground">m/s</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2 px-3 sm:px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4">
              <div className="text-lg sm:text-xl font-bold text-foreground">{airQualityData.visibility}</div>
              <p className="text-xs text-muted-foreground">km</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-clean bg-gradient-card border-card-border col-span-2 sm:col-span-1">
            <CardHeader className="pb-2 px-3 sm:px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Pressure</CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4">
              <div className="text-lg sm:text-xl font-bold text-foreground">{airQualityData.pressure}</div>
              <p className="text-xs text-muted-foreground">hPa</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Pollutants - Enhanced Responsive */}
        <Card className="max-w-4xl mx-auto mt-4 sm:mt-6 shadow-clean bg-gradient-card border-card-border mx-4 sm:mx-auto">
          <CardHeader>
            <CardTitle className="text-foreground text-base sm:text-lg">Detailed Air Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-base sm:text-lg font-semibold text-foreground">{airQualityData.o3}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">O₃ (ppm)</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-semibold text-foreground">{airQualityData.no2}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">NO₂ (ppm)</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-semibold text-foreground">{airQualityData.so2}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">SO₂ (ppm)</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-semibold text-foreground">{airQualityData.co}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">CO (ppm)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AirQualityDashboard;