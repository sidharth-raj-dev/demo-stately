import { createMachine, createActor, assign } from 'xstate';

export const machine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDMyQEYEMDGBrABMgPYBOAtvgO4CWALgBb5QCumJEAdMeQMSoY5cHWM3Rk6AbQAMAXUSgADkVh1qRAHbyQAD0QBmPQFYOAJgCMANksB2C3oCcZgCxnrAGhABPRGaMd71g6GFoHWZgAcjnoAvtEe-BBYeISkFDQMTKzsXKl8aImCwqLitBJmckggSiq0apqVughOJh7eCOFmHHomJo5O4YaG9sMGsXEg6kQQcFoJSQTcaXSMLGwQWtWqGlqNALQWrYi7xsOnZ+cx43OCKeRUy5lrOeQbylv1oI1mJuEc4RYDKR6Mz2Cw-ZxOQ4IXwWDi+QwuQzWYKueyjK75ea3JYZVbZERiOi1dRQV41Oo7RAWewmfyGKSGExSewM5w0qEwuFGJxSSIWQaGPTIsbRIA */
    id: "feedback form with guard",
    initial: "form",
    states: {
        form: {
            on: {
                "feedback.submit": [
                    {
                        target: "submitting",
                        cond: "feedbackFormGuard",
                    },
                    {
                        target: "form",
                    },
                ]
            },
        },
        submitting: {},
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
},
    {
        actions: {},
        services: {},
        guards: {
            "feedbackFormGuard": function (context, event, params) {
                return false;
            },
        },
        delays: {},
    },
);

const guardMachineDemo = createActor(machine).start();

guardMachineDemo.subscribe((state) => {
    console.log(state.context.value);
});
