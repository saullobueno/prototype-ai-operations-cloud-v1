import type { ChannelConfig, Integration } from "@/types";
import { monthsAgo } from "@/lib/time";

export const integrations: Integration[] = [
  { id: "int_stripe", name: "Stripe", category: "payments", status: "connected", connectedAt: monthsAgo(18) },
  { id: "int_salesforce", name: "Salesforce", category: "crm", status: "connected", connectedAt: monthsAgo(14) },
  { id: "int_slack", name: "Slack", category: "communication", status: "connected", connectedAt: monthsAgo(20) },
  { id: "int_whatsapp", name: "WhatsApp Business", category: "communication", status: "connected", connectedAt: monthsAgo(10) },
  { id: "int_sendgrid", name: "SendGrid", category: "communication", status: "connected", connectedAt: monthsAgo(22) },
  { id: "int_zendesk", name: "Zendesk (migração)", category: "crm", status: "disconnected" },
  { id: "int_segment", name: "Segment", category: "analytics", status: "connected", connectedAt: monthsAgo(9) },
  { id: "int_s3", name: "AWS S3", category: "storage", status: "connected", connectedAt: monthsAgo(24) },
  { id: "int_hubspot", name: "HubSpot", category: "crm", status: "disconnected" },
  { id: "int_netsuite", name: "NetSuite", category: "erp", status: "disconnected" },
  { id: "int_quickbooks", name: "QuickBooks", category: "erp", status: "disconnected" },
  { id: "int_mixpanel", name: "Mixpanel", category: "analytics", status: "connected", connectedAt: monthsAgo(6) },
  { id: "int_gdrive", name: "Google Drive", category: "storage", status: "connected", connectedAt: monthsAgo(16) },
  { id: "int_twilio", name: "Twilio", category: "communication", status: "connected", connectedAt: monthsAgo(11) },
  { id: "int_notion", name: "Notion", category: "storage", status: "connected", connectedAt: monthsAgo(13) },
  { id: "int_datadog", name: "Datadog", category: "analytics", status: "error", connectedAt: monthsAgo(4) },
  { id: "int_pagerduty", name: "PagerDuty", category: "communication", status: "disconnected" },
  { id: "int_looker", name: "Looker", category: "analytics", status: "disconnected" },
];

export const channels: ChannelConfig[] = [
  { id: "ch_email", type: "email", name: "E-mail", status: "active" },
  { id: "ch_chat", type: "chat", name: "Chat do site", status: "active" },
  { id: "ch_whatsapp", type: "whatsapp", name: "WhatsApp", status: "active" },
  { id: "ch_sms", type: "sms", name: "SMS", status: "active" },
  { id: "ch_voice", type: "voice", name: "Voz", status: "inactive" },
  { id: "ch_social", type: "social", name: "Redes sociais (X / Instagram)", status: "inactive" },
];
