import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AddToFavoritesButton from '@/components/favorites/AddToFavoritesButton';
import Container from '@/components/ui/Container';
import LoadingState from '@/components/ui/LoadingState';
import Section from '@/components/ui/Section';
import SearchSection from '@/components/weather/SearchSection';
import TemperatureDisplay from '@/components/weather/TemperatureDisplay';
import WeatherDescription from '@/components/weather/WeatherDescription';
import WeatherIcon from '@/components/weather/WeatherIcon';
import { useWeather } from '@/context/WeatherContext';
import { useFavorites } from '@/hooks/useFavorites';
import { LocationResult } from '@/hooks/useLocation';

// Fonds météo
const fondDefault = require('../../assets/images/fond.jpg');
const fondSoleil = require('../../assets/images/soleil.jpg');
const fondPluie = require('../../assets/images/pluie.jpg');
const fondNeige = require('../../assets/images/neige.jpg');
const fondNuage = require('../../assets/images/nuage.jpg');

export default function HomeScreen() {
  const {
    weatherData,
    setWeatherData,
    cityName,
    setCityName,
    setcurrentLocation,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useWeather();

  const { addCurrentLocation, isCurrentLocationInFavorites } = useFavorites();

  const handleAddToFavorites = async () => {
    await addCurrentLocation();
  };

  const handleLocationFound = async (location: LocationResult, name: string) => {
    setIsLoading(true);
    setError(null);
    setCityName(name);
    setcurrentLocation(location);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&daily=sunrise,sunset,weathercode,temperature_2m_max,temperature_2m_min&hourly=relative_humidity_2m&timezone=auto&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();

      if (!data.current_weather) {
        throw new Error('Données météo actuelles non disponibles');
      }

      setWeatherData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Impossible de récupérer la météo: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Fonction pour choisir le fond selon le weatherCode
  const getBackgroundImage = (weatherCode?: number) => {
    if (!weatherCode) return fondDefault;

    if ([0, 1].includes(weatherCode)) return fondSoleil; // ciel clair
    if ([2, 3].includes(weatherCode)) return fondNuage;  // nuageux
    if (weatherCode >= 45 && weatherCode <= 67) return fondPluie; // pluie / bruine
    if (weatherCode >= 71 && weatherCode <= 77) return fondNeige; // neige
    if (weatherCode >= 80 && weatherCode <= 82) return fondPluie; // averses
    if (weatherCode >= 95) return fondPluie; // orages

    return fondDefault;
  };

  // Formater les heures du lever et coucher du soleil
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sunrise = formatTime(weatherData?.daily?.sunrise?.[0]);
  const sunset = formatTime(weatherData?.daily?.sunset?.[0]);

  return (
    <Container backgroundImage={getBackgroundImage(weatherData?.current_weather?.weathercode)}>
      {/* Section météo principale */}
      <Section style={{ flex: 3, paddingBottom: 16 }}>
        {isLoading ? (
          <LoadingState message="Chargement..." />
        ) : weatherData ? (
          <>
            <TemperatureDisplay
              temperature={weatherData.current_weather.temperature}
              city={cityName}
            />
            <WeatherIcon
              weatherCode={weatherData.current_weather.weathercode}
              size="medium"
            />
            <WeatherDescription
              weatherCode={weatherData.current_weather.weathercode}
            />

            {/* Lever et coucher du soleil */}
            {sunrise && sunset && (
              <View style={styles.sunContainer}>
                <View style={styles.sunItem}>
                  <Text style={styles.sunEmoji}>🌅</Text>
                  <Text style={styles.sunText}>{sunrise}</Text>
                </View>
                <View style={styles.sunItem}>
                  <Text style={styles.sunEmoji}>🌇</Text>
                  <Text style={styles.sunText}>{sunset}</Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <LoadingState message="Recherchez une ville ou utilisez votre position" />
        )}

        {error && (
          <Text style={{ color: '#ff6b6b', textAlign: 'center', marginTop: 16 }}>
            {error}
          </Text>
        )}
      </Section>

      {/* Section barre de recherche avec marge séparatrice */}
      <Section style={{ flex: 2, marginTop: 16 }}>
        <SearchSection onLocationFound={handleLocationFound} onError={handleError} />
      </Section>

      {/* Section favoris */}
      <Section style={{ flex: 1, marginTop: 16 }}>
        {weatherData && (
          <AddToFavoritesButton
            onPress={handleAddToFavorites}
            isInFavorites={isCurrentLocationInFavorites}
          />
        )}
      </Section>
    </Container>
  );
}

const styles = StyleSheet.create({
  sunContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sunEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  sunText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});
