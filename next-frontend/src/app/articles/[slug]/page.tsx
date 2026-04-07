import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./Article.module.css";

const articlesDB: Record<string, any> = {
  "how-to-spot-fake-funko": {
    title: "How to Spot a Fake Funko Pop Figure?",
    content: (
      <>
        <p className={styles.content}>
          With the rising popularity of Funko Pops, the market has seen a huge
          influx of fake figures, especially for rare Vaulted items, Anime
          grails, and Comic-Con exclusives. Whether you are buying from eBay,
          Vinted, or a local reseller, knowing how to identify counterfeit
          products is the most crucial skill for any serious collector. Here is
          our expert in-depth guide to protect your collection.
        </p>

        <h2 className={styles.subheading}>
          1. Check the Box Artwork and Fonts
        </h2>
        <p className={styles.content}>
          The first giveaway is almost always the packaging. Scammers often scan
          original boxes and reprint them, which leads to a loss in quality.
          Authentic Funko Pop boxes feature crisp, high-resolution printing.
          Fakes usually have:
        </p>
        <ul
          className={styles.content}
          style={{ paddingLeft: "20px", marginBottom: "20px" }}
        >
          <li>
            <strong>Faded or overly saturated colors:</strong> The skin tones of
            the character art might look sickly or too orange.
          </li>
          <li>
            <strong>Blurry logos:</strong> Look closely at the "POP!" logo. The
            Ben-Day dots (the comic-style dots inside the letters) should be
            perfectly clear, not smudged.
          </li>
          <li>
            <strong>Incorrect borders:</strong> The white border around the
            character illustration on the front should be even and perfectly
            aligned. Fakes often have borders that are too thick or cut off.
          </li>
        </ul>

        <h2 className={styles.subheading}>
          2. Inspect the Serial Numbers (JAL / FAC Codes)
        </h2>
        <p className={styles.content}>
          Every official Funko Pop has a production serial number. This is your
          best tool for authentication. The number is usually located on the
          bottom of the box and takes the form of an engraved stamp or a printed
          sticker (e.g., <em>FAC-123456-12345</em> or <em>JAL-12345</em>).
        </p>
        <p className={styles.content}>
          <strong>The Golden Rule:</strong> The serial number on the bottom of
          the box MUST match the serial number stamped on the bottom of the
          figure's foot or lower neck. If the figure lacks this stamp, or if the
          box has a flat printed number instead of an indented stamp (when it
          should be indented), it is highly likely a counterfeit.
        </p>

        <h2 className={styles.subheading}>
          3. Examine the Paint Job and Vinyl Quality
        </h2>
        <p className={styles.content}>
          While even official Funko figures can occasionally suffer from minor
          factory paint flaws, counterfeits take it to another level. When
          inspecting the figure out of the box, pay attention to the following
          details:
        </p>
        <ul
          className={styles.content}
          style={{ paddingLeft: "20px", marginBottom: "20px" }}
        >
          <li>
            <strong>The Finish:</strong> Authentic Pops usually have a premium
            matte finish (unless they are specifically Metallic or Chrome
            variants). Fakes often have a cheap, oily, or overly glossy shine.
          </li>
          <li>
            <strong>Paint Bleed:</strong> Look at the hairline, the edges of the
            eyes, and small costume details. Fake figures typically have
            overlapping paint and sloppy lines.
          </li>
          <li>
            <strong>Weight and Feel:</strong> Counterfeits are often hollower
            and made of cheaper plastic, making them feel significantly lighter
            than the real deal.
          </li>
        </ul>

        <h2 className={styles.subheading}>4. Trust Your Source</h2>
        <p className={styles.content}>
          If a deal seems too good to be true, it probably is. Finding a rare
          $200 Vaulted figure for $30 shipped from overseas is a massive red
          flag. To guarantee authenticity, always buy from verified retailers,
          reputable specialized stores, or trusted collectors who can provide
          close-up photos of all the details mentioned above.
        </p>
      </>
    ),
    authorName: "Andriy Kozak",
    authorSlug: "andriy-kozak",
    authorAvatar:
      "https://scene7.toyota.eu/is/image/toyotaeurope/01-2011-lexus-lfa-review?wid=1280&fit=fit,1&ts=0&resMode=sharp2&op_usm=1.75,0.3,2,0",
    published: "April 10, 2026",
    updated: "April 12, 2026",
  },

  "funko-stickers-explained": {
    title: "Funko Stickers Explained: Chase, Glow & Flocked",
    content: (
      <>
        <p className={styles.content}>
          Stickers on a Funko Pop box are much more than just colorful
          labels—they are a crucial indicator of a figure's rarity, origin, and
          market value. For out-of-box collectors, the figure itself is what
          matters, but for in-box purists, a pristine sticker can double or
          triple the price. Let's break down the most common and valuable Funko
          stickers you will encounter.
        </p>

        <h2 className={styles.subheading}>
          1. The Holy Grail: "Chase" Stickers
        </h2>
        <p className={styles.content}>
          A "Chase" is a rare variant of a common figure. Historically, these
          were packed at a 1-in-6 ratio (meaning one Chase for every five
          standard figures in a master case). A Chase variant might feature a
          different mold, a different color palette, or a unique accessory.
          Finding the metallic gold Chase sticker in the wild is the ultimate
          thrill for any collector.
        </p>

        <h2 className={styles.subheading}>
          2. Texture & Material: Flocked, Metallic, and Diamond
        </h2>
        <p className={styles.content}>
          Funko loves to re-release popular characters with unique physical
          finishes. These stickers indicate a difference in the vinyl material
          itself:
        </p>
        <ul className={styles.list}>
          <li>
            <strong>Flocked:</strong> The figure is covered in a fuzzy,
            velvet-like material to simulate fur. This is perfect for animal
            characters, monsters, or pets.
          </li>
          <li>
            <strong>Metallic:</strong> The standard matte vinyl is replaced with
            a shiny, reflective metallic paint.
          </li>
          <li>
            <strong>Diamond Collection:</strong> The figure is completely
            encrusted with glitter. These are highly sought after and look
            incredible on a display shelf.
          </li>
        </ul>

        <h2 className={styles.subheading}>
          3. Light Effects: Glow in the Dark (GITD) & Blacklight
        </h2>
        <p className={styles.content}>
          Figures with the yellow "Glow in the Dark" sticker contain
          phosphorescent paint. Some figures glow entirely, while others only
          have glowing accents (like eyes, weapons, or energy blasts). The
          "Blacklight" sticker indicates neon-painted figures specifically
          designed to glow intensely under a UV light setup.
        </p>

        <h2 className={styles.subheading}>
          4. Convention Exclusives vs. Shared Exclusives
        </h2>
        <p className={styles.content}>
          During major events like San Diego Comic-Con (SDCC) or New York Comic
          Con (NYCC), Funko releases highly limited editions.
        </p>
        <ul className={styles.list}>
          <li>
            <strong>Official Con Sticker:</strong> Available only to attendees
            who physically visited the convention booth. These are the most
            valuable versions.
          </li>
          <li>
            <strong>Shared / Fall Convention Sticker:</strong> Sold to the
            general public through retail partners (like Target or Hot Topic)
            during the convention week. The figure inside is 100% identical, but
            the sticker is different (and usually less valuable).
          </li>
        </ul>

        <h2 className={styles.subheading}>
          5. The "Special Edition" Silver Sticker
        </h2>
        <p className={styles.content}>
          If you are collecting in Europe, you will see this silver sticker
          everywhere. It replaces US-specific retailer stickers (like Walgreens,
          Target, or Walmart exclusives) for the international market. While it
          means the figure is an exclusive, the sticker itself is very common
          overseas.
        </p>
      </>
    ),
    authorName: "Sasha Khoiskyi",
    authorSlug: "sasha-khoiskyi",
    authorAvatar:
      "https://avtoto.com.ua/blog/wp-content/uploads/2017/11/1280px-1967_Dodge_Charger_fastback_red_front.jpg",
    published: "April 5, 2026",
    updated: "April 6, 2026",
  },

  "best-ways-to-display-collection": {
    title: "Top 5 Ways to Display Your Collection",
    content: (
      <>
        <p className={styles.content}>
          Whether you are a strict in-box collector keeping everything mint, or
          an out-of-box (OOB) enthusiast who loves to see every sculpted detail,
          displaying your Funko Pops properly is an art form. As your collection
          grows from 10 figures to 100+, finding the right storage solution
          becomes crucial. Here are the top 5 methods to show off your grails
          while keeping them safe.
        </p>

        <h2 className={styles.subheading}>
          1. The Classic: IKEA Detolf Glass Cabinets
        </h2>
        <p className={styles.content}>
          The IKEA Detolf is widely considered the gold standard in the
          collecting community. Glass cabinets are perfect for both in-box and
          OOB collections. They offer a premium 360-degree view and, most
          importantly, keep the dust away.
        </p>
        <ul className={styles.list}>
          <li>
            <strong>Pros:</strong> Excellent dust protection, professional
            museum-like appearance, fits standard Pop boxes perfectly.
          </li>
          <li>
            <strong>Cons:</strong> Requires floor space, glass can be fragile to
            move.
          </li>
        </ul>

        <h2 className={styles.subheading}>
          2. Space-Saving: Floating Wall Shelves
        </h2>
        <p className={styles.content}>
          If you are running out of floor space, the walls are your best friend.
          Simple floating shelves (like the IKEA Lack or custom acrylic ledges)
          create a clean, minimalist look. You can arrange them by fandom,
          color, or specific sets without taking up room on your desk or floor.
        </p>

        <h2 className={styles.subheading}>
          3. Maximizing Depth: Acrylic Risers
        </h2>
        <p className={styles.content}>
          If you are displaying figures on deep bookshelves, the Pops in the
          back often get hidden. Acrylic tiered risers (often sold as spice
          racks or cosmetic displays) solve this problem instantly.
        </p>
        <p className={styles.content}>
          By placing your figures on different levels, you create a
          stadium-seating effect. This is an absolute must-have for large
          out-of-box collections to ensure every single figure is visible.
        </p>

        <h2 className={styles.subheading}>
          4. The Creative Hack: Baseball Bat Display Cases
        </h2>
        <p className={styles.content}>
          This is a favorite "hack" among Funko collectors. A standard baseball
          bat display case perfectly fits about 10-12 out-of-box Funko Pops.
          These cases usually come with a UV-protected glass door, keeping your
          figures safe from sunlight fading and dust, while looking incredibly
          sleek mounted horizontally on a wall.
        </p>

        <h2 className={styles.subheading}>
          5. For the Grails: Premium Hard Stacks
        </h2>
        <p className={styles.content}>
          For your most expensive and rare figures (often called "Grails"),
          standard display isn't enough—you need armor. Premium hard plastic
          protectors (Hard Stacks) offer maximum defense.
        </p>
        <ul className={styles.list}>
          <li>
            <strong>UV Resistance:</strong> Prevents the box artwork and vinyl
            figure from fading in direct sunlight.
          </li>
          <li>
            <strong>Drop Protection:</strong> Keeps the cardboard corners sharp
            even if accidentally knocked over.
          </li>
          <li>
            <strong>Stackability:</strong> Allows you to safely stack high
            towers of figures without crushing the boxes at the bottom.
          </li>
        </ul>
      </>
    ),
    authorName: "Andriy Kozak",
    authorSlug: "andriy-kozak",
    authorAvatar:
      "https://scene7.toyota.eu/is/image/toyotaeurope/01-2011-lexus-lfa-review?wid=1280&fit=fit,1&ts=0&resMode=sharp2&op_usm=1.75,0.3,2,0",
    published: "March 28, 2026",
    updated: "March 29, 2026",
  },
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const article = articlesDB[resolvedParams.slug];

  if (!article) {
    return notFound();
  }

  return (
    <article className={`container ${styles.articleWrapper}`}>
      <h1 className={styles.title}>{article.title}</h1>

      {article.content}
      <div className={styles.authorSignature}>
        <img
          src={article.authorAvatar}
          alt={article.authorName}
          width={50}
          height={50}
          className={styles.authorAvatar}
        />
        <div className={styles.authorInfo}>
          <h3 className={styles.authorName}>
            Author:
            <Link
              href={`/authors/${article.authorSlug}`}
              className={styles.authorLink}
            >
              {article.authorName}
            </Link>
          </h3>
          <p className={styles.authorBio}>{article.authorBio}</p>
          <small className={styles.dates}>
            Published: {article.published} | Updated: {article.updated}
          </small>
        </div>
      </div>
    </article>
  );
}
