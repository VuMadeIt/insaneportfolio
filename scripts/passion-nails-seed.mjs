// Seeds one fake day of bookings into a LOCAL D1 of the salon app (never the live database), for
// scripts/passion-nails-shots.mjs. Old builds (feat/08, feat/11) call Alex "alec" and lack any_staff.
// Usage: SALON=<checkout> PERSIST=<dir> [ALEC=1] [DATE=YYYY-MM-DD] node scripts/passion-nails-seed.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const { SALON, ALEC } = process.env;
const PERSIST = resolve(SALON, process.env.PERSIST);
mkdirSync(PERSIST, { recursive: true });
const date =
  process.env.DATE ?? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(new Date());
const alex = ALEC ? "alec" : "alex";
const q = (v) => (v === null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);
const now = new Date().toISOString();
// name, phone, services, source, staff, start, end, status, any staff
const day = [
  ["Linh Tran", "4165550101", ["pedicure"], "online", "june", "10:00", "10:35", "booked", 0],
  ["Jasmine Wong", "4165550102", ["acrylic-fill"], "online", alex, "10:15", "11:15", "booked", 0],
  ["Priya Shah", "4165550103", ["biogel-fullset"], "online", "kim", "10:30", "11:45", "booked", 1],
  ["Maria Santos", "4165550112", ["pedi-mani-shellac"], "online", "june", "11:00", "12:30", "booked", 0],
  ["Ava Nguyen", "4165550119", ["mani-shellac"], "online", "dina", "13:00", "13:50", "booked", 0],
  ["Thu", null, ["manicure"], "staff", "kim", "14:00", "14:20", "booked", 0],
  ["Sophie Martin", "4165550124", ["pedicure"], "online", alex, "15:30", "16:05", "booked", 1],
  ["Emily Chen", "4165550131", ["mani-shellac"], "online", "dina", "16:00", "16:50", "cancelled", 0],
];
const sql = ["DELETE FROM blocks;", "DELETE FROM bookings;"];
day.forEach(([name, phone, svc, source, staff, start, end, status], i) => {
  const id = i + 1;
  sql.push(
    `INSERT INTO bookings (id, token, name, phone, services, status, source, notify, date, created_at, updated_at, updated_by, cancelled_at) VALUES (${id}, ${q(`seed${id}tok${date}`)}, ${q(name)}, ${q(phone)}, ${q(JSON.stringify(svc))}, ${q(status)}, ${q(source)}, ${phone ? 1 : 0}, ${q(date)}, ${q(now)}, ${q(now)}, ${q(source === "staff" ? "kim" : i === 3 ? "june" : null)}, ${q(status === "cancelled" ? now : null)});`,
    `INSERT INTO blocks (booking_id, staff, date, start, end, services) VALUES (${id}, ${q(staff)}, ${q(date)}, ${q(`${date}T${start}`)}, ${q(`${date}T${end}`)}, ${q(JSON.stringify(svc))});`,
  );
});
const file = join(PERSIST, "seed.sql");
writeFileSync(file, sql.join("\n"));
const d1 = (args) =>
  execFileSync("npx", ["wrangler", "d1", ...args, "passionnails", "--local", "--persist-to", PERSIST], {
    cwd: SALON,
    stdio: "pipe",
    shell: true,
  });
d1(["migrations", "apply"]);
d1(["execute", "--file", file]);
const anyIds = day.flatMap((b, i) => (b[8] ? [i + 1] : []));
try {
  d1(["execute", "--command", `"UPDATE bookings SET any_staff = 1 WHERE id IN (${anyIds.join(",")})"`]);
} catch {
  // the old builds have no any_staff column
}
console.log(`seeded ${day.length} bookings on ${date} into ${PERSIST}`);
