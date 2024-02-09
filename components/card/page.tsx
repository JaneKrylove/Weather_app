"use client";

// стили
import styles from "./style.module.scss";

// компоненты
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

// хуки
import { useState, useEffect } from "react";

// функции
import { ConvertWeather } from "../../utils/weatherInterpretation.tsx";

type cityDataType = {
  temperature: number;
  weathercode: number;
  windspeed: number;
};

function CardText({ city }: { city: string }): JSX.Element {
  const [cityData, setCityData] = useState<cityDataType | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [long, setLong] = useState<number | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
      .then((res) => res.json())
      .then((data) => {
        setLat(data.results[0].latitude);
        setLong(data.results[0].longitude);
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.results[0].latitude}&longitude=${data.results[0].longitude}&current_weather=true&windspeed_unit=ms`);
      })
      .then((res) => res.json())
      .then((data) => {
        setCityData(data.current_weather);
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
    <Card.Text>
      <span className={styles.card__item}>Температура: {cityData?.temperature}</span>
      <span className={styles.card__item}>Состояние: {cityData && ConvertWeather(cityData.weathercode)}</span>
      <span className={styles.card__item}>Скорость ветра: {cityData && cityData.windspeed}</span>
      <Link className={styles.card__button} href={`/${city}?lat=${lat}&long=${long}`}>
        <Button style={{ display: "block" }} variant="primary">
          Смотреть прогноз
        </Button>
      </Link>
    </Card.Text>
  );
}

export default function WeatherCard({ city }: { city: string }): JSX.Element {
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Card.Title>{city}</Card.Title>
        <CardText city={city} />
      </Card.Body>
    </Card>
  );
}
