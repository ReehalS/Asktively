# Asktively
An extension that generates practice questions based on course materials that are locally saved files or within Canvas.


Current Prompt:

Create a set of questions from the following pdf, questions should include:
1. Up to 20 Multiple Choice
2. Up to 20 Fill in the Blanks
3. Up to 20 True/False
4. Up to 20 Short Answer
5. Up to 20 Long Answer
Include the answers as a separate part.
For multiple choice questions, the answer should be which index in the options is the correct answer. For fill in the blanks, the answers should always be a list regardless of how many blanks there are. For all answers, give the answer, as well as a page number for which that the answer is on for reference. The answer and reference should be in the same object as the question. Make the output in a JSON format.

