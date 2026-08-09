import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main">
      <div className="wrap page-hero reveal" style={{ textAlign: "center" }}>
        <p className="eyebrow">404</p>
        <h1>We couldn&rsquo;t find that page.</h1>
        <p style={{ margin: "0 auto" }}>
          It may have been unpublished, or the link might be broken. Try the research hub instead.
        </p>
        <div className="hero-ctas" style={{ justifyContent: "center", marginTop: 24 }}>
          <Link href="/research" className="btn btn-solid">Browse Research</Link>
          <Link href="/" className="link-underline">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
