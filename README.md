# Candidate Analyzer

## Description

Candidate Analyzer is a Node.js server using tRPC to analyze two PDF files:

- **A job description**
- **A candidate's CV**

The server processes the files, extracts their content, and sends it to the **Gemini 1.5 Flash AI API**. The AI evaluates the candidate's strengths and weaknesses and compares them with the job description to determine the candidate's suitability.

---

## Features

- Accepts two PDF files as input:
  - **cv** — Candidate's CV
  - **jobDescription** — Job description
- Extracts content from PDFs using `pdf-parse`.
- Sends data to an Gemini API for evaluation.
- Returns structured **JSON** with candidate analysis.

---

## Requirements

- **Node.js** >= 18.0.0
- **pnpm** >= 9.11.0
- **API Key** for the external AI service (Gemini 1.5 Flash)
- **Postman** _(optional for manual testing)_

---

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a .env file in the root directory and configure the following **.env.example** file

---

## Running the Project

### Development Mode

Start the server:

```bash
pnpm run server:dev
```

Run the client:

```bash
pnpm run client:dev
```

### Production Mode

Build the project:

```bash
pnpm run build
```

Start the server:

```bash
pnpm run server
```

Run the client:

```bash
pnpm run client
```

## Testing the API

### 1. Using Postman

- _Endpoint_: **http://localhost:3301** **(default port)**
- _Method_: **POST**
- _Content-Type_: **multipart/form-data**
- _Body_:

| Key              | Value                 | Description              |
| ---------------- | --------------------- | ------------------------ |
| `cv`             | `cv.pdf`              | Candidate's CV PDF file  |
| `jobDescription` | `job-description.pdf` | Job description PDF file |

### 2. Using the Client Script

- Run the client script to upload example PDFs from the content folder:

```bash
pnpm run client:dev
```

Example PDFs are located in the content folder:

- cv.pdf — Example candidate CV
- job-description.pdf — Example job description
