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
  process.env.DATE || new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(new Date());
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
  // The rest of a usual day (about 30 customers), for the By-tech timeline. Gaps keep each buffer
  // (15 min after online, 5 after a walk-in), and Dina stays free until 1:00 for the walk-in film.
  ["Grace Lee", "4165550140", ["mani-shellac"], "online", "june", "12:45", "13:20", "booked", 0],
  ["Hannah Kim", "4165550141", ["eyebrows"], "online", "june", "13:45", "13:55", "booked", 0],
  ["Olivia Brown", "4165550142", ["biogel-fill"], "online", "june", "14:15", "15:05", "booked", 0],
  ["Hằng", null, ["manicure"], "staff", "june", "15:20", "15:45", "booked", 0],
  ["Chloe Park", "4165550143", ["shellac-mani-pedi"], "online", "june", "16:00", "17:15", "booked", 0],
  ["Natalie Ho", "4165550144", ["pedicure"], "online", "june", "17:30", "18:05", "booked", 0],
  ["Rachel Green", "4165550145", ["acrylic-fill"], "online", "kim", "12:00", "13:00", "booked", 1],
  ["Fatima Ali", "4165550146", ["full-face"], "online", "kim", "14:30", "15:00", "booked", 0],
  ["Isabella Rossi", "4165550147", ["pedi-shellac"], "online", "kim", "15:15", "16:05", "booked", 0],
  ["Zoe Martin", "4165550148", ["uv-fill"], "online", "kim", "16:30", "17:30", "booked", 0],
  ["Lily Tran", "4165550149", ["manicure"], "online", "kim", "17:45", "18:05", "booked", 1],
  ["Amanda Silva", "4165550150", ["pedicure"], "online", "dina", "14:15", "15:00", "booked", 1],
  ["Hoa", null, ["mani-shellac"], "staff", "dina", "15:15", "16:05", "booked", 0],
  ["Megan Wright", "4165550151", ["half-leg"], "online", "dina", "16:30", "17:00", "booked", 0],
  ["Sarah Cohen", "4165550152", ["mani-pedi"], "online", "dina", "17:15", "18:35", "booked", 0],
  ["Kayla Singh", "4165550153", ["uv-fullset"], "online", alex, "11:30", "12:30", "booked", 0],
  ["Diana Lopez", "4165550154", ["pedicure"], "online", alex, "12:45", "13:30", "booked", 1],
  ["Erin Walsh", "4165550155", ["acrylic-fullset"], "online", alex, "13:45", "15:00", "booked", 0],
  ["Tina Vo", "4165550156", ["mani-pedi-shellac"], "online", alex, "16:30", "17:45", "booked", 0],
  ["Jenny Liu", "4165550157", ["shellac-change-hand"], "online", alex, "18:00", "18:30", "booked", 0],
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
