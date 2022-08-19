import {
   Dialog, 
   DialogActions,
   DialogContent,
   DialogTitle,
   Button,
} from '@mui/material';

const DialogAlert = ({ open, title, content, buttonText, buttonAction }) => {
   return (  
      <Dialog open={ open }>
         <DialogTitle>{ title }</DialogTitle>
         <DialogContent>{ content }</DialogContent>
         <DialogActions sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button variant='outlined' onClick={ buttonAction }>{ buttonText }</Button>
         </DialogActions>
      </Dialog>
   );
}
 
export default DialogAlert;