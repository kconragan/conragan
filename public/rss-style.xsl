<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  >

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          body {
            font-family: sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 1em;
          }
          h1 {
            font-size: 1.8em;
            margin-bottom: 0.5em;
          }
          h2 {
            font-size: 1.8em;
            margin-top: 1em;
            margin-bottom: 0.5em;
            border-bottom: 1px solid #ccc;
            padding-bottom: 0.25em;
          }
          .item {
            margin-bottom: 2em;
          }
          .date {
            font-size: 0.8em;
            color: #666;
          }
          .description {
            margin-top: 0.5em;
          }
          .markdown-body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-size: 16px;
            line-height: 1.5;
            word-wrap: break-word;
          }

          .container-md {
            border-top: 4px solid #ffb3c6;
            background: #ffe5ec;
            padding: 16px;
            margin: 48px -16px;
            font-size: smaller;
          }
        </style>
      </head>
      <body class="markdown-body">
        <nav class="container-md px-3 py-2 mt-2 mt-md-5 mb-5 markdown-body">
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
          <p class="bg-yellow-light ml-n1 px-1 py-1 mb-1">
            <strong>This is a web feed.</strong> Subscribe by copying the URL from the address bar into your newsreader.
          </p>
          <p>A few feed readers to get you started</p>
          <ul>
            <li><a href="https://feedly.com/">Feedly</a> - free up to 100 subscriptions. Web/Android/iOS.</li>
            <li><a href="https://www.inoreader.com/">InoReader</a> - free up to 150 subscriptions. Web/Android/iOS.</li>
            <li><a href="https://netnewswire.com/">NetNewsWire</a> - free. iOS/Mac.</li>
            <li><a href="https://theoldreader.com/">The Old Reader</a> - free/ad-supported up to 100 subscriptions. Web and apps for many platforms</li>
            <li><a href="https://freshrss.org/">FreshRSS</a> - a free, self-hostable feed aggregator</li>
          </ul>
          <p>If you are new to Feeds,read <a href="https://gilest.org/rss-feels.html">What using RSS feeds feels like</a> by Giles Turnbull for an overview of why they are a wonderful part of the Internet.</p>
          <p>Feeds are free.</p>
        </nav>

        <h2>Recent posts</h2>
        <xsl:for-each select="/rss/channel/item">
          <div class="item">
            <h3>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="link"/>
                </xsl:attribute>
                <xsl:value-of select="title"/>
              </a>
            </h3>
            <p class="date">
              Published: <xsl:value-of select="pubDate"/>
            </p>
            <div class="description">
              <xsl:value-of select="description"/>
            </div>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
