document.addEventListener('DOMContentLoaded', function () {
    const editCookieButton = document.getElementById('editCookie');
    const editCookieStrButton = document.getElementById('editCookieStr');
    const getFilterButton = document.getElementById('getFilter');
    const rsJson = document.getElementById('rsFilterCookie');
    const messageLog = document.getElementById('msg');
    const messageStrLog = document.getElementById('msgStr');

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
    editCookieStrButton.addEventListener('click', function () {
        const cookieStr = document.getElementById('cookieStr').value;
        const cookieStrDomain = document.getElementById('cookieStrDomain').value;
        const cookieJson = cookiesStr2Obj(cookieStr, cookieStrDomain)
        try {
            chrome.runtime.sendMessage({action: 'editCookies', cookies: cookieJson}, function (response) {
                if (response.success) {
                    messageStrLog.innerText = 'Cookies edited successfully.'
                } else {
                    messageStrLog.innerText = 'Error editing cookies.'
                }
            });
        } catch (error) {
            messageStrLog.innerText = 'Invalid JSON format.'
        }
    });
    getFilterButton.addEventListener('click', function () {
        const domains = document.getElementById('cookieDomains').value;
        const domainArray = domains.split(',').map(domain => domain.trim());
        chrome.runtime.sendMessage({action: 'getFilter', domains: domainArray}, function (response) {
            rsJson.value = JSON.stringify(response.cookies);
        });
    });
});

function cookiesStr2Obj(ckStr, domain) {
    let cks = ckStr.split(";")
    let cookies = []

    cks.forEach(ck => {
        let [ckKey, ckValue] = ck.split("=")
        let cookie = {
            "domain": domain,
            "name": ckKey.trim(),
            "path": "/",
            "secure": true,
            "session": true,
            "value": ckValue.trim()
        }
        cookies.push(cookie)
    })
    return cookies
}