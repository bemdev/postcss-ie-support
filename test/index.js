const fs = require('fs');
const postcss = require('postcss');
const postcssIESupport = require('../index');

async function run() {
    const inputCss = fs.readFileSync('./test/example.css', 'utf8');
    const outputCss = await postcss([postcssIESupport]).process(inputCss, { from: undefined }).then(result => result.css);

    console.log(outputCss);
}

run().catch(error => {
    console.error(error);
});