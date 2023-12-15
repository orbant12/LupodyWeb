import * as React from 'react';
import { styled } from '@mui/material/styles';

import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});


export default function CustomizedRating({setRatingValuePass,defaultValuePass}) {

  const handleRatingChange = (event) => {
   setRatingValuePass(event.target.value);

  };

  return (

  
      <StyledRating 
        name="customized-color"
        onChange={handleRatingChange}
        defaultValue={0}
        value={defaultValuePass}
        getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
        precision={0.5}
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
   
      />

 
  );
}