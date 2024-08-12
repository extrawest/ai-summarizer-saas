import type { NextApiResponse } from "next"
import { ChatGroq } from "@langchain/groq";
import { NextResponse } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";

type ResponseData = {
  message: string
};

function isYouTubeLink(url: string) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
}
 
export async function POST(
  req: Request,
  res: NextApiResponse<ResponseData>
) {
	const { link, apiKey: groqApiKey } = await req.json();

  const llmSummary = new ChatGroq({
    apiKey: groqApiKey,
    temperature: .1,
  });

  let docs;

  if (isYouTubeLink(link)) {
    const youtTubeLoader = YoutubeLoader.createFromUrl(link, {
      language: "en",
      addVideoInfo: true,
    });
    
    docs = await youtTubeLoader.load();
  } else {
    const playwrightLoader = new PlaywrightWebBaseLoader(link, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
    });

    docs = await playwrightLoader.load();
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splits = await textSplitter.splitDocuments(docs);

  const vectorstore = await MemoryVectorStore.fromDocuments(
    splits,
    new OpenAIEmbeddings()
  );

  const retriever = vectorstore.asRetriever({ verbose: true });

  const summaryTemplate = `
    You are an expert in summarizing content from various sources, including YouTube videos and web pages.
    Your goal is to create a summary of the provided content.
    Below you find the content (transcript of a video or content of a web page):
    --------
    {context}
    --------
    The result should be a summary, highlighting the main themes and details presented in the content.
    SUMMARY:
  `;

  const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(
    summaryTemplate,
  );

  const combineDocsChain = await createStuffDocumentsChain({
    llm: llmSummary,
    prompt: SUMMARY_REFINE_PROMPT,
  });

  const retrievalChain = await createRetrievalChain({
    retriever,
    combineDocsChain: combineDocsChain,
  });

  const summary = await retrievalChain.invoke({
    input: "Provide a detailed summary from this resource.",
  });
  
  console.log("SUMMARY:", summary.answer);
   
  return NextResponse.json({ message: summary.answer}, { status: 200 })
};