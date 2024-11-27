import React from "react";
import styled from "styled-components";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const flats = [
  {
    id: 1,
    city: "Quito",
    areaSize: "120 m²",
    rentPrice: "$800/month",
    image:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 2,
    city: "Cuenca",
    areaSize: "90 m²",
    rentPrice: "$950/month",
    image:
      "https://images.pexels.com/photos/5524166/pexels-photo-5524166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: 3,
    city: "Guayaquil",
    areaSize: "110 m²",
    rentPrice: "$780/month",
    image:
      "https://images.pexels.com/photos/27638197/pexels-photo-27638197/free-photo-of-fachada-de-vidrio-casa-de-madera-puerta-de-cristal-puerta-de-vidrio.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const FavoriteFlat = () => {
  return (
    <FlatContainer>
      {flats.map((flat) => (
        <StyledCard key={flat.id}>
          <StyledCardMedia image={flat.image} title={flat.city} />
          <Overlay>
            <Typography variant="h6">{flat.city}</Typography>
            <Typography variant="body2">
              {flat.areaSize} - {flat.rentPrice}
            </Typography>
          </Overlay>
        </StyledCard>
      ))}
    </FlatContainer>
  );
};

const FlatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const StyledCard = styled(Card)`
  width: 500px;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
`;

const StyledCardMedia = styled(CardMedia)`
  height: 200px;
`;

const Overlay = styled(CardContent)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.26);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export default FavoriteFlat;
