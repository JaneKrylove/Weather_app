"use client";

// функции
import { ConvertWeather } from "utils/weatherInterpretation.tsx";
import { ConvertDate } from "utils/dateConverter.tsx";

// хуки
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// компоненты
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Link from "next/link";

type WeatherType = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
};

function WeatherTable(): JSX.Element {
  const searchParams = useSearchParams();

  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${searchParams.get("lat")}&longitude=${searchParams.get("long")}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=GMT`)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data.daily);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Spinner style={{ marginBlock: "20px" }} animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Дата</td>
          {weather &&
            weather.time.map((item, index) => {
              return <td key={index}>{ConvertDate(item)}</td>;
            })}
        </tr>
        <tr>
          <td>Мин. Темп.</td>
          {weather &&
            weather.temperature_2m_min.map((item, index) => {
              return <td key={index}>{item}</td>;
            })}
        </tr>
        <tr>
          <td>Макс. Темп.</td>
          {weather &&
            weather.temperature_2m_max.map((item, index) => {
              return <td key={index}>{item}</td>;
            })}
        </tr>
        <tr>
          <td>Погода</td>
          {weather &&
            weather.weathercode.map((item, index) => {
              return <td key={index}>{ConvertWeather(item)}</td>;
            })}
        </tr>
      </tbody>
    </Table>
  );
}

export default function Prognoz({ params }: { params: { prognoz: string } }): JSX.Element {
  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <Link href={`/`}>Назад</Link>
      <h1>Прогноз для города {params.prognoz.replaceAll("%20", " ")}</h1>
      <WeatherTable />
    </div>
  );
}
