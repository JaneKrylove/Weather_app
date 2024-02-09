// компоненты бутстрап
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// кастомные компоненты
import WeatherCard from "components/card/page.tsx";
import SearchBar from "components/searchBar/page.tsx";

import { Metadata } from "next";
import { ReactComponentElement } from "react";

export const metadata: Metadata = {
  title: "new app",
};

const cities = [
  "Moscow",
  "St Petersburg",
  "Rostov-on-Don",
  "Vladivostok",
  "Krasnodar",
  "Yekaterinburg",
];

export default function Page(): ReactComponentElement<any> {
  return (
    <Container>
      <SearchBar />
      <h1>Погода в избранных городах</h1>
      <Row className="gy-4">
        {cities.map((item, index) => (
          <Col
            key={index}
            className="d-flex justify-content-center"
            xs={12}
            md={6}
            lg={4}
          >
            <WeatherCard city={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
