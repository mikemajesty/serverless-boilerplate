jest.setTimeout(5000);



jest.mock('./src/libs/logger/index', () => ({
  LoggerService: ({
    connect: jest.fn(),
    httpLogger: jest.fn(),
    info: jest.fn(),
    fatal: jest.fn(),
    warn: jest.fn(),
    // error: (e) => console.log(e)
    error: jest.fn(),
  }),
}));


process.env.NODE_ENV = 'test'

jest.spyOn(process, 'cwd')
