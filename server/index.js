export default {
    async fetch(request, env) {

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            "Access-Control-Max-Age": "86400",
            'Access-Control-Allow-Headers': '*',
        }

        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders
            });
        }

        let url = "";
        let description = "";
        let css = "";
        if (request.method === 'GET') {
            const urlParams = new URLSearchParams(request.url.split('?')[1]);
            url = urlParams.get('url') || '';
            description = urlParams.get('description') || '';
            css = urlParams.get('css') || '';
        } else if (request.method === 'POST') {
            const body = await request.json();
            url = body.url || '';
            description = body.description || '';
            css = body.css || '';
        }

        if (!url) {
            return new Response('URL is required', {
                status: 400
            });
        }

        const SYSTEM_PROMPT = `You are the backend for a website. When given a URL, you are to render the HTML, CSS and JavaScript for that route. Sometimes you'll also be given pre-existing CSS styling to use, as well as a description of the site. But if not provided, create your own CSS.
You've got full creative control, and you're able to put anything on the page you want. Include only the HTML and CSS. Do not include any other text or explanations. Make sure to make the website interactive, using <script> tags where needed. Also, feel free to include links to other sites.
Include your CSS in a <style> tag in the <head> of the HTML. Make sure to respond with the full HTML document, including the <html>, <head>, and <body> tags. Do not include the \`\`\`html part.
`

        const USER_PROMPT = `
URL: ${url}
${description ? `Description: ${description}` : ''}
${css ? `CSS: ${css}` : ''}
`

        const chat = {
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: USER_PROMPT }
            ],
            "max_tokens": 1024,
        };
        const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', chat);

        return new Response(response.response, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'text/plain'
            }
        });
    }
};