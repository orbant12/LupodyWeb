import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function PartnerShipInfo() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} style={{minWidth:1,width:30,height:30,borderRadius:"100%"}}>
        ?
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
   
      >
        <DialogTitle id="alert-dialog-title">
          {"What is Clippify?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Clippify is an extension that allows you to clip and save any audio you want from any podcast you want. You can make Notes & Tags for each clip you make and save them in your own personal library. You can use Ai to Analize the Video and ask Ai whatever you want about the video. You can also share your clips with your friends and family or the Echo's community and creator.
          </DialogContentText>
        </DialogContent>
        <DialogTitle id="alert-dialog-title">
          {"Important To Know !"}
        </DialogTitle>
        <DialogContent style={{height:300}}>
          <DialogContentText id="alert-dialog-description">
          ‧ If you have an Echo Account you can Login to Clippify with the same credentials (email and password).
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
          ‧ You need to Log In Once and then you can use Clippify without having to Log In again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Back
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}