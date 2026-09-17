import { requireAdmin } from "@/utils/admin";
import { getAuthSession } from "@/utils/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import TrackingClient from "./TrackingClient";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { robots: { index: false, follow: false } };

export default async function TrackingPage() {
  const admin = await requireAdmin();

  if (!admin) {
    const session = await getAuthSession();
    if (session?.user?.email) {
      return (
        <div className={styles.gate}>
          <h1>Not authorized</h1>
          <p>{session.user.email} is not on the admin allowlist.</p>
          <Link href="/">Back to site</Link>
        </div>
      );
    }
    redirect("/blog/login");
  }

  return <TrackingClient />;
}
