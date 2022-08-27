jest.setTimeout(5000);



jest.mock('./src/libs/logger/index', () => ({
  LoggerService: ({
    connect: jest.fn(),
    httpLogger: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    fatal: jest.fn(),
    warn: jest.fn(),
    error: (e) => console.error(e)
  }),
}));


process.env.NODE_ENV = 'test'

jest.spyOn(process, 'cwd')
