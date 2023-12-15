import * as React from 'react';

import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import DvrIcon from '@mui/icons-material/Dvr';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';


export default function ModeSelect({setAudioOnly}) {
  const [alignment, setAlignment] = React.useState('video');

  const changeTypePag = () =>{
    const PagValue = "audio-only"
    setAlignment(PagValue)
    setAudioOnly(true)
  }
  const changeTypeVideo = () =>{
    const VideoValue = "video"
    setAlignment(VideoValue)
    setAudioOnly(false)
  }

  const theme = createTheme({
    palette: {
      primary:{
        main: '#9effb1',
        light: '#E9DB5D',
        dark: '#A29415',
        contrastText: '#242105',
      } ,
    },
  });

  
  const customStyle = {
    display: 'flex',
    flexDirection: 'column',
  };


  return (
    <ThemeProvider theme={theme}>
    <ToggleButtonGroup
    style={customStyle}
    value={alignment}
    >
      <ToggleButton value="video" color='primary' aria-label="left aligned" onClick={changeTypeVideo}>
        <VideoSettingsIcon />
      </ToggleButton>
      <ToggleButton value="audio-only" color='primary' aria-label="centered" onClick={changeTypePag}>
        <DvrIcon />
      </ToggleButton>
    </ToggleButtonGroup>
    </ThemeProvider>
  );
}