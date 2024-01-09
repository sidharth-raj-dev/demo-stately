import { createMachine, createActor, fromPromise, assign, setup } from 'xstate'
import fs from 'fs'

async function get_data() {
    const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const todoList = await data.json();
    return todoList;
}

async function process_data(input) {
    console.log('%cdemo_todo_machine.js line:10 input', 'color: #007acc;', input);
    console.log('%cdemo_todo_machine.js line:11 input.todos', 'color: #007acc;', input.todos);
    console.log('%cdemo_todo_machine.js line:11 input.todos[0]', 'color: #007acc;', input.todos[0]);
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
        process_data_src
    }
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QTAWwPYH0Au6LoDoBLCAGzAGJZsBDAJ2wG0AGAXUVAAd1Yjsj0AOw4gAHogC0AFgCMzAgGYAbAE4A7CqVqZAVgBMShXoA0IAJ6S1CgsxUAOFQrt6dqmUqlSAvl9MoMOHiEAGZEghAABBA0tBT4gmDEggBu6ADWiTIs7Egg3Lz8QiLiCBLONnY66rY1egr2phalOlIEnip6zMxKdcxSdjLeviD+WLj4BKHhUTE0FGB0dOh0BJykMcHLqARZbCL5fALCuSUSnXoVVWo1Ksx1DeaICvKdzDoK13LOzLpKPn5oMZBVZLADGcFgM1i8USYVSGQIemy+x4hyKJ0QejUSgI+gUUi6Wns+ncjUkCh0BA0KikPXsKhkGjsnn+I0BgQmnDBEKhcwWSxWaw2W0RyNyB0Kx1AJXUiJkdm0-UqsgJajJCH6BEqdzUtM8SjszJaPmGgjwcBEow56BRBSOxUkOgGWv6KiqLmxMgeTQk7hxUj08p0jJ0LWeutZVvGhBI5FtaKlYkdCmszIc7p0nu9lla+I+egcAwZLgUkfZ0cmYUi0Vo8clDtKeluilUGi0ugMRnVEg0NnpThcbg8QwBAQrXPQ4NgkJrNDr9oxCA+BAZBKbN2xPx03aU8narx6z36gzLY+B-OW8-R0skgcptzknqx7b0JkeCBkelzWlf+I0Ul1Zg7FPIEJlBdBUDWMBsDAK9ExKeocTxAluiZEklG7WQqRUGk6QcRl7BZE0gA */
    id: "demo_todo",

    initial: "idle",
    context: {
        todos: [],
        current_index: 0,
        error: ''
    },
    states: {
        idle: {
            on: {
                start: "find data"
            }
        },

        "find data": {
            invoke: {
                src: 'get_data_src',
                id: '1',

                onDone: {
                    target: "process data",
                    actions: assign({
                        todos: ({ context, event }) => {
                            console.log('%ctasks_level_two.js line:51 event.output', 'color: #007acc;', event.output);
                            return [event.output]
                        },
                    }),
                },

                onError: [
                    {
                        target: "error",
                        actions: assign({
                            error: ({ event }) => {
                                return event.error
                            }
                        })
                    },
                ],
            }
        },

        "process data": {
            invoke: {
                src: 'process_data_src',
                id: '2',
                onDone: "complete",
                input: ({ context }) => (context),
                onError: [
                    {
                        target: "error",
                        actions: assign({
                            error: ({ event }) => {
                                return event.error
                            }
                        })
                    },
                ],
            }
        },

        error: {},
        complete: {}
    }
})

function main() {
    const textActor = createActor(machine).start();

    textActor.subscribe((state) => {
        console.log(state.value);
        console.log(state.context);
    });

    textActor.send({ type: 'start' });
}

main()