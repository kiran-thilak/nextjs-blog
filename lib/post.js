import fs from "fs";
import matter from "gray-matter";
import path from "path";
import remark from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.flatMap((fileName) => {
    // to get id
    const id = fileName.replace(/\.md$/, "");

    // read file as string
    const fullpath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullpath, "utf8");

    // usegm to parse
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames.map(fileName => {
        return {
          params: {
            id: fileName.replace(/\.md$/, '')
          }
        }
      })
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
  
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // Combine the data with the id
    return {
      id,
      contentHtml,
      ...matterResult.data
    }
  }