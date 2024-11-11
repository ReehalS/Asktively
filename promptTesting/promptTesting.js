const {available, defaultTemperature, defaultTopK, maxTopK } = await ai.languageModel.capabilities();
content = `ECS 150: Operating systems
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


types = ["Multiple Choice","True or False", "Fill In the Blanks", "Short Answer"]
typeInstructions = [`Make each option start with the text "OPTION: ". The option itself should be in the same line as this "OPTION: " text. Make four options for each question. Each option should be at most 10 words. The answer for each question should come after all the options. The answer should be the index of the option at which the answer is present.`, `After the "ANSWER: " text, only output TRUE or FALSE in the same line depending on what the answer is.`,`Leave 3 underscores where the student needs to fill in the blank. Do not write the answer in the same line as the question. Each question must have a blank area in it.`,`The minimum answer length should be 20 words and maximum answer length should be 50 words.`]
if (available !== "no") {
  for(i in types){
    const startTime = Date.now();
    const session = await ai.languageModel.create({
      systemPrompt: "Pretend to be a professor that is making sets of questions for the class."
    });
    const sessionCreateTime = Date.now();
    promptString = `Make 10 ${types[i]} type questions. Make each question start with the text "QUESTION" followed by the question number and a colon. The question should be in the same line as "QUESTION" text. Make the Answer for each question start with the text "ANSWER: ". The answer should be in the same line as the "ANSWER: " text. ${typeInstructions[i]} The answer should come directly after the question it is for. Do not output anything except the questions, answers, and options. Always output in English. The content to make questions for starts below:
${content}`;
    const result = await session.prompt(promptString);
    const endTime = Date.now();
    console.log(types[i]);
    console.log(`sessionCreateTime: ${sessionCreateTime-startTime}. promptTime = ${endTime-sessionCreateTime}`)
    console.log(result);
  }
}