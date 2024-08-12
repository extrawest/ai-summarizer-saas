# Content Summarization API

This is a Next.js API route that summarizes content from YouTube videos and web pages using LangChain and OpenAI embeddings. The API accepts a URL and generates a concise summary of the content, which is particularly useful for quickly understanding large bodies of text or video transcripts.

## Demo


https://github.com/user-attachments/assets/76ad016a-3cfa-4566-b4ba-70b215e813b6


## Features

- **YouTube Video Summarization**: Extracts and summarizes transcripts from YouTube videos.
- **Web Page Summarization**: Extracts and summarizes content from web pages using Playwright.
- **OpenAI Integration**: Uses OpenAI embeddings to vectorize content for retrieval and summarization.
- **Flexible Content Handling**: Automatically detects whether the provided link is a YouTube video or a standard web page.

## Tech Stack

- **LangChain**: Used for creating retrieval and summarization chains.
- **Next.js**: The framework used for building the API.
- **React**: Used for building any front-end components or pages.
- **Playwright**: Used for web scraping to load and extract content from web pages.
- **axios**: Used for making HTTP requests within the application.
- **Tailwind CSS**: Used for styling front-end components with utility-first CSS.


## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **API Key**: Obtain an API key from OpenAI to use for embeddings and language model processing.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
	 ```
2. Install dependencies:
	```
	npm install
	```
3. Set up environment variables:
	```
	OPENAI_API_KEY=your_openai_api_key
	```
## Usage

1. Start the Next.js development server:
```
npm run dev
```

This will start the application on http://localhost:3000.

2. Groq API Key: You will need to enter your Groq API key in the provided input field on the UI to generate content summaries.

3. Use the provided UI to input the link of a YouTube video or a web page and obtain a summarized version of the content.
