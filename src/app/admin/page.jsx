import { requireAdmin } from "@/utils/admin";
import { getAuthSession } from "@/utils/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminClient from "./AdminClient";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminPage() {
  const admin = await requireAdmin();

  if (!admin) {
    const session = await getAuthSession();
    // Logged in but not on the allowlist: show a clear message, not a login loop.
    if (session?.user?.email) {
      return (
        <div className={styles.gate}>
          <h1>Not authorized</h1>
          <p>
            {session.user.email} is not on the admin allowlist. Add it to the
            <code> ADMIN_EMAILS</code> environment variable.
          </p>
          <Link href="/">Back to site</Link>
        </div>
      );
    }
    redirect("/blog/login");
  }

  return <AdminClient adminEmail={admin.user.email} />;
}
