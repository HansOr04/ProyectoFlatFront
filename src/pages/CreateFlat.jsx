import React, { useState } from "react";
import {
  Container,
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AirIcon from "@mui/icons-material/Air";

const PageContainer = styled(Container)`
  padding: 2rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
`;

const FormPaper = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled(Typography)`
  color: #1a237e;
  margin-bottom: 2rem;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: #1a237e;
    border-radius: 2px;
  }
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.01);
    }

    &.Mui-focused {
      & fieldset {
        border-color: #1a237e;
      }
    }
  }
`;

const ImageUploadBox = styled(Box)`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem 0;

  &:hover {
    border-color: #1a237e;
    background: rgba(26, 35, 126, 0.02);
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(45deg, #1a237e 30%, #3949ab 90%);
  border-radius: 8px;
  padding: 1rem 2rem;
  color: white;
  font-weight: 600;
  text-transform: none;
  margin-top: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #0d1642 30%, #1a237e 90%);
    box-shadow: 0 4px 16px rgba(26, 35, 126, 0.3);
  }
`;

const StyledCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: #1a237e;
  }
`;

const CreateFlat = () => {
  const [formData, setFormData] = useState({
    city: "",
    streetName: "",
    streetNumber: "",
    areaSize: "",
    hasAC: false,
    yearBuilt: "",
    rentPrice: "",
    dateAvailable: "",
    images: [null, null, null, null, null],
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const index = parseInt(name.split("-")[1], 10);
      const newImages = [...formData.images];
      newImages[index] = files[0];
      setFormData({
        ...formData,
        images: newImages,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.images.some((image) => image === null)) {
      newErrors.images = "You must upload exactly 5 images.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file, index) => {
          formDataToSend.append(`images[${index}]   `, file); // Fixed the template literal syntax
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/flats",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("✨ Flat created successfully!");
    } catch (error) {
      setMessage("❌ Error creating flat.");
    }
  };

  return (
    <PageContainer maxWidth="md">
      <FormPaper component="form" onSubmit={handleSubmit}>
        <FormTitle variant="h4" component="h1">
          Create New Flat
        </FormTitle>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Street Name"
              name="streetName"
              value={formData.streetName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Street Number"
              name="streetNumber"
              value={formData.streetNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Area Size (sq ft)"
              name="areaSize"
              type="number"
              value={formData.areaSize}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <StyledCheckbox
                  name="hasAC"
                  checked={formData.hasAC}
                  onChange={handleChange}
                  icon={<AirIcon />}
                  checkedIcon={<AirIcon />}
                />
              }
              label="Air Conditioning Available"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Year Built"
              name="yearBuilt"
              type="number"
              value={formData.yearBuilt}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledTextField
              label="Rent Price ($)"
              name="rentPrice"
              type="number"
              value={formData.rentPrice}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <StyledTextField
              label="Date Available"
              name="dateAvailable"
              type="date"
              value={formData.dateAvailable}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="subtitle1" color="textSecondary">
                Property Images
              </Typography>
            </Divider>
          </Grid>

          {[...Array(5)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ImageUploadBox>
                <input
                  type="file"
                  name={`image-${index}`}
                  onChange={handleChange}
                  accept="image/*"
                  style={{ display: "none" }}
                  id={`image-upload-${index}`}
                />
                <label htmlFor={`image-upload-${index}`}>
                  <IconButton component="span">
                    <CloudUploadIcon fontSize="large" color="primary" />
                  </IconButton>
                  <Typography variant="body2" color="textSecondary">
                    {`formData.images[index]
                      ? formData.images[index].name
                      : Upload Image ${index + 1}`}
                  </Typography>
                </label>
              </ImageUploadBox>
            </Grid>
          ))}

          {errors.images && (
            <Grid item xs={12}>
              <Typography variant="body2" color="error" align="center">
                {errors.images}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <SubmitButton
              type="submit"
              variant="contained"
              fullWidth
              disableElevation
            >
              Create Flat Listing
            </SubmitButton>
          </Grid>

          {message && (
            <Grid item xs={12}>
              <Typography
                variant="body1"
                align="center"
                color={message.includes("successfully") ? "primary" : "error"}
                sx={{ mt: 2 }}
              >
                {message}
              </Typography>
            </Grid>
          )}
        </Grid>
      </FormPaper>
    </PageContainer>
  );
};

export default CreateFlat;
