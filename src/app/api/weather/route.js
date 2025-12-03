import { provinces } from "@/components/provincesData";
import { getWeatherUrl } from "@/lib/utils";

export async function GET() {
  const results = await Promise.all(
    provinces.map(async (province) => {
      try {
        const res = await fetch(getWeatherUrl(province.lat, province.lon));
        const data = await res.json();
        return [
          province.id,
          data.current_weather ?? { temperature: "N/A", windspeed: "N/A" },
        ];
      } catch {
        return [province.id, { temperature: "N/A", windspeed: "N/A" }];
      }
    })
  );

  const weatherMap = Object.fromEntries(results);
  return new Response(JSON.stringify(weatherMap), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
