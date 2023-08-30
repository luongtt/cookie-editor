chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'editCookies') {
        const cookies = request.cookies;

        const cookiePromises = cookies.map(cookie => {
            if (cookie["name"].startsWith('_')) {
                return true;
            }

            let domain = cookie["domain"].replace(/^\./, "")
            let ckFormat = {
                'url': "http" + ((cookie["secure"]) ? "s" : "") + "://" + domain + cookie["path"],
                "domain": domain,
                "name": cookie["name"],
                "value": cookie["value"],
                "path": cookie["path"]
            }

            return new Promise(resolve => {
                chrome.cookies.set(ckFormat, function (updatedCookie) {
                    if (updatedCookie) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        });

        Promise.all(cookiePromises).then(results => {
            const success = results.every(result => result);
            sendResponse({success: success});
        });

        return true;
    } else if (request.action === "getFilter") {
        chrome.cookies.getAll({}, function (cookies) {
            const filteredCookies = cookies.filter(cookie => {
                const cookieDomain = cookie.domain.replace(/^\./, '');
                return request.domains.includes(cookieDomain);
            });

            sendResponse({cookies: filteredCookies});
        })
        return true;
    }
});
