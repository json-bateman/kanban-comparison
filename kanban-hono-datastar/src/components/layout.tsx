export function BasePage({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  const isDev = process.env.BUN_ENV !== "production";

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/static/style.css" rel="stylesheet" />
        <link href="/static/favicon.png" rel="icon" type="image/png" />
        <title>{title}</title>
        <script type="module" src="/static/datastar.js"></script>
      </head>
      <body>
        {children}
        {isDev && (
          <div
            id="hotreload"
            data-init="@get('/hotreload', {retryMaxCount: 1000, retryInterval: 20, retryMaxWaitMs: 200})"
          />
        )}
      </body>
    </html>
  );
}
