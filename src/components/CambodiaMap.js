"use client";

import React, { useState, useEffect } from "react";
import { provinces } from "./provincesData";

const CambodiaMap = ({ onProvinceClick }) => {
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather");
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      }
    };
    fetchWeather();
  }, []);

  const handleMouseEnter = (province, e) => {
    setHoveredProvince(province);
    setTooltipPos({ x: e.pageX + 10, y: e.pageY + 10 });
  };

  const handleMouseMove = (e) =>
    setTooltipPos({ x: e.pageX + 10, y: e.pageY + 10 });
  const handleMouseLeave = () => setHoveredProvince(null);
  const handleProvinceClick = (province) => setSelectedProvince(province);
  const closeModal = () => setSelectedProvince(null);

  const getTempColor = (temp) => {
    if (temp === undefined || temp === "--°C") return "#ccc"; // default gray

    if (temp < 20) return "#CADCFC"; // blue
    if (temp < 23) return "#06b6d4"; // cyan
    if (temp < 26) return "#22c55e"; // green
    if (temp < 29) return "#eab308"; // yellow
    if (temp <= 32) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  return (
    <div>
      <svg
        viewBox="0 0 1000 887"
        className="w-full h-auto max-w-4xl mx-auto drop-shadow-lg"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {provinces.map((province) => {
          const temp = weatherData[province.id]?.temperature;
          return (
            <g
              key={province.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleProvinceClick(province)}
              onMouseEnter={(e) => handleMouseEnter(province, e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <path
                d={province.path}
                fill={getTempColor(temp)}
                stroke="#333"
                strokeWidth="1"
                className="transition-colors duration-300 hover:brightness-110"
              />
              <text
                x={province.cx}
                y={province.cy}
                fontSize="10"
                fill="#1a1a1a"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-medium pointer-events-none"
              >
                {province.name}
              </text>
              <text
                x={province.cx}
                y={province.cy + 15}
                fontSize="13"
                fill="#1a1a1a"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-medium pointer-events-none"
              >
                {temp !== undefined ? `${temp}°C 🌡` : "--°C"}
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredProvince && (
        <div
          className="fixed bg-white p-2 rounded shadow-lg text-sm z-50 pointer-events-none animate-drop-down"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          {hoveredProvince.name}
        </div>
      )}

      {selectedProvince && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-linear-to-r from-gray-500 to-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {selectedProvince.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-white bg-gray-500/80 hover:bg-gray-700/30 px-3 py-1 rounded-full transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {weatherData[selectedProvince.id] ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">🌡</span>
                      <div>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {weatherData[selectedProvince.id].temperature}°C
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Temperature
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">💨</span>
                      <div>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {weatherData[selectedProvince.id].windspeed} m/s
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Wind
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Optional extra info */}
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 text-sm">
                    Live weather data fetched from Open-Meteo API. Hover over
                    other provinces for quick view.
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Loading weather...
                </p>
              )}
            </div>
          </div>

          <style>
            {`
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}
          </style>
        </div>
      )}

      <style>
        {`
          @keyframes drop-down {
            0% { transform: translateY(-10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-drop-down { animation: drop-down 0.1s ease-out forwards; }
        `}
      </style>
    </div>
  );
};

export default CambodiaMap;
