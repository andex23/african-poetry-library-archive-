# Ọbá Akwụkwọ

An African writers digital library, presented through a static catalog and a separate reading interface.

[Open the library](https://african-poetry-library-archive.vercel.app)

## Built with

HTML, CSS, and JavaScript, with a Vercel serverless function for retrieving linked PDF files from Google Drive.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Library catalog and interface |
| `reader.html` | Reading interface |
| `api/proxy.js` | PDF retrieval endpoint |
| `vercel.json` | Hosting and function configuration |

## Preview locally

The static catalog can be served without a build step:

```bash
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). The Python server does not run the Vercel API function. Use a Vercel development or deployed environment to test PDF retrieval.

Access to individual documents depends on the linked source files being available and accessible.
