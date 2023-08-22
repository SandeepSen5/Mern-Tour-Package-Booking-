import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

export default function DiscreteSlider({ onPriceChange }) {

  const handleChange = (event) => {
    onPriceChange(event.target.value);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label="Temperature"
        defaultValue={20000}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={1000}
        marks
        min={15000}
        max={65000}
        onChange={handleChange}
      />

    </Box>
  );
}