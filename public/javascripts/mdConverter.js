showdown.setOption('simpleLineBreaks', 'true');

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
    el.html(converter.makeHtml(el.html()));
});