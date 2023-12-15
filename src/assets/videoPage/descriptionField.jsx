import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DescriptionField = ({
    videoDescription,
    videoViews,
    videoCreatedAt
}) => {
  const [expanded, setExpanded] = React.useState(false);
    const [videoCreatedAtState, setVideoCreatedAtState] = React.useState(null)
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  React.useEffect(() => {
    setVideoCreatedAtState()
  }, [])


  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
            style={{backgroundColor:"#f5f5f5"}}
        >
          <Typography sx={{ width: '33%', flexShrink: 0,fontWeight:600 }}>
           {videoViews} Views
          </Typography>
    
          <Typography sx={{ color: 'text.secondary' }}>
            <div>
            {""} - {`hours ago`}
            </div>
  </Typography>
        </AccordionSummary>
        <hr style={{borderStyle:"groove",marginTop:-4,marginBottom:4}} />
        <AccordionDetails  style={{backgroundColor:"#f5f5f5"}}>
     
          <Typography sx={{whiteSpace:"pre-line"}}>
            {videoDescription}
          </Typography>
        </AccordionDetails>
      </Accordion>
      
    </div>
  );
}

export default DescriptionField