import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ModalPicker({pickedOne}) {
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(Number(event.target.value) || '');
  
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if(age === 1){
        pickedOne(1)
    }else if(age === 2){
        pickedOne(2)
    }else if(age === 3){
        pickedOne(3)
    }else if(age === 4){
        pickedOne(4)
    }


    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const handleBack = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>Select Promotion Style</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose} style={{alignItems:"center"}}>
        <DialogTitle>Promotion Styles</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap'}}>
            <FormControl sx={{ m: 1, minWidth: 120,marginLeft:"auto",marginRight:"auto" }}>
              <InputLabel htmlFor="demo-dialog-native">Item</InputLabel>
              <Select
                native
                value={age}
                onChange={handleChange}
                input={<OutlinedInput label="Age" id="demo-dialog-native" />}
              >
                <option aria-label="None" value="" />
                <option value={1}>Picture With Navigation</option>
                <option value={2}>Video 16:9</option>
                <option value={3}>Video 9:16</option>
                <option value={4}>Description</option>
              </Select>
            </FormControl>
            <div style={{width:1000}}>
                {age === 1 ? (
                <div>
                    <div>
                    <hr style={{marginTop:10}}/>
                    <h1>Picture</h1>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"start",justifyContent:"space-evenly",height:200,marginLeft:80}}>
                        <h5>‧ You can Upload Pictures of your adverted product</h5>
                        <h5>‧ Add the Title of your product</h5>
                        <h5>‧ Navigation Link to open the website when clicked</h5>
                    </div>
                </div>
                ):age === 2 ?(
                    <div>
                    <div>
                    <hr style={{marginTop:10}}/>
                    <h1>Video - 16:9</h1>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"start",justifyContent:"space-evenly",height:200,marginLeft:30}}>
                        <h5>‧ You can Upload a Video That will Play automatically (Aspect Ratio is 16:9 )</h5>
                        <h5>‧ Add the Title of your product</h5>
               
                    </div>
                </div>
                ):age === 3 ?(
                    <div>
                                 <div>
                    <hr style={{marginTop:10}}/>
                    <h1>Video - 9:16</h1>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"start",justifyContent:"space-evenly",height:200,marginLeft:30}}>
                        <h5>‧ You can Upload a Video That will Play automatically (Aspect Ratio is 9:16 )</h5>
                        <h5>‧ Takes Up The Full Width of the Billboard</h5>
               
                    </div>
                    </div>
                ):age === 4 ?(
                    <div>
                                            <div>
                    <hr style={{marginTop:10}}/>
                    <h1>Description</h1>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"start",justifyContent:"space-evenly",height:200,marginLeft:30}}>
                        <h5>‧ You can Describe your product ( price, benefits, important details, extc.)</h5>
                        <h5>‧ Add any Information You would like to show the users</h5>
                  
                    </div>
                    </div>
                ):null}
                
            

                
            
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBack}>Back</Button>
          <Button onClick={handleClose}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}