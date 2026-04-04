const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const allFiles = [];

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
                allFiles.push(fullPath);
            }
        }
    });
}
walkDir(srcDir);

let hasErrors = false;

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const importRegex = /import\s+.*?from\s+['"]([\.\/].*?)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        let importPath = match[1];
        
        // Resolve absolute path assuming no alias
        let dir = path.dirname(file);
        let resolvedPath = path.resolve(dir, importPath);
        
        // Vite can import .jsx without extension
        const possiblePaths = [
            resolvedPath,
            resolvedPath + '.jsx',
            resolvedPath + '.js',
            resolvedPath + '.css',
            path.join(resolvedPath, 'index.js'),
            path.join(resolvedPath, 'index.jsx')
        ];

        let found = false;
        for (let p of possiblePaths) {
            if (fs.existsSync(p)) {
                found = true;
                break;
            }
        }

        if (!found) {
            console.error(`Broken Import in ${path.relative(__dirname, file)}:\n  -> ${importPath}`);
            hasErrors = true;
        }
    }
});

if (!hasErrors) {
    console.log("All imports are valid!");
} else {
    process.exit(1);
}
