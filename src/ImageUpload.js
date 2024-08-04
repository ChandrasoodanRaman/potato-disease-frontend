import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Typography, Avatar, Container, Card, CardContent, CardActionArea, CardMedia, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import Dropzone from 'react-dropzone';
import axios from 'axios';

// Styled components
const AppBarStyled = styled(AppBar)(({ theme }) => ({
  background: '#be6a77',
  boxShadow: 'none',
  color: 'white',
}));

const CardStyled = styled(Card)(({ theme }) => ({
  margin: 'auto',
  maxWidth: 400,
  height: 500,
  backgroundColor: 'transparent',
  boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%)',
  borderRadius: '15px',
}));

const DropzoneStyled = styled('div')(({ theme }) => ({
  border: '2px dashed #ccc',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
}));

const LoaderStyled = styled(CircularProgress)(({ theme }) => ({
  color: '#be6a77 !important',
}));

const ClearButtonStyled = styled(Button)(({ theme }) => ({
  width: '100%',
  borderRadius: '15px',
  padding: '15px 22px',
  color: '#000000a6',
  fontSize: '20px',
  fontWeight: 900,
}));

export const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let confidence = 0;
  console.log("API URL:", process.env.REACT_APP_API_URL); // Add this line for debugging

  const sendFile = async () => {
    if (selectedFile) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      setIsLoading(true);
      try {
        const res = await axios.post('http://localhost:8000/predict', formData);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error during file upload:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  

  const clearData = () => {
    setData(null);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      sendFile();
      return () => URL.revokeObjectURL(objectUrl); // Clean up
    }
  }, [selectedFile]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBarStyled position="static">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Potato Disease Classification
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Avatar src="" /> {/* Add your logo or icon here if needed */}
        </Toolbar>
      </AppBarStyled>
      <Container maxWidth={false} disableGutters>
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2} style={{ height: '93vh', marginTop: '8px' }}>
          <Grid item xs={12}>
            <CardStyled>
              {preview ? (
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="400"
                    image={preview}
                    alt="Preview"
                  />
                </CardActionArea>
              ) : (
                <CardContent>
                  <DropzoneStyled>
                    <Dropzone onDrop={onDrop} accept="image/*">
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop an image here, or click to select one</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </DropzoneStyled>
                </CardContent>
              )}
              {data && (
                <CardContent>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="details">
                      <TableHead>
                        <TableRow>
                          <TableCell>Label:</TableCell>
                          <TableCell align="right">Confidence:</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{data.class}</TableCell>
                          <TableCell align="right">{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}
              {isLoading && (
                <CardContent>
                  <LoaderStyled />
                  <Typography variant="h6" noWrap>
                    Processing
                  </Typography>
                </CardContent>
              )}
            </CardStyled>
          </Grid>
          {data && (
            <Grid item xs={12}>
              <ClearButtonStyled variant="contained" color="primary" onClick={clearData} startIcon={<ClearIcon />}>
                Clear
              </ClearButtonStyled>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
