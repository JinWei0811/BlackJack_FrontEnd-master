export const config = {
  url: 'ws://localhost:8080/api',
  method: {
    create: 'create',
    join: 'join',
  },
  response: {
    connect: 'response.connect',
    create: 'response.create',
    join: 'response.join',
    leave: 'response.leave',
    ready: 'response.ready',
    start: 'response.start',
  },
};
