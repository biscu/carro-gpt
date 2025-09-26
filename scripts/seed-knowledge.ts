import { createResource } from '@/lib/actions/resources';
import { readFile, readdir } from 'fs/promises';
import path from 'path';

// Directory containing knowledge files
const KNOWLEDGE_DIR = path.join(process.cwd(), 'data');

// Function to split text into chunks (adjust chunk size as needed)
function chunkText(text: string, maxChunkSize = 1000): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split('\n\n'); // Split by double newlines
  
  console.log(`\nTotal paragraphs: ${paragraphs.length}`);
  
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
      console.log(`\n--- Creating new chunk (length: ${currentChunk.length}) ---`);
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
  }
  
  if (currentChunk) {
    console.log(`\n--- Creating final chunk (length: ${currentChunk.length}) ---`);
    chunks.push(currentChunk.trim());
  }
  
  console.log(`\nTotal chunks created: ${chunks.length}`);
  chunks.forEach((chunk, i) => {
    console.log(`Chunk ${i + 1} length: ${chunk.length} characters`);
  });
  
  return chunks;
}

async function seedKnowledge() {
  try {
    // Read all markdown files from the data directory
    const files = (await readdir(KNOWLEDGE_DIR)).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      console.log('No markdown files found in the data directory.');
      return;
    }

    console.log(`Found ${files.length} markdown files to process...`);
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(KNOWLEDGE_DIR, file);
      console.log(`\nProcessing file: ${file}`);
      
      // Read the file content
      const content = await readFile(filePath, 'utf-8');
      console.log(`Original file size: ${content.length} characters`);
      
      // Split into chunks
      const chunks = chunkText(content);
      console.log(`  - Found ${chunks.length} chunks`);
      
      // Add each chunk as a resource with source file reference
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const chunkInfo = `[Source: ${file}, Chunk ${i + 1}/${chunks.length}]\n\n${chunk}\n\nMetadata: { source: ${file}, chunk: ${i + 1}, totalChunks: ${chunks.length} }`;
        
        console.log(`\n--- Adding chunk ${i + 1}/${chunks.length} (${chunk.length} chars) ---`);
        console.log(chunk.substring(0, 100) + '...'); // Show first 100 chars of chunk
        
        await createResource({ 
          content: chunkInfo
        });
      }
      
      console.log(`\n✓ Completed processing ${file}`);
    }
    
    console.log('\n✅ Successfully seeded knowledge base from all markdown files!');
  } catch (error) {
    console.error('Error seeding knowledge base:', error);
    process.exit(1);
  }
}

// Run the script
seedKnowledge();
