# Asktively
An extension that generates practice questions based on course materials that are locally saved files or within Canvas.

## Contributing To The Project
This project uses Manifest (version 3), React.js and Webpack.

### Run Extension Locally:
- Use the terminal to run `npm i` when you first clone this repository.
- Use the terminal to run `npm run build` to update `dist` with your changes.
- Navigate to `chrome://extensions` on Google Chrome.
- Click on `Load unpacked` button and select the `dist` folder of this repository.
- Pin the `Asktively` extension and use on locally stored files.

### Folder Structure:
- `dist`: build output
- `src` : source code
    - `background`: service-worker scripts
    - `content`: content scripts
    - `react/components`: UI for the extension popup and side panel

## Current Prompt:
Create a set of questions from the following pdf, questions should include:
1. 10 Multiple Choice
2. 10 Fill in the Blanks
3. 10 True/False
4. 10 Short Answer
Include the answers as a separate part.
For multiple choice questions, the answer should be which index in the options is the correct answer. For fill in the blanks, the answers should always be a list regardless of how many blanks there are. For all answers, give the answer, as well as a page number for which that the answer is on for reference. The answer and reference should be in the same object as the question. Make the output in a JSON format.
