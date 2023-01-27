import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import tw from 'twrnc';
import * as Location from 'expo-location';
import { WEATHER_URL, WEAHTER_API_KEY, ICON_URL } from '@env';

const Weather = () => {
  const [weather, setWeather] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.log('許可がないため位置情報を取得することはできません。');
          return;
        }

        let location = await Location.getCurrentPositionAsync();

        const { latitude, longitude } = location.coords;

        const response = await fetch(
          `${WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${WEAHTER_API_KEY}` + "&units=metric"
        );

        const result = await response.json();

        console.log(result)
        setLoading(false);
        setWeather(result);
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    getLocation();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text>Loaindg...</Text>
      </View>
    );
  }
  return (
    <View style={tw`flex-1 items-center justify-center bg-blue-100`}>
  {weather ? (
    <>
      <Image
        source = {{ uri: `${ICON_URL}/${weather.weather[0].icon}.png` }}
        style = {tw`w-32 h-32`}
      />
      <Text style = {tw`text-2xl font-bold`}>{weather.name}</Text>
      <Text style = {tw`text-6xl font-bold mt-4 mb-2`}>
        {Math.floor(weather.main.temp)}°
      </Text>
      <Text style = {tw`text-xl font-bold`}>{weather.weather[0].main}</Text>
      <View style = {tw`flex flex-row items-center mt-4`}>
        <Text style = {tw`text-lg font-bold`}>
          最高気温:{Math.floor(weather.main.temp_max)}°
        </Text>
        <Text style = {tw`text-lg font-bold ml-1`}>
          最低気温:{Math.floor(weather.main.temp_min)}°
        </Text>
      </View>
    </>
  ) : (
    <Text>天気情報が取得できませんでした。</Text>
  )}
</View>
  );
};

export default Weather;