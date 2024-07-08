# Teacher-student API

This is a NodeJS API Assessment for the following : Teachers need a system where they can perform administrative functions for their students. Teachers and students are identified by their email addresses.

## Outline

Project uses:

* NodeJS,&#x20;
* ExpressJS,&#x20;
* Postgres (with neon.tech),&#x20;
* Drizzle ORM,&#x20;
* Typescript,&#x20;
* and Rollup.&#x20;

The API is hosted using Google Cloud Run. Ci/Cd has been set up with Google Cloud Build.

***

## Hosted URL

> [https://teacher-api-bm244lpjha-as.a.run.app](https://teacher-api-bm244lpjha-as.a.run.app)

## Locally

Clone the repo

> git clone git@github.com\:feedmecoffeepls/teacher-api.git

Rename .env.example to .env.local

> mv .env.example .env.local

Then, copy the provided DATABASE\_URL into the .env.local file.

###### Important

There isn't any other endpoints besides the 4 requested ones. Thus, there is also no way to create a teacher. If using your own DATABASE\_URL, you'll have to manually create those teachers, otherwise a missing teacher error will occur. Students can be created via the /api/register route, but you might need to manually create some students to test for other cases.&#x20;

> npm install

> npm run dev

Alternatively, you may also use docker to build the Dockerfile and run that instead. Make sure to expose port 3000.

## Postman

Postman collection is provided as an exported json within the repository: teacher-student.postman\_collection.json.

## Endpoints

| Endpoint                           | Notes                                                                                                                                                                                                            |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST /api/register                 | If a student does not exist, it will create a student, try to create a completely random student email to test different success response. Returns 207 if some students were already registered - thus, skipped. |
| GET /api/commonstudents            | -                                                                                                                                                                                                                |
| POST /api/suspend                  | -                                                                                                                                                                                                                |
| POST /api/retrievefornotifications | Made some assumptions with the @mentions portion: Returns 207 if the there are valid students but some students were missing.                                                                                    |

######