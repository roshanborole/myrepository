const fs = require('fs');
const https = require('https');
const path = require('path');

const pages = [
  {
    name: 'matches',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YThlNGE5YjQ4YTMwNTAzZDA0ZDhlMTQ1MmQxEgsSBxDj7eyi6gcYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDE2NzMxNDgyMDMwMzkzNDc4MQ&filename=&opi=89354086',
    outFile: 'src/app/matches/page.tsx'
  },
  {
    name: 'videos',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YThlNGFjNmQ5NzUwNjM5NDU5NGEyMTdhZThjEgsSBxDj7eyi6gcYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDE2NzMxNDgyMDMwMzkzNDc4MQ&filename=&opi=89354086',
    outFile: 'src/app/videos/page.tsx'
  },
  {
    name: 'stadium',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWExOGM1ZTRmOWIwNTIyYTEwODg3MDJkNzdmEgsSBxDj7eyi6gcYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDE2NzMxNDgyMDMwMzkzNDc4MQ&filename=&opi=89354086',
    outFile: 'src/app/stadium/page.tsx'
  },
  {
    name: 'rankings',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YThlNGFhYWQ3YjYwNjM5NDU5NGEyMTdhZThjEgsSBxDj7eyi6gcYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDE2NzMxNDgyMDMwMzkzNDc4MQ&filename=&opi=89354086',
    outFile: 'src/app/rankings/page.tsx'
  },
  {
    name: 'tickets',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YThlNGEyZTNkMjUwODlhZjdlOWU4MTljZjYwEgsSBxDj7eyi6gcYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDE2NzMxNDgyMDMwMzkzNDc4MQ&filename=&opi=89354086',
    outFile: 'src/app/tickets/page.tsx'
  },
  {
    name: 'news',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YThlNGE4YjMwN2EwMzgzOGM0NjVkMTlkZTRlEgsSBxDj7eyi6gcYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDE2NzMxNDgyMDMwMzkzNDc4MQ&filename=&opi=89354086',
    outFile: 'src/app/news/page.tsx'
  }
];

function convertHtmlToJsx(html) {
  // Extract content between <body> and </body>
  let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Very naive HTML to JSX conversion
  let jsx = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip inline scripts
    .replace(/class=/g, 'className=')
    .replace(/<!--/g, '{/*')
    .replace(/-->/g, '*/}')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/<img([^>]+)>/g, (m, p) => p.endsWith('/') ? m : `<img${p} />`)
    .replace(/<input([^>]+)>/g, (m, p) => p.endsWith('/') ? m : `<input${p} />`)
    .replace(/<hr([^>]+)>/g, (m, p) => p.endsWith('/') ? m : `<hr${p} />`)
    .replace(/<br>/g, '<br />')
    // Fix string styles to standard jsx format or just remove them to avoid compilation errors 
    // since they usually are width: 100% or background-image which can be done via tailwind
    .replace(/style="([^"]+)"/g, (m, p) => {
        // Very basic inline style to object converter just to avoid syntax errors
        const styleObj = p.split(';').filter(Boolean).map(s => {
            let [k, v] = s.split(':');
            if(!k || !v) return '';
            k = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            return `${k}: "${v.trim().replace(/"/g, "'")}"`;
        }).filter(Boolean).join(', ');
        return `style={{ ${styleObj} }}`;
    });

  return `import Link from 'next/link';\n\nexport default function Page() {\n  return (\n    <>\n      ${jsx}\n    </>\n  );\n}\n`;
}

async function run() {
  for (const page of pages) {
    console.log(`Downloading ${page.name}...`);
    const data = await new Promise((resolve, reject) => {
      https.get(page.url, (res) => {
        let chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        res.on('error', reject);
      });
    });

    console.log(`Converting ${page.name}...`);
    const jsx = convertHtmlToJsx(data);
    
    const outPath = path.join(__dirname, page.outFile);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, jsx, 'utf8');
    console.log(`Saved ${outPath}`);
  }
}

run().catch(console.error);
