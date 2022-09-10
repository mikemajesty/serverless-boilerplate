jest.setTimeout(5000);
process.setMaxListeners(0)

jest.mock('pino-elasticsearch', () => {
  return () => jest.genMockFromModule('pino-elasticsearch')
});

jest.mock('./src/libs/logger', () => ({
  LoggerService: jest.fn(() => ({
    httpLogger: jest.fn(),
    info: jest.fn(),
    debug: (m) => console.log(m),
    trace: jest.fn(),
    fatal: jest.fn(),
    warn: jest.fn(),
    error: jest.fn() // hide console error. to enable => error: (e) => console.error(e)
  }))
}));

jest.mock('uuid', () => ({
  v4: () => '1'
}))

jest.mock('aws-sdk', () => ({
  config: ({
    update: jest.fn()
  }),
  SNS: jest.fn(() => jest.fn()),
  Lambda: jest.fn(() => jest.fn())
}))

jest.spyOn(process, 'cwd').mockReturnValue(null)
jest.spyOn(process, 'exit').mockReturnValue(null)

// ENVS
process.env.NODE_ENV = 'test'
process.env.AWS_REGION = 'dummy'
process.env.ELK_URL = 'dummy'
process.env.AWS_ENDPOINT = 'dummy'