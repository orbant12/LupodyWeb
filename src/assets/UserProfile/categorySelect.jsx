import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function CategorySelect({passCategory}) {
  const [category, setCategory] = React.useState('');

  const handleChange = (event) => {
    setCategory(event.target.value);
    passCategory(event.target.value)
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          label="Category"
          onChange={handleChange}
        >
          <MenuItem value={"Sports"}>Sports</MenuItem>
          <MenuItem value={"Health"}>Health</MenuItem>
          <MenuItem value={"Mental"}>Mental</MenuItem>
          <MenuItem value={"Just Talk"}>Just Talk</MenuItem>
          <MenuItem value={"Comedy"}>Comedy</MenuItem>
          <MenuItem value={"Tech"}>Tech</MenuItem>
          <MenuItem value={"Gaming"}>Gaming</MenuItem>
          <MenuItem value={"Business"}>Business</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}