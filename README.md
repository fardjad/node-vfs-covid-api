# VFS COVID API

> A RESTful API to get VFS visa application centers' info

## Synopsis

As far as I know, VFS Global does not provide a public API to check/filter the [COVID-19 page data](https://www.vfsglobal.com/en/individuals/covid-19-customer-advisories.html).

This simple application fetches the [JS file that is imported on the "COVID-19: CUSTOMER ADVISORIES" page](https://www.vfsglobal.com/en/assets/js/script.min.js), parses it, extracts the data, and exposes it via a RESTful API.

## What can I do with this?

Given you have an inquiry about VFS Global visa application centers, it can answer questions such as:

1. I'm currently residing in **Albania** can I get a visa to visit **Canada**? ([`/api/vfs-application-centers?from=albania&to=canada`](https://vfs-covid-api.now.sh/api/vfs-application-centers?from=albania&to=canada))

2. From which countries can I get a visa to visit **Australia**? ([`/api/vfs-application-centers?to=australia`](https://vfs-covid-api.now.sh/api/vfs-application-centers?to=australia))

3. Which visa application centers are currently **Open** and can process my application to visit **Germany**. ([`/vfs-application-centers?to=germany&toast_message=open`](https://vfs-covid-api.now.sh/api/vfs-application-centers?to=germany&toast_message=open))

For more info, have a look the API [documentation](https://vfs-covid-api.now.sh/api).

## Web Front-end

A web frontend is available at ([`/`](https://vfs-covid-api.now.sh/))

## Running the server

```bash
git clone https://github.com/fardjad/node-vfs-covid-api
cd node-vfs-covid-api
npm install
npm start
```

_Note: You'll need Node.js v12+ to run the server._

### Configurable environment variables

| Variable                        | Description                                                   | Default Value                                        |
| ------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| HOST                            | Host address for the http server to listen on                 | 0.0.0.0                                              |
| PORT                            | Port for the http server to listen on                         | 3000                                                 |
| WORKER_THREADS_COUNT            | Number of worker threads for ESTree Parser and Code Generator | Number of CPUs                                       |
| VFS_SCRIPT_URL                  | URL of VFS Global script.min.js file                          | https://www.vfsglobal.com/en/assets/js/script.min.js |
| VFS_DATA_CACHE_DURATION_SECONDS | Number of seconds to cache the processed VFS data             | 300                                                  |

## License

[MIT](https://opensource.org/licenses/MIT)
