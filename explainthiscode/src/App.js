/*global chrome*/
import React, { useEffect, useState } from "react";
import "./App.css";

import { Box, Button, Container, Grid, Paper, TextField } from "@mui/material";

import AutorenewIcon from '@mui/icons-material/Autorenew';

import { Configuration, OpenAIApi } from "openai";

function App() {
  
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("")
  
const configuration = new Configuration({
  apiKey:"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",
});

const openai = new OpenAIApi(configuration);

useEffect(() => {
  try {
    chrome.storage.local.get(null, function (data) {
      if ("prompt" in data) {
        setPrompt(data.prompt);
      }
    });
  } catch (e) {
    console.log("Error due to local state");
  }
}, []);

  
async function handleSubmit() {
  setIsLoading(true);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `I want you to act as a code explainer. Your task is to take a code sample, break it down into simpler parts, and explain each step in detail. Describe what each step does and why, and any concepts that need to be understood. Make sure to explain the problem in a way that can be understood by people with varying levels of coding expertise.: ${prompt}`,
      temperature: 0.7,
      max_tokens: 1250,
    });
    setResponse(completion.data.choices[0].text);
    setIsLoading(false);
  } catch (e) {
    alert("Error: ", e);
    setIsLoading(false);
  }
}
function clearPrompt() {
  setPrompt('');
  chrome.storage.local.set({ prompt: '' });
}
  return (
    <Container>
      <Box sx={{ width: "100%", mt: 4 }}>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              fullWidth
              autoFocus
              label="Explain This Code"
              variant="outlined"
              multiline
              rows={4}
              margin="normal"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value); // Keep
                chrome.storage.local.set({ prompt: e.target.value }); // Add this
              }}
            />
            <Grid item xs={4} />
<Button
 fullWidth
 disableElevation
 variant="contained"
 disabled={isLoading}
 onClick={() => handleSubmit()}
 startIcon={
   isLoading && (
     <AutorenewIcon
       sx={{
         animation: "spin 2s linear infinite",
         "@keyframes spin": {
           "0%": {
             transform: "rotate(360deg)",
           },
           "100%": {
             transform: "rotate(0deg)",
           },
         },
       }}
     />
   )
 }
>
 Explain This Code
</Button>
<Grid item xs={4} />
<Button
 fullWidth
 disableElevation
 variant="contained"
disabled={isLoading}
 onClick={() => clearPrompt()}
>
 Clear Code
</Button>
</Grid>
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Paper sx={{ p: 3 }}>{response}</Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;