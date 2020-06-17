const katexExtension = showdownKatex({
    delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$' },
        { left: '\\[', right: '\\]', display: true }
    ]
});

const converter = new showdown.Converter({
    extensions: [
        katexExtension
    ]
});

$('.md').each(function () {
    const el = $(this);

    el.html(katexExtension()[0].filter(el.html()));

    const katexNodes = [];

    el.find('.katex, .katex-display').each(function (i) {
        const katexElement = $(this);
        katexNodes.push(katexElement.html());
        katexElement.html(i);
    });

    el.html(converter.makeHtml(el.html()));

    el.find('.katex, .katex-display').each(function (i) {
        const katexElement = $(this);
        katexElement.html(katexNodes[parseInt(katexElement.html())]);
    });
});