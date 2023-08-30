chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'editCookies') {
        const cookies = request.cookies;

        const cookiePromises = cookies.map(cookie => {
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

        return true; // Needed to keep the message channel open for sendResponse
    }
});
