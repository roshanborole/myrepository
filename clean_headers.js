const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/app', function(filePath) {
  if (filePath.endsWith('page.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove <header ... > ... </header>
    // Since some files have it on one line and some on multiple, we can use a regex that matches across newlines
    // Or just simple string manipulation.
    const headerStart = content.indexOf('<header');
    if (headerStart !== -1) {
        const headerEnd = content.indexOf('</header>', headerStart);
        if (headerEnd !== -1) {
            content = content.substring(0, headerStart) + content.substring(headerEnd + 9);
        }
    }
    
    const footerStart = content.indexOf('<footer');
    if (footerStart !== -1) {
        const footerEnd = content.indexOf('</footer>', footerStart);
        if (footerEnd !== -1) {
            content = content.substring(0, footerStart) + content.substring(footerEnd + 9);
        }
    }

    if (content !== original) {
        // Also remove pt-20 from main if it exists right after header, to restore normal padding if needed, 
        // wait, layout has Header, so main SHOULD have pt-20. We already set pt-20 on Home.
        // Actually, layout.tsx DOES NOT have a <main> wrapper. The pages themselves have <main>. 
        // We can leave <main className="w-full pt-20 ..."> as is, because the global Header is h-20.
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Cleaned:', filePath);
    }
  }
});
