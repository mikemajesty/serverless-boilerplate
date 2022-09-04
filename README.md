# AWS Serverless Boilerplate

##### Features

- Docker

- Secrets Service

- Logs Service

  - kibana
  - tracing

- Error Handler

- Libs Structure

- Interface Adapter Pattern

- Tests
  - unit
  - 90% coverage

---

#### Prerequisite

- Node: 14
- Docker
- npm install -g commitizen
- npm install -g changelog

---

#### Instalation

- install monorepo dependencies

  ```bash
  $ yarn install
  ```

---

#### Running local kibana

```bash
$ yarn infra:local
# http://0.0.0.0:5601/app/home to access kibana
```

#### Running the app

- local

  ```bash
  $ yarn debug
  ```

- dev/hml/prd environment

  ```bash
  $ docker-compose up --build
  ```

---

#### Curl Example

```bash
curl --location --request POST 'http://0.0.0.0:3000/dev/hello' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "name": "<name>"
}'
```

---

### App Skeleton

```
├── commitlint.config.js
├── docker-compose-local.yml
├── docker-compose.yml
├── Dockerfile
├── jest.config.js
├── jest.setup.js
├── package.json
├── README.md
├── serverless.ts
├── src
│   ├── functions
│   │   └── http-hello
│   │       ├── handler.ts
│   │       ├── index.ts
│   │       ├── mock.json
│   │       ├── schema.ts
│   │       └── __tests__
│   │           └── handler.spec.ts
│   ├── libs
│   │   ├── aws
│   │   │   ├── lambda
│   │   │   │   ├── adapter.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── service.ts
│   │   │   │   └── __tests__
│   │   │   │       └── service.spec.ts
│   │   │   ├── service.ts
│   │   │   ├── sns
│   │   │   │   ├── adapter.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── service.ts
│   │   │   │   ├── __tests__
│   │   │   │   │   └── service.spec.ts
│   │   │   │   └── types.ts
│   │   │   └── __tests__
│   │   │       └── service.spec.ts
│   │   ├── config
│   │   │   ├── adapter.ts
│   │   │   ├── index.ts
│   │   │   ├── service.ts
│   │   │   ├── __tests__
│   │   │   │   └── service.spec.ts
│   │   │   └── types.ts
│   │   ├── http
│   │   │   ├── adapter.ts
│   │   │   ├── index.ts
│   │   │   ├── service.ts
│   │   │   └── __tests__
│   │   │       └── service.spec.ts
│   │   └── logger
│   │       ├── adapter.ts
│   │       ├── index.ts
│   │       ├── service.ts
│   │       ├── __tests__
│   │       │   └── service.spec.ts
│   │       └── types.ts
│   └── utils
│       ├── exception
│       │   ├── error.ts
│       │   ├── index.ts
│       │   ├── status.ts
│       │   └── __tests__
│       │       └── error.spec.ts
│       ├── lambda
│       │   ├── index.ts
│       │   ├── service.ts
│       │   ├── __tests__
│       │   │   └── service.spec.ts
│       │   └── types.ts
│       ├── middlewares
│       │   ├── adapter.ts
│       │   ├── http-error.ts
│       │   └── __tests__
│       │       └── http-error.spec.ts
│       ├── static
│       │   └── erros.ts
│       ├── test
│       │   ├── index.ts
│       │   └── mock.ts
│       ├── __tests__
│       │   └── validate.spec.ts
│       └── validate.ts
├── tsconfig.json
└── tsconfig.paths.json
```

---

The following is a list of all the people that have contributed Serverless Boilerplate. Thanks for your contributions!

[<img alt="mikemajesty" src="https://avatars1.githubusercontent.com/u/11630212?s=460&v=4&s=117" width="117">](https://github.com/mikemajesty)

## License

It is available under the MIT license.
[License](https://opensource.org/licenses/mit-license.php)
