# Review the Ridgies

- The `stacks/` directory defines our AWS infrastructure using AWS CDK.
- The `backend/` directory contains the Lambda functions that power the CRUD API.
- The `frontend/` directory contains the React app.

It's a single-page React app powered by a serverless CRUD API. We also cover how add user authentication, handle file uploads, and process credit card payments with Stripe.

### Usage

Clone this repo.

```bash
$ git clone https://github.com/kobemaristela/Rate-My-Ridgies.git
```

Install dependencies.

```bash
$ npm install
```

This project refers to a `.env.local` file with a secret that we are not checking in to the repo. Make sure to create one before deploying.

#### Developing Locally

Start the Live Lambda Dev Environment

```bash
$ npx sst start
```

Install dependencies for the frontend React app.

```bash
$ cd frontend
$ npm install
```

Start the React local dev environment from the `frontend/` dir.

```bash
$ npm start
```

#### Running Tests

From the project root.

```bash
$ npm test
```

#### Deploying to Prod

Run this in the project root to deploy it to prod.

```bash
$ npx sst deploy
```

---