jest.setTimeout(5000);


jest.mock('pino-elasticsearch', () => {
  return () => jest.genMockFromModule('pino-elasticsearch')
});

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

jest.mock('uuid', () => ({
  v4: () => '1'
}))

jest.mock('aws-sdk', () => ({
  config: ({
    update: jest.fn()
  }),
  SNS: jest.genMockFromModule('aws-sdk').SNS
}))

jest.spyOn(process, 'cwd').mockReturnValue(null)
jest.spyOn(process, 'exit').mockReturnValue(null)

// ENVS
process.env.NODE_ENV = 'test'
process.env.AWS_REGION = 'region'