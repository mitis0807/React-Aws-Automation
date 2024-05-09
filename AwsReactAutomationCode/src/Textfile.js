import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import AWS from 'aws-sdk';
const axios = require('axios');

const apiUrl = 'https://mws61l1r26.execute-api.us-east-1.amazonaws.com/dev';


AWS.config.update({
  accessKeyId: '', 
  secretAccessKey: '', 
  region: '' 
});
const s3 = new AWS.S3();

function MyForm() {
    const [inputText, setInputText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleTextChange = (e) => {
      setInputText(e.target.value);
    };
    const handleFileChange = (e) => {
        console.log('in handle file change',e)
        setSelectedFile(e.target.files[0]);
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        console.log('in handle submit',selectedFile)
    
        if (selectedFile) {
        
          const params = {
            Bucket: 'fovusassignmentbucket', 
            Key: selectedFile.name,
            Body: selectedFile
          };
          console.log('params',params)
      
          s3.upload(params, (err, data) => {
            if (err) {
              console.error('Error uploading file:', err);
              alert('An error occurred while uploading the file.');
            } else {
              console.log('data.........',data)
            
              const requestData = {
                input_text :inputText,
                input_file_path: `${data.Bucket}/${data.Key}`
              };
           
              const response =  axios.post(apiUrl, requestData);
              console.log('respnse from api call',response)
            
             if(response){
                
                    setStatusMessage(true)
                
             }
                  }
                });
              }
    
        
      };
  return (
    <Box
    sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
    <LockOutlinedIcon />
  </Avatar>
  <Typography component="h1" variant="h5">
    Upload Data
  </Typography>
    <Box component="form"  noValidate sx={{ mt: 1 }} >
    <TextField
      margin="normal"
      required
      fullWidth
      id="textInput"
      label="Text Input"
      name="textInput"
      autoComplete="textInput"
      onChange={handleTextChange}
      value={inputText}
      autoFocus
    />
    <TextField
      margin="normal"
      required
      fullWidth
      name="fileInput"
      label=""
      type="file"
      onChange={handleFileChange}
      id="fileInput"
    />
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      
      onClick={handleSubmit}
    >
     Submit
    </Button>
  {statusMessage===true &&
  <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
 Your data is successfully stored. You can check your process on AWS console.
</Alert>  
}
   
  </Box>
  </Box>

  );
}

export default MyForm;
