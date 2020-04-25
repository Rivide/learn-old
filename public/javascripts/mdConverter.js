showdown.setOption('simpleLineBreaks', 'true');
const converter = new showdown.Converter();

$('.md').each(function() {
    const el = $(this);
    el.html(converter.makeHtml(el.html()));
});