import { createMachine } from "xstate";

export const machine = createMachine(
    {
        context: {
            folderName: "dsalgo solved",
            questionURLs: [],
            solvedQuestions: [],
            suggestedQuestions: [],
        },
        id: "dsalgo_teacher",
        initial: "Idle",
        states: {
            "Idle": {
                description: "The machine is idle, waiting to be started.",
                on: {
                    start: {
                        target: "Reading local files",
                    },
                },
            },
            "Reading local files": {
                description: "The machine is reading local files to find the folder named dsalgo solved.",
                invoke: {
                    src: "readLocalFiles",
                    onDone: [
                        {
                            target: "Reading file names",
                            actions: {
                                type: "setSolvedQuestions",
                            },
                        },
                    ],
                    onError: [
                        {
                            target: "Failure",
                        },
                    ],
                },
            },
            "Reading file names": {
                description: "The machine is reading all the file names from the dsalgo solved folder.",
                invoke: {
                    src: "readFileNames",
                    onDone: [
                        {
                            target: "Sending to OpenAI",
                            actions: {
                                type: "setSolvedQuestions",
                            },
                        },
                    ],
                    onError: [
                        {
                            target: "Failure",
                        },
                    ],
                },
            },
            "Failure": {
                description: "The machine has encountered an error and is in the failure state.",
                type: "final",
            },
            "Sending to OpenAI": {
                description:
                    "The machine sends the solved questions to the OpenAI service to ask for suggestions on which more questions to solve.",
                invoke: {
                    src: "sendToOpenAI",
                    onDone: [
                        {
                            target: "Receiving suggestions",
                            actions: {
                                type: "setSuggestedQuestions",
                            },
                        },
                    ],
                    onError: [
                        {
                            target: "Failure",
                        },
                    ],
                },
            },
            "Receiving suggestions": {
                description: "The machine is receiving all the suggestions from the OpenAI service.",
                on: {
                    success: {
                        target: "Finding LeetCode URLs",
                    },
                },
            },
            "Finding LeetCode URLs": {
                description: "The machine finds the LeetCode URLs of the suggested questions.",
                invoke: {
                    src: "findLeetCodeURLs",
                    onDone: [
                        {
                            target: "Generating component",
                            actions: {
                                type: "setQuestionURLs",
                            },
                        },
                    ],
                    onError: [
                        {
                            target: "Failure",
                        },
                    ],
                },
            },
            "Generating component": {
                description:
                    "The machine generates a component with all the LeetCode URLs of the suggested questions.",
                on: {
                    success: {
                        target: "Showing URLs",
                    },
                },
            },
            "Showing URLs": {
                description: "The machine shows the URLs to the user.",
                type: "final",
            },
        },
        predictableActionArguments: true,
        preserveActionOrder: true,
    },
    {
        actions: {
            setSolvedQuestions: (context, event) => { },
            setSuggestedQuestions: (context, event) => { },
            setQuestionURLs: (context, event) => { },
        },
        services: {
            readLocalFiles: createMachine({
                /* ... */
            }),
            readFileNames: createMachine({
                /* ... */
            }),
            sendToOpenAI: createMachine({
                /* ... */
            }),
            findLeetCodeURLs: createMachine({
                /* ... */
            }),
        },
        guards: {},
        delays: {},
    },
);
