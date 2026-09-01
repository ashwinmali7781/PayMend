function csvEscape(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const COLUMNS = [
  ["audit_id", (e) => e.audit_id],
  ["processed_at", (e) => e.processed_at],
  ["payment_id", (e) => e.payment.id],
  ["source", (e) => e.payment.source === "razorpay_live_test" ? "live_test" : "synthetic"],
  ["customer_name", (e) => e.payment.customer_name],
  ["plan", (e) => e.payment.plan],
  ["amount_inr", (e) => (e.payment.amount / 100).toFixed(2)],
  ["attempt_number", (e) => e.payment.attempt_number],
  ["failure_category", (e) => e.classification.category],
  ["failure_label", (e) => e.classification.label],
  ["action_taken", (e) => e.decision.action],
  ["action_detail", (e) => e.decision.detail],
  ["reasoning", (e) => e.decision.reasoning],
  ["outcome", (e) => e.result.outcome],
  ["recovered", (e) => e.result.recovered],
  ["recovery_message", (e) => e.message?.text || ""],
  ["resolution_action", (e) => e.resolution?.action || ""],
  ["resolution_note", (e) => e.resolution?.note || ""],
];

export function auditLogToCsv(entries) {
  const header = COLUMNS.map(([name]) => name).join(",");
  const rows = entries.map((entry) =>
    COLUMNS.map(([, getter]) => csvEscape(getter(entry))).join(",")
  );
  return [header, ...rows].join("\n");
}

export function downloadAuditLogCsv(entries) {
  const csv = auditLogToCsv(entries);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  link.href = url;
  link.download = `revenue-recovery-audit-log-${timestamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
