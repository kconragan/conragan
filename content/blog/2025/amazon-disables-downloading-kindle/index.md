---
title: "Amazon’s killing a feature that let you download and backup Kindle books"
date: 2025-02-16T17:04:55-08:00
type: blog
---
From [The Verge](https://www.theverge.com/news/612898/amazon-removing-kindle-book-download-transfer-usb):

> Starting on February 26, 2025, Amazon is removing a feature from its website allowing you to download purchased books to a computer and then copy them manually to a [Kindle](https://www.theverge.com/24326185/amazon-kindle-paperwhite-signature-edition-2024-e-reader-review) over USB. It’s a feature that many Kindle users are probably unaware of, given books are more easily sent to devices over Wi-Fi. Still, it’s beneficial for backing up purchases or converting them to other formats compatible with non-Kindle e-readers.

If you’ve bought Kindle books, download them now. Digital “ownership” is a thorny issue, but I’m personally not comfortable with content I’ve paid for living solely on Amazon’s servers. This change effectively locks your purchased books to Amazon's devices, limiting your freedom to read them where you want. The process, until February 26th, is straightforward:

- Go to your [Digital Content Library](https://www.amazon.com/hz/mycd/digital-console/contentlist/booksAll/dateDsc/) on Amazon.
- For each book, click the “More Actions” button and select “Download & Transfer via USB.”
- A pop-up will appear; select the Kindle device you want to associate the download with and click “Download.”

(No bulk downloads, unfortunately. One book at a time.)

{{< himage src="amazon-screenshot.webp" alt="Screenshot of Amazon Kindle download selection" max-width="60%" >}}

You’ll then have a local copy. But these files are tied to the specific Kindle you chose. This download option is a relic from the early days of Kindle when Whispernet (a cellular connection) wasn't always reliable. USB downloads were essential then, but Wi-Fi has since made them largely unnecessary for most users. However, even in the Wi-Fi era, this feature became a lifeline for those who valued true ownership and control over their digital books. But here's the catch: even with a local copy, you’re still tied to Amazon’s discretion. And their discretion is that you can only read books purchased from them on devices _they_ manufacture and sell. Fortunately, tools exist to convert Kindle books to open formats like `.epub`. But this leads you into the wild world of DRM and copyright law.

I’m no lawyer, but the intersection of DRM and the [first sale doctrine](https://en.wikipedia.org/wiki/First-sale_doctrine) seems relevant. First sale lets you resell or lend a lawfully purchased copy and is a big enough deal to have reached the Supreme Court in the 1980s when video stores renting VHS tapes were challenged. The video stores won. Turns out copyright law is meant to protect consumers as much as creators. (Though more recently courts have been reluctant to apply first sale to digital goods, which underscores the tension between consumer rights and DRM.)

Want to read your Kindle books on other devices? Check out [Calibre](https://calibre-ebook.com/) and [DeDRM_tools](https://github.com/noDRM/DeDRM_tools). I found this [It’s Foss](https://itsfoss.com/calibre-remove-drm-kindle/) tutorial helpful (though I needed an older Calibre version, as their troubleshooting notes suggest).

I've decided to stop buying ebooks through Amazon. I've been a happy user of [Libby](https://libbyapp.com/), which offers a fantastic way to support local libraries—something more important now than ever. Libby provides a great user experience and generally has an excellent catalog, but it does have some caveats. You're tied to the quality of your local library's collection, and there can be long wait times for popular titles, just like with physical books.

If I'm impatient or want to own a copy, [Bookshop.org](https://bookshop.org) has recently started selling ebooks. Most of the books currently are also DRM-protected. However, here is a [post from CEO Andy Hunter on Threads](https://www.threads.net/@andyhunter777/post/DFaoinuOqE4):

>Hi all, CEO of Bookshop.org here. We love DRM-free books and are working hard to add lots of them to our catalog. For launch, we have mostly large corporate publishers who insist on DRM and don’t allow downloading books. That’s a publisher decision, not ours. But soon we’ll have a way to filter for DRM-free titles which will be downloadable! Also, it’s my holy grail to allow you to buy an ebook from a local bookstore and read it on your Kindle. It requires Amazon’s cooperation—we are trying!

(Side note: Boox is a compatible e-ink device that works with bookshop.org)

Bookshop.org also seem committed to protecting consumer access to their digital books (which started this whole post for me). From their [FAQ](https://bookshop.org/info/ebooks#DRMFREE):

> The publishers of our ebooks require that the ebooks you “purchase” from Bookshop.org are only licensed to you. Even DRM-free books are subject to some restrictions and may not be owned outright. However, even in the case of an ebook being removed from Bookshop.org by the publisher, users who purchased the ebook previously will continue to have access to the ebook file. Depending on the circumstances, in the unlikely event an ebook is removed from your library because of a rights issue or otherwise, Bookshop.org will refund the purchase price you paid.
