const whitelistedTags = [
    /h[1-6]/,
    /p/
]
function encoded(tag)
{
    if (whitelistedTags.some(whitelistedTag =>
        new RegExp('<\/?' + whitelistedTag.source + '>').test(tag))) {
        return tag;
    }
    return tag.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
module.exports = function(html) {
    return html.replace(/<[\w!?\/].*?>/g, encoded);
}
