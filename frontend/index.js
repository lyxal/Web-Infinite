export function fetchWebsite(url) {
    return fetch("https://web-infinite.lyxal.workers.dev/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: url
            })
        }
    )
}
