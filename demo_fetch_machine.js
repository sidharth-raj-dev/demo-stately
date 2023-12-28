import { createMachine, createActor, fromPromise, assign } from 'xstate';

const fetchUser = () => {
    return fetch(`https://jsonplaceholder.typicode.com/posts/1`)
        .then(response => response.json());
}


const userMachine = createMachine({
    id: 'user',
    initial: 'idle',
    context: {
        userId: '1',
        user: undefined,
        error: undefined,
    },
    states: {
        idle: {
            on: {
                FETCH: { target: 'loading' },
            },
        },
        loading: {
            invoke: {
                id: 'getUser',
                src: fromPromise(() => fetchUser()),
                onDone: {
                    target: 'success',
                    actions: assign({ user: ({ event }) => event.output }),
                },
                onError: {
                    target: 'failure',
                    actions: assign({ error: ({ event }) => event.error }),
                },
            },
        },
        success: {},
        failure: {
            on: {
                RETRY: { target: 'loading' },
            },
        },
    },
});

const textActor = createActor(userMachine).start();

textActor.subscribe((state) => {
    console.log(state.context);
});

textActor.send({ type: 'FETCH' });