const articleFormHTML = $('#article-form').html();
const ul = $('#article-list');
let ulLength = ul.children().length;

$('#append-button').on('click', function() {
    const li = $('<li></li>');
    li.html(articleFormHTML);

    if (ulLength) {
        li.find('.field').each(function() {
            const field = $(this);
            field.attr('name', increment(field.attr('name'), ulLength));
        });
    }
    ul.append(li);

    ulLength++;
});
function increment(fieldName, num) {
    return fieldName.replace(/[0-9]*$/, num);
}