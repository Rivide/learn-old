showdown.setOption('simpleLineBreaks', 'true');
const converter = new showdown.Converter({
    extensions: [
        showdownKatex({
            delimiters: [
                { left: "$", right: "$"},
                { left: '\\[', right: '\\]', display: true}
            ]
        })
    ]
});

$('.md').each(function () {
    const el = $(this);
    el.html(converter.makeHtml(el.html()));
});