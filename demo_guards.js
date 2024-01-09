import { createMachine, createActor, fromPromise, assign, setup } from "xstate";
import fs from "fs";

async function get_data() {
    const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const todoList = await data.json();
    return todoList;
}

async function process_data(input) {
    //   console.log("%cdemo_todo_machine.js line:10 input", "color: #007acc;", input);
    //   console.log(
    //     "%cdemo_todo_machine.js line:11 input.todos",
    //     "color: #007acc;",
    //     input.todos,
    //   );
    //   console.log(
    //     "%cdemo_todo_machine.js line:11 input.todos[0]",
    //     "color: #007acc;",
    //     input.todos[0],
    //   );
    return 10;
}

const get_data_src = fromPromise(async ({ input }) => {
    const data = await get_data(input);
    return data;
});

const process_data_src = fromPromise(async ({ input }) => {
    const data = await process_data(input);
    return data;
});

const machine = setup({
    actors: {
        get_data_src,
        process_data_src,
    },
    guards: {
        test_condition: (context, event, params) => {
            console.log("%cdemo_guards.js line:31 test", "color: #007acc;", context);
            return context.a > context.b;
        },
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QTAWwPYH0Au6LoDoBLCAGzAGJZsBDAJ2wG0AGAXUVAAd1Yjsj0AOw4gAHogCMANgkEAzArkAWAKwTmUgBwAmJVIA0IAJ6I5ugpqUB2bQE5tzTVaUTbEgL7vDKDDjyEAMyJBCAACCBpaCnxBMGJBADd0AGs4iRZ2JBBuXn4hEXEEJScLRSspW2YJHTlmJUMTBAkVJQsrFQ03bU05V09vNCxcfAIgkPDImgowOjp0OgJOUkiA+dQCdLYRHL4BYSzC4qtShXLK6u1a+uNTCWPbK3s5FU0VWxVtS-6QHyH-RbmAGM4LAJlEYnFgklUgRtBltjxdvkDognNoCFJMRVmCorBJqjoGohPgRHgTpHopFUZN9fn4RpwgSCwVMZnMFksVmtYfCsjs8vtQIU0RisZVcfjNISbk1yhtMTY3HplNZNLTBvTCIz0MDYKCIuChJDEik4nCJJkuIiBQVUc55HcrHI8biOviiU1tLI3AqHBo5JpbHIpJ4vCBBHg4CI6cN0AjcntbQgALQGGXJmzyKQuIPNL0KuTq3yx4hkMDxpGCsSIJTaD1mFTyay9KRnR4OQthmP-MZhA00Cs2lEIbQvAi2QNU7rvYq9OT15joqpyCej3RSWpBot-BlMvUsweJ4dUuQEYq2KTdJ1OXGaD3NU-qWsqF44pTvzQhrsakts+aH5EhUkdRjjsaQ1GcZhNzvGUFHRMC8TMNwNEcbdNXiQF0FQJYwGwcs+WtI8gKaCQHHHOolDqZpHidKx7zIlxMU-JRbFUZsVDQktMOw8g8IAqtcE4SRWk0Rc9F0NwVBXS4YPIAJsGA8wqWYOpPkoz4cUMAAjdBsFwVBEEvCwxMvFiH3sa46CIKAAAsFM9d8MRU1TdEXBwVEMAB3EhsBsyQHEMGywGsuyaxgwp8SU5za1cjSPJlCQRJMiTzJk0N3CAA */
    id: "demo_todo",

    initial: "idle",
    context: {
        todos: [],
        current_index: 0,
        error: "",
        a: 1,
        b: 2,
    },
    states: {
        idle: {
            on: {
                start: "find data",
            },
        },

        "find data": {
            invoke: {
                src: "get_data_src",
                id: "1",

                onDone: {
                    target: "process data",
                    actions: assign({
                        todos: ({ context, event }) => {
                            return [event.output];
                        },
                    }),
                },

                onError: [
                    {
                        target: "error",
                        actions: assign({
                            error: ({ event }) => {
                                return event.error;
                            },
                        }),
                    },
                ],
            },
        },

        "process data": {
            invoke: {
                src: "process_data_src",
                id: "2",
                onDone: [
                    {
                        target: "complete",
                        guard: function (context, event, params) {
                            console.log(
                                "%cdemo_guards.js line:31 test",
                                "color: #007acc;",
                                context,
                            );
                            // return false;
                            return context.a > context.b;
                        },
                    },
                    "incomplete",
                ],
                input: ({ context }) => context,
                onError: [
                    {
                        target: "error",
                        actions: assign({
                            error: ({ event }) => {
                                return event.error;
                            },
                        }),
                    },
                ],
            },
        },

        error: {},
        incomplete: {},
        complete: {},
    },
});

function main() {
    const textActor = createActor(machine).start();

    textActor.subscribe((state) => {
        console.log(state.value);
        // console.log(state.context);
    });

    textActor.send({ type: "start" });
}

main();
