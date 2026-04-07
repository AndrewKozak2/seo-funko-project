import styles from "./Author.module.css";
import { notFound } from "next/navigation";

async function getAuthor(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const res = await fetch(`${apiUrl}/authors/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function AuthorProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const author = await getAuthor(resolvedParams.slug);

  if (!author) {
    return notFound();
  }

  return (
    <div className={`container ${styles.authorWrapper}`}>
      <img
        src={author.avatar}
        alt={author.name}
        width={150}
        height={150}
        className={styles.profileImage}
      />
      <h1 className={styles.name}>{author.name}</h1>
      <p className={styles.bio}>Bio: {author.bio}</p>

      <p className={styles.social}>
        LinkedIn:
        <a href={author.linkedin} className={styles.link}>
          LinkedIn Profile
        </a>
      </p>
      <p className={styles.stats}>Published articles: {author.articlesCount}</p>
    </div>
  );
}
