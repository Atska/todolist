module.exports = getDate;

// Function t
function getDate() {
    let today = new Date();
    let options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    return today.toLocaleDateString('en-US', options)
}

