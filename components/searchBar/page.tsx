"use client";

// компоненты бутстрап
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

// хуки
import { useState } from "react";

type cityDataType = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
};

export default function SearchBar(): JSX.Element {
  const [options, setOptions] = useState<cityDataType[]>([]);

  function HandleChange(data: { results: cityDataType[] }): void {
    if (data.results === undefined) {
      setOptions([]);
      return;
    }
    setOptions(data.results.slice(0));
  }

  return (
    <div style={{ marginBlock: "20px" }}>
      <Form.Control
        type="text"
        placeholder="Введите город"
        onChange={(e) => {
          if (e.target.value == "") return;
          fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${e.target.value}`
          )
            .then((res) => res.json())
            .then((data) => {
              HandleChange(data);
            })
            .catch((err) => console.log(err));
        }}
      />
      <ListGroup>
        {options.map((option) => {
          return (
            <ListGroup.Item
              action
              href={`/${option.name}?lat=${option.latitude}&long=${option.longitude}`}
              key={option.id}
            >
              {option.name}, {option.country}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}
