import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wind, MapPin, AlertTriangle, Heart, Thermometer, Eye, Droplets } from "lucide-react";

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
  timestamp: string;
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
    timestamp: new Date().toISOString()
  });

  const [location, setLocation] = useState("");
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

  const aqiInfo = getAQICategory(airQualityData.aqi);
  const healthRec = getHealthRecommendation(airQualityData.aqi, healthProfile);
  const isUnhealthy = airQualityData.aqi > 100;

  return (
    <div className="min-h-screen bg-gradient-bg p-4 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-clean bg-clip-text text-transparent mb-2">
            AirGuard AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time Air Quality Monitoring & Health Alerts
          </p>
        </div>

        {/* Location Search */}
        <div className="flex justify-center mb-6">
          <div className="flex w-full max-w-md gap-2">
            <Input
              placeholder="Enter your location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-card border-card-border"
            />
            <Button variant="default" className="shrink-0">
              <MapPin className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </div>

        {/* Main AQI Display */}
        <Card className="max-w-2xl mx-auto mb-6 shadow-elevated bg-gradient-card border-card-border">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wind className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl text-foreground">{airQualityData.location}</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(airQualityData.timestamp).toLocaleTimeString()}
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="relative mb-4">
              <div className={`text-6xl font-bold text-${aqiInfo.color} mb-2`}>
                {airQualityData.aqi}
              </div>
              <Badge 
                className={`bg-${aqiInfo.bgColor} text-${aqiInfo.color} border-${aqiInfo.color}/20 px-4 py-1 text-sm font-medium`}
              >
                {aqiInfo.category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Health Alert */}
        {isUnhealthy && (
          <Alert className="max-w-2xl mx-auto mb-6 border-alert bg-alert/5">
            <AlertTriangle className="h-4 w-4 text-alert" />
            <AlertDescription className="text-alert-foreground">
              <strong>Health Alert:</strong> Air quality may be unhealthy for sensitive individuals.
            </AlertDescription>
          </Alert>
        )}

        {/* Personalized Health Recommendations */}
        <Card className="max-w-2xl mx-auto mb-6 shadow-clean bg-gradient-card border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-accent" />
              Personalized Health Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground text-base leading-relaxed">
              {healthRec}
            </p>
            {healthProfile.hasAsthma && (
              <div className="mt-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                <p className="text-sm text-warning-foreground font-medium">
                  💨 Asthma Alert: Keep your rescue inhaler accessible
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Pollutant Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">PM2.5</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{airQualityData.pm25}</div>
              <p className="text-xs text-muted-foreground">µg/m³</p>
            </CardContent>
          </Card>

          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">PM10</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{airQualityData.pm10}</div>
              <p className="text-xs text-muted-foreground">µg/m³</p>
            </CardContent>
          </Card>

          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Thermometer className="h-3 w-3" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{airQualityData.temperature}°C</div>
              <p className="text-xs text-muted-foreground">Current</p>
            </CardContent>
          </Card>

          <Card className="shadow-clean bg-gradient-card border-card-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{airQualityData.humidity}%</div>
              <p className="text-xs text-muted-foreground">Relative</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Pollutants */}
        <Card className="max-w-4xl mx-auto mt-6 shadow-clean bg-gradient-card border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground">Detailed Air Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{airQualityData.o3}</div>
                <div className="text-sm text-muted-foreground">O₃ (ppm)</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{airQualityData.no2}</div>
                <div className="text-sm text-muted-foreground">NO₂ (ppm)</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{airQualityData.so2}</div>
                <div className="text-sm text-muted-foreground">SO₂ (ppm)</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{airQualityData.co}</div>
                <div className="text-sm text-muted-foreground">CO (ppm)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AirQualityDashboard;