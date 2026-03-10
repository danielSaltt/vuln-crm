#!/usr/bin/env bash
set -euo pipefail

base="$(pwd)/fixtures"
mkdir -p "$base"/{tenants,users,contacts,accounts,deals,notes,apikeys,files,audits,tasks,tickets,campaigns,invoices,activities,webhooks,workflows,reports,products,subscriptions,contracts,quotes,forecasts,segments,playbooks,escalations,onboardings,integrations,notifications,announcements}

for i in $(seq -w 1 10); do
  cat > "$base/tenants/tenant-${i}.json" <<JSON
{"id":"tenant-${i}","name":"Tenant ${i}","plan":"enterprise"}
JSON
done

roles=(viewer agent manager admin)
for i in $(seq -w 1 80); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  role=${roles[$((10#$i % 4))]}
  cat > "$base/users/user-${i}.json" <<JSON
{"id":"user-${i}","tenant_id":"${tenant}","username":"user${i}","email":"user${i}@example.test","password":"Password123!","role":"${role}","is_active":true,"reset_token":null}
JSON
done

cat > "$base/users/user-seed-admin.json" <<JSON
{"id":"user-seed-admin","tenant_id":"tenant-01","username":"admin1","email":"admin1@example.test","password":"Password123!","role":"admin","is_active":true,"reset_token":null}
JSON
cat > "$base/users/user-seed-manager.json" <<JSON
{"id":"user-seed-manager","tenant_id":"tenant-01","username":"manager1","email":"manager1@example.test","password":"Password123!","role":"manager","is_active":true,"reset_token":null}
JSON
cat > "$base/users/user-seed-agent.json" <<JSON
{"id":"user-seed-agent","tenant_id":"tenant-01","username":"agent1","email":"agent1@example.test","password":"Password123!","role":"agent","is_active":true,"reset_token":null}
JSON
cat > "$base/users/user-seed-viewer.json" <<JSON
{"id":"user-seed-viewer","tenant_id":"tenant-01","username":"viewer1","email":"viewer1@example.test","password":"Password123!","role":"viewer","is_active":true,"reset_token":null}
JSON
cat > "$base/users/user-cross-tenant-admin.json" <<JSON
{"id":"user-cross-tenant-admin","tenant_id":"tenant-02","username":"admin2","email":"admin2@example.test","password":"Password123!","role":"admin","is_active":true,"reset_token":null}
JSON

for i in $(seq -w 1 100); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/contacts/contact-${i}.json" <<JSON
{"id":"contact-${i}","tenant_id":"${tenant}","owner_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","first_name":"First${i}","last_name":"Last${i}","email":"contact${i}@example.test","phone":"+100000${i}","source":"import","notes":"Contact seed ${i}"}
JSON
done

for i in $(seq -w 1 70); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/accounts/account-${i}.json" <<JSON
{"id":"account-${i}","tenant_id":"${tenant}","name":"Account ${i}","website":"https://account${i}.example.test","industry":"tech","annual_revenue":$((10000 + 10#$i * 200))}
JSON
done

stages=(lead qualified proposal won lost)
for i in $(seq -w 1 90); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  stage=${stages[$((10#$i % 5))]}
  cat > "$base/deals/deal-${i}.json" <<JSON
{"id":"deal-${i}","tenant_id":"${tenant}","contact_id":"contact-$(printf '%02d' $((10#$i % 100 + 1)))","account_id":"account-$(printf '%02d' $((10#$i % 70 + 1)))","title":"Deal ${i}","stage":"${stage}","amount":$((500 + 10#$i * 25)),"priority":$((10#$i % 3 + 1))}
JSON
done

for i in $(seq -w 1 60); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  body="Call back before Q$((10#$i % 4 + 1))."
  if [ "$i" = "13" ]; then
    body="<img src=x onerror=alert('stored-xss-note') />"
  fi
  cat > "$base/notes/note-${i}.json" <<JSON
{"id":"note-${i}","tenant_id":"${tenant}","entity_type":"contact","entity_id":"contact-$(printf '%02d' $((10#$i % 100 + 1)))","body":"${body}","created_by":"user-$(printf '%02d' $((10#$i % 80 + 1)))"}
JSON
done

for i in $(seq -w 1 25); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/apikeys/key-${i}.json" <<JSON
{"id":"key-${i}","tenant_id":"${tenant}","key_value":"sk_live_seed_${i}","description":"seed key ${i}","created_by":"user-$(printf '%02d' $((10#$i % 80 + 1)))"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/files/file-${i}.json" <<JSON
{"id":"file-${i}","tenant_id":"${tenant}","owner_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","original_name":"document-${i}.txt","storage_path":"uploads/document-${i}.txt","mime_type":"text/plain"}
JSON
done

for i in $(seq -w 1 30); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/audits/audit-${i}.json" <<JSON
{"id":"audit-${i}","tenant_id":"${tenant}","user_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","action":"seed.action.${i}","details":"{\"source\":\"seed\",\"id\":\"${i}\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/tasks/task-${i}.json" <<JSON
{"id":"task-${i}","tenant_id":"${tenant}","title":"Task ${i}","description":"Follow-up task ${i}","status":"open","due_date":"2026-12-$((10#$i % 28 + 1))","assignee_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","metadata":"{\"source\":\"seed\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/tickets/ticket-${i}.json" <<JSON
{"id":"ticket-${i}","tenant_id":"${tenant}","subject":"Support ticket ${i}","body":"Investigate issue ${i}","priority":"medium","status":"new","reporter_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","metadata":"{\"channel\":\"email\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/campaigns/campaign-${i}.json" <<JSON
{"id":"campaign-${i}","tenant_id":"${tenant}","name":"Campaign ${i}","channel":"email","budget":$((1000 + 10#$i * 25)),"status":"draft","starts_on":"2026-06-01","ends_on":"2026-07-01","metadata":"{\"audience\":\"all\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/invoices/invoice-${i}.json" <<JSON
{"id":"invoice-${i}","tenant_id":"${tenant}","account_id":"account-$(printf '%02d' $((10#$i % 70 + 1)))","reference":"INV-${i}","amount":$((500 + 10#$i * 15)),"currency":"USD","status":"pending","due_date":"2026-11-$((10#$i % 28 + 1))","metadata":"{\"source\":\"billing\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/activities/activity-${i}.json" <<JSON
{"id":"activity-${i}","tenant_id":"${tenant}","actor_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","entity_type":"deal","entity_id":"deal-$(printf '%02d' $((10#$i % 90 + 1)))","action":"deal.updated","metadata":"{\"field\":\"stage\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/webhooks/webhook-${i}.json" <<JSON
{"id":"webhook-${i}","tenant_id":"${tenant}","event_name":"deal.won","target_url":"https://hooks${i}.example.test/receive","secret":"whsec_${i}","is_active":true,"metadata":"{\"retry\":3}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/workflows/workflow-${i}.json" <<JSON
{"id":"workflow-${i}","tenant_id":"${tenant}","name":"Workflow ${i}","trigger_event":"contact.created","definition_json":"{\"steps\":[\"assign_owner\",\"create_task\"]}","is_enabled":true,"metadata":"{\"version\":1}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/reports/report-${i}.json" <<JSON
{"id":"report-${i}","tenant_id":"${tenant}","name":"Report ${i}","query_template":"SELECT * FROM deals WHERE tenant_id = '{{tenant_id}}'","visibility":"private","last_generated_at":"2026-03-01T00:00:00Z","metadata":"{\"format\":\"csv\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/products/product-${i}.json" <<JSON
{"id":"product-${i}","tenant_id":"${tenant}","sku":"SKU-${i}","name":"Product ${i}","category":"software","unit_price":$((50 + 10#$i * 4)),"status":"active","metadata":"{\"tier\":\"standard\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/subscriptions/subscription-${i}.json" <<JSON
{"id":"subscription-${i}","tenant_id":"${tenant}","account_id":"account-$(printf '%02d' $((10#$i % 70 + 1)))","plan_name":"Growth","billing_cycle":"monthly","status":"active","renews_on":"2026-10-$((10#$i % 28 + 1))","metadata":"{\"seat_count\":10}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/contracts/contract-${i}.json" <<JSON
{"id":"contract-${i}","tenant_id":"${tenant}","account_id":"account-$(printf '%02d' $((10#$i % 70 + 1)))","contract_name":"Contract ${i}","owner_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","status":"draft","expires_on":"2027-03-$((10#$i % 28 + 1))","metadata":"{\"region\":\"APAC\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/quotes/quote-${i}.json" <<JSON
{"id":"quote-${i}","tenant_id":"${tenant}","account_id":"account-$(printf '%02d' $((10#$i % 70 + 1)))","deal_id":"deal-$(printf '%02d' $((10#$i % 90 + 1)))","quote_number":"Q-${i}","total_amount":$((800 + 10#$i * 19)),"status":"created","metadata":"{\"currency\":\"USD\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/forecasts/forecast-${i}.json" <<JSON
{"id":"forecast-${i}","tenant_id":"${tenant}","period":"2026-Q$((10#$i % 4 + 1))","owner_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","expected_revenue":$((5000 + 10#$i * 73)),"confidence":$((50 + 10#$i % 50)),"status":"open","metadata":"{\"pipeline\":\"core\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/segments/segment-${i}.json" <<JSON
{"id":"segment-${i}","tenant_id":"${tenant}","segment_name":"Segment ${i}","criteria_json":"{\"country\":\"AU\"}","audience_size":$((100 + 10#$i * 3)),"status":"active","metadata":"{\"source\":\"crm\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/playbooks/playbook-${i}.json" <<JSON
{"id":"playbook-${i}","tenant_id":"${tenant}","name":"Playbook ${i}","owner_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","trigger_event":"deal.created","step_count":$((3 + 10#$i % 5)),"status":"active","metadata":"{\"channel\":\"sales\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/escalations/escalation-${i}.json" <<JSON
{"id":"escalation-${i}","tenant_id":"${tenant}","source_type":"ticket","source_id":"ticket-$(printf '%02d' $((10#$i % 20 + 1)))","assigned_to":"user-$(printf '%02d' $((10#$i % 80 + 1)))","priority":"high","status":"open","metadata":"{\"sla\":\"P1\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/onboardings/onboarding-${i}.json" <<JSON
{"id":"onboarding-${i}","tenant_id":"${tenant}","customer_name":"Customer ${i}","owner_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","stage":"kickoff","completion_pct":$((10#$i % 100)),"status":"active","metadata":"{\"risk\":\"low\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/integrations/integration-${i}.json" <<JSON
{"id":"integration-${i}","tenant_id":"${tenant}","provider":"Provider${i}","config_name":"default","endpoint_url":"https://api${i}.example.test","status":"connected","last_sync_at":"2026-04-01T00:00:00Z","metadata":"{\"sync\":\"hourly\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/notifications/notification-${i}.json" <<JSON
{"id":"notification-${i}","tenant_id":"${tenant}","channel":"email","recipient_id":"user-$(printf '%02d' $((10#$i % 80 + 1)))","message":"Notification ${i}","severity":"info","status":"queued","metadata":"{\"template\":\"default\"}"}
JSON
done

for i in $(seq -w 1 20); do
  t=$((10#$i % 10 + 1))
  tenant=$(printf "tenant-%02d" "$t")
  cat > "$base/announcements/announcement-${i}.json" <<JSON
{"id":"announcement-${i}","tenant_id":"${tenant}","title":"Announcement ${i}","body":"Important update ${i}","audience":"all","status":"published","published_at":"2026-05-01T09:00:00Z","metadata":"{\"locale\":\"en\"}"}
JSON
done
