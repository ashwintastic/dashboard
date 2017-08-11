# dashboard
UI for configuring accounts, bots and flows.

## Build
Developers (in the dev machine before committing any changes),

>* When you start a task run **"yarn run build"** at the beginning to pull down the latest modules. This will update the yarn.lock file (if changes are present) and guarantee your dev and dev testing is done with those versions.
>* During the development run **"yarn run build:prod"** to build.
>* Run one last **"yarn run build:prod"** before commit since this is what the production release script will run.

Production Build (in the build server),

	yarn run build-prod
>This will create a release build using the yarn lock file. The generated build can be zipped and deployed.

## Deploy

## Run
    yarn run start
It will upgrade the modules and start the server.
