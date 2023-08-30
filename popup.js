document.addEventListener('DOMContentLoaded', function () {
    const editCookieButton = document.getElementById('editCookie');
    const getFilterButton = document.getElementById('getFilter');
    const messageLog = document.getElementById('msg');

    editCookieButton.addEventListener('click', function () {
        const cookieJson = document.getElementById('cookieJson').value;
        try {
            const cookies = JSON.parse(cookieJson);
            chrome.runtime.sendMessage({action: 'editCookies', cookies: cookies}, function (response) {
                if (response.success) {
                    messageLog.innerText = 'Cookies edited successfully.'
                } else {
                    messageLog.innerText = 'Error editing cookies.'
                }
            });
        } catch (error) {
            messageLog.innerText = 'Invalid JSON format.'
        }
    });
    getFilterButton.addEventListener('click', function () {
        const domains = document.getElementById('cookieDomains').value;
        const domainArray = domains.split(',').map(domain => domain.trim());
        const rsJson = document.getElementById('rsFilterCookie');
        chrome.runtime.sendMessage({action: 'getFilter', domains: domainArray}, function (response) {
            rsJson.value = JSON.stringify(response.cookies);
        });
    });
});