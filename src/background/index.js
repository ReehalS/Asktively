
const content = `ECS 150: Operating systems
Process APIs
Administrative
Late policy on projects: 2 days (48 hours)
Project 1 due on Monday
Project 2 out on Monday, due in two weeks
(wrapping up last lecture) System call implementation
Process APIs to manage processes
In class today we’ll go over fork, exec, and wait
In discussion on Friday, the TAs will cover pipe, and dup2
You’ll use all of these in project 2 when you create your own shell
Key concepts
• Processes can create processes, modern computer systems
have 100s of processes at any given time
• Processes have an hierarchy defined by a parent / child
relationship between the process that creates a new one and
the new process.
• Processes are (mostly) isolated from one another
• The OS provides system calls (the Process API) to interact with
other processes through these well-defined interfaces
Conceptual fork: Processes have a kernel data
structure to keep track of metadata for the proc.
Kernel
User
Bash
PID: 123
Parent: 121
Page table
fds
…
registers
If Bash calls “fork” it creates a new process that
starts as a copy of the original process
Kernel
User
Bash
PID: 123
Parent: 121
Page table
fds
…
registers
Bash
PID: 124
Parent: 123
Page table
fds
…
registers
If the new process calls “exec” it replaces the
program but the process remains the same
Kernel
User
Bash
PID: 123
Parent: 121
Page table
fds
…
registers
dish
PID: 124
Parent: 123
Page table
fds
…
registers
If dish calls “fork” it creates another new process
Kernel
User
Bash
PID: 123
Parent: 121
Page table
fds
…
registers
dish
PID: 124
Parent: 123
Page table
fds
…
registers
dish
PID: 125
Parent: 124
Page table
fds
…
registers
And another (both children)
Kernel
User
Bash
PID: 123
Parent: 121
Page table
fds
…
registers
dish
PID: 124
Parent: 123
Page table
fds
…
registers
dish
PID: 125
Parent: 124
Page table
fds
…
registers
dish
PID: 126
Parent: 124
Page table
fds
…
registers
Before “exec” replaces the program on one of them
with “ls”
Kernel
User
Bash
PID: 123
Parent: 121
Page table
fds
…
registers
dish
PID: 124
Parent: 123
Page table
fds
…
registers
dish
PID: 125
Parent: 124
Page table
fds
…
registers
ls
PID: 126
Parent: 124
Page table
fds
…
registers
Important takeaways
• Fork creates new processes, which start off as a copy
• After the fork call, the two processes will deviate and run
independently
• Processes maintain a hierarchy where the process that calls
fork is the parent of the process that the system creates
• Exec keeps the same process but replaces the program
File descriptors are copied from parent to child, but can reference
the same underlying object (e.g., the same file)
Let’s see it in action!`


const types = ["Multiple Choice", "True or False", "Fill In the Blanks", "Short Answer"];
const typeInstructions1 = [
  `Make each option start with the text "OPTION: ". The option itself should be in the same line as this "OPTION: " text. Make four options for each question. The answer should be the index of the option at which the answer is present. This is a sample output:
QUESTION 1: What is the purpose of the "fork" system call in an operating system?
OPTION: 1. It replaces the current program with a new one.
OPTION: 2. It creates a new process as a copy of the current process.
OPTION: 3. It creates a process that is isolated from the current process.
OPTION: 4. It allows processes to communicate with each other.
ANSWER: 2`,
  `After the "ANSWER: " text, only output TRUE or FALSE in the same line depending on what the answer is. This is a sample output:
QUESTION 1: The system creates 120 processes when the user opens the command line.
ANSWER: TRUE`,
  `Leave 3 underscores where the student needs to fill in the blank. Do not write the answer in the same line as the question. Each question must have a blank area in it. This is a sample output:
QUESTION 1: The ___ system call creates a new process as a copy of the current process.
ANSWER: fork`,
  `The minimum answer length should be 20 words and maximum answer length should be 50 words. This is a sample output:
QUESTION 1: What is the main function of the fork system call?
ANSWER: It creates a new process as a copy of the calling process.`
];

const typeInstructions2 = [
    `Make four options for each question. Each option should start with the text "OPTION: ". The answer should be the index of the option at which the answer is present. The answer should come after all the options have been listed. Here is a sample output:
QUESTION 1: This is the first question?
OPTION: 1. This is the first option.
OPTION: 2. This is the second option.
OPTION: 3. This is the third option.
OPTION: 4. This is the fourth option.
ANSWER: 2.\n`,
    `After the "ANSWER: " text, output "TRUE" or "FALSE" in the same line depending on what the answer is. The answer should only be "TRUE" or "FALSE". Do not make questions that are short answer or fill in the blanks questions.`,
    `Leave 3 underscores where the blank portion of the question is. Do not write the answer in the same line as the question. There must be exactly one blank per question.`,
    `The minimum answer length for short answer questions should be 20 words.`
  ];

const typeInstructions= typeInstructions2;

chrome.runtime.onInstalled.addListener(async () => {
    const { available } = await ai.languageModel.capabilities();
    const parsedData = {
        "Multiple Choice": [],
        "True or False": [],
        "Fill In the Blanks": [],
        "Short Answer": []
    };
    function parseResponse(text, type) {

        const questionTypes = {
            //"Multiple Choice": /QUESTION\s*\d+:\s*(.*?)\s*OPTION:\s*[0-1A]\s*(.*?)\s*OPTION:\s*[1-2B]\s*(.*?)\s*OPTION:\s*[2-3C]\s*(.*?)\s*OPTION:\s*[3-4D]\s*(.*?)\s*ANSWER:\s*([0-4A-D])/gs,
            "Multiple Choice": /QUESTION\s*\d+:\s*(.*?)\s*OPTION:\s*[0-1A]\.?\s*(.*?)\s*OPTION:\s*[1-2B]\.?\s*(.*?)\s*OPTION:\s*[2-3C]\.?\s*(.*?)\s*OPTION:\s*[3-4D]\.?\s*(.*?)\s*ANSWER:\s*([1-4A-D])/gis,
            "True or False": /QUESTION\s*\d+:\s*(.*?)\.?\s*ANSWER:\s*(TRUE|FALSE)\.?(\s*(?:\n\s*)*)/gis,
            "Fill In the Blanks": /QUESTION\s*\d+:\s*(.*?)\s*ANSWER:\s*([^\n]*)/gis,
            "Short Answer": /QUESTION\s*\d+:\s*(.*?)\s*ANSWER:\s*([^\n]*)/gis,
            "True or False Short Answer": /QUESTION\s*\d+:\s*(.*?)\.?\s*ANSWER:\s*((?!TRUE|FALSE)*)\.?\s*(?:\n\s*)*/gis
        };
        
        if (type === "Multiple Choice") {
            const matches = text.matchAll(questionTypes["Multiple Choice"]);
            for (const match of matches) {
                const question = match[1].trim();
                const options = [match[2].trim(), match[3].trim(), match[4].trim(), match[5].trim()];
                const answer = "1234ABCD".indexOf(match[6].trim()) % 4;
                parsedData["Multiple Choice"].push({ question, options, answer });
            }
        } else if (type === "True or False") {
            const matches = text.matchAll(questionTypes["True or False"]);
            for (const match of matches) {
                const question = match[1].trim();
                const answer = match[2].toLowerCase() === "true";
                parsedData["True or False"].push({ question, answer });
            }
            const shortAnsMatches = text.matchAll(questionTypes["True or False Short Answer"]);
            for (const match of shortAnsMatches) {
                const question = match[1].trim();
                const answer = match[2].trim();
                parsedData["Short Answer"].push({ question, answer });
            }
        } else if (type === "Fill In the Blanks") {
            const matches = text.matchAll(questionTypes["Fill In the Blanks"]);
            for (const match of matches) {
                //console.log(match);
                parsedData["Fill In the Blanks"].push({
                    question: match[1].trim(),
                    answer: match[2].trim()
                });
            }
        } else if (type === "Short Answer") {
            const matches = text.matchAll(questionTypes["Short Answer"]);
            for (const match of matches) {
                //console.log(match)
                parsedData["Short Answer"].push({
                    question: match[1].trim(),
                    answer: match[2].trim()
                });
            }
        }
        return parsedData[type];
    }

    if (available !== "no") {
        for (let i = 0; i < types.length; i++) {
            const promptString = `Make 10 ${types[i]} type questions. Make each question start with the text "QUESTION" followed by the question number and a colon. The question should be in the same line as "QUESTION" text. Make the Answer for each question start with the text "ANSWER: ". The answer should be in the same line as the "ANSWER: " text. ${typeInstructions[i]} The answer should come after the question and all the options for that question. Do not output anything except the questions, answers, and options. Always output in English. The content to make questions for starts below:
${content}`;
            const startTime = Date.now();
            const session = await ai.languageModel.create({
                systemPrompt: "Pretend to be a professor that is creating a question bank for a class."
            });
            const sessionCreateTime = Date.now();
            try {
                const result = await session.prompt(promptString);

                const endTime = Date.now();
                console.log(types[i]);
                console.log(`sessionCreateTime = ${sessionCreateTime - startTime}. promptTime = ${endTime - sessionCreateTime}`);
                console.log(result);
                // Parse result and send structured data to frontend
                if(result.length>0){
                    const parsedOutput = parseResponse(result, types[i]);
                    console.log(parsedOutput);
                    chrome.runtime.sendMessage({ type: types[i], output: parsedOutput });
                } else{
                    i--;
                }
                
            } catch (error) {
                console.error('Error fetching from AI model:', error);
            }
        }
    }
});



/* THINGS TO KEEP THE SAME

const types = ["Multiple Choice", "True or False", "Fill In the Blanks", "Short Answer"];
const typeInstructions = [
    `Make each option start with the text "OPTION: ". The option itself should be in the same line as this "OPTION: " text. Make four options for each question. Each option should be at most 10 words. The answer for each question should come after all the options. The answer should be the index of the option at which the answer is present.`,
    `After the "ANSWER: " text, only output TRUE or FALSE in the same line depending on what the answer is.`,
    `Leave 3 underscores where the student needs to fill in the blank. Do not write the answer in the same line as the question. Each question must have a blank area in it.`,
    `The minimum answer length should be 20 words and maximum answer length should be 50 words.`
];

const promptString = `Make 10 ${types[i]} type questions. Make each question start with the text "QUESTION" followed by the question number and a colon. The question should be in the same line as "QUESTION" text. Make the Answer for each question start with the text "ANSWER: ". The answer should be in the same line as the "ANSWER: " text. ${typeInstructions[i]} The answer should come directly after the question it is for. Do not output anything except the questions, answers, and options. Always output in English. The content to make questions for starts below:
${content}`;

*/