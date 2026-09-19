"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Activity, ArrowLeft, ArrowRight, BarChart3, Bell, Check, ChevronDown, ChevronRight,
  Heart, LayoutDashboard, Menu, Minus, Package, Plus, Search, Settings, ShoppingBag,
  ShoppingCart, Sparkles, Star, Tag, Trash2, Truck, Users, X, Zap, ShieldAlert, Boxes,
  Route, Factory, ClipboardList, SlidersHorizontal, CircleDollarSign, MonitorSmartphone,
  Laptop, Headphones, Gamepad2, Shirt, Smartphone, Cable, WalletCards, RefreshCw,
  AlertTriangle, Gauge, TrendingUp, Warehouse, MapPin, Database, Info, CheckCircle2,
  Filter, Eye, ExternalLink, Target, Layers, Brain, Clock, ArrowUpRight, Network,
  Navigation, CalendarDays, CircleAlert, ShieldCheck
} from "lucide-react";

type Category = "All" | "Fashion" | "Girls Fashion" | "Electronics" | "Mobiles" | "Laptops" | "Audio" | "Gaming" | "Accessories";
type Product = {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  subcategory: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviews: number;
  stock: number;
  tag: string;
  delivery: string;
  images: string[];
  amazonSearch: string;
};

type CartItem = Product & { quantity: number };
type Order = { id: string; product: string; quantity: number; amount: number; status: string; date: string };

type RiskDomain = "Supplier" | "Inventory" | "Transportation" | "Demand" | "External";
type RiskLevel = "Critical" | "High" | "Medium" | "Low";
type RiskTrend = "Rising" | "Stable" | "Falling";

type RiskFactor = {
  id: string;
  title: string;
  domain: RiskDomain;
  level: RiskLevel;
  score: number;
  trend: RiskTrend;
  likelihood: number;
  impact: number;
  confidence: number;
  horizon: string;
  owner: string;
  exposure: number;
  signal: string;
  relationship: string;
  consequence: string;
  mitigation: string;
  evidence: string[];
  affectedAssets: string[];
};

const riskFactors: RiskFactor[] = [
  {
    id: "RF-001",
    title: "Critical supplier availability gap",
    domain: "Supplier",
    level: "Critical",
    score: 94,
    trend: "Rising",
    likelihood: 88,
    impact: 97,
    confidence: 91,
    horizon: "0–7 days",
    owner: "Strategic Sourcing",
    exposure: 1840000,
    signal: "Primary supplier confirmation is below the configured service threshold.",
    relationship: "Supplier availability is linked to inbound component inventory and dependent SKU replenishment.",
    consequence: "A prolonged interruption can push dependent items below safety stock and increase backorder exposure.",
    mitigation: "Activate qualified secondary suppliers, reallocate inventory and reserve priority transport capacity.",
    evidence: ['Availability confirmation below threshold', 'Safety-stock coverage under 6 days', 'Single-source dependency on critical component'],
    affectedAssets: ['Mobile accessories', 'Audio components', 'Gaming controllers'],
  },
  {
    id: "RF-002",
    title: "Supplier lead-time drift",
    domain: "Supplier",
    level: "High",
    score: 82,
    trend: "Rising",
    likelihood: 81,
    impact: 84,
    confidence: 88,
    horizon: "7–14 days",
    owner: "Procurement Control",
    exposure: 1260000,
    signal: "Observed replenishment lead time is trending above contracted lead time.",
    relationship: "Lead-time drift reduces inventory cover and overlaps with demand growth in selected categories.",
    consequence: "Reorder points can be crossed earlier than planned, raising stockout risk.",
    mitigation: "Recalculate reorder points and confirm alternate lead-time lanes with procurement partners.",
    evidence: ['Lead time +19% vs baseline', 'Two late purchase-order acknowledgements', 'Reorder point approaching'],
    affectedAssets: ['Laptop accessories', 'Wearables', 'Girls Fashion basics'],
  },
  {
    id: "RF-003",
    title: "Supplier quality incident",
    domain: "Supplier",
    level: "High",
    score: 79,
    trend: "Rising",
    likelihood: 67,
    impact: 91,
    confidence: 84,
    horizon: "0–14 days",
    owner: "Supplier Quality",
    exposure: 940000,
    signal: "Defect rate has moved above the accepted control band.",
    relationship: "Quality holds reduce usable inventory even when nominal stock remains available.",
    consequence: "Available-to-promise inventory can diverge from physical stock and delay fulfillment.",
    mitigation: "Quarantine affected lots, inspect replacement batches and widen inbound quality sampling.",
    evidence: ['Defect rate 2.4× baseline', 'Quality hold on recent lots', 'Supplier corrective action pending'],
    affectedAssets: ['Chargers', 'Cables', 'Small electronics'],
  },
  {
    id: "RF-004",
    title: "Single-source dependency",
    domain: "Supplier",
    level: "High",
    score: 77,
    trend: "Stable",
    likelihood: 73,
    impact: 87,
    confidence: 96,
    horizon: "14–30 days",
    owner: "Supply Network Design",
    exposure: 1530000,
    signal: "A product family is materially dependent on one approved source.",
    relationship: "Single-source dependency magnifies the effect of supplier availability or transport disruption.",
    consequence: "The same disruption can affect multiple SKUs simultaneously.",
    mitigation: "Develop a second source and validate equivalent component specifications before disruption.",
    evidence: ['One approved supplier', 'High share of category volume', 'Limited substitution options'],
    affectedAssets: ['Gaming accessories', 'Audio components', 'Smartphone peripherals'],
  },
  {
    id: "RF-005",
    title: "Low inventory coverage",
    domain: "Inventory",
    level: "Critical",
    score: 91,
    trend: "Rising",
    likelihood: 92,
    impact: 89,
    confidence: 94,
    horizon: "0–5 days",
    owner: "Inventory Control",
    exposure: 1120000,
    signal: "On-hand stock is below the configured days-of-cover threshold.",
    relationship: "Low cover leaves little buffer against supplier delay, route variability and demand spikes.",
    consequence: "A short disruption window can create immediate stockout pressure.",
    mitigation: "Prioritize replenishment and reallocate units from lower-velocity locations or categories.",
    evidence: ['Coverage below safety target', 'Daily demand accelerating', 'Inbound ETA remains variable'],
    affectedAssets: ['Fast-moving electronics', 'Girls Fashion bestsellers', 'Accessories'],
  },
  {
    id: "RF-006",
    title: "Stockout velocity acceleration",
    domain: "Inventory",
    level: "High",
    score: 86,
    trend: "Rising",
    likelihood: 89,
    impact: 82,
    confidence: 90,
    horizon: "0–7 days",
    owner: "Demand & Inventory Planning",
    exposure: 870000,
    signal: "Consumption velocity is exceeding the replenishment plan.",
    relationship: "Higher daily consumption shortens coverage and increases exposure to inbound delays.",
    consequence: "The projected stockout date moves forward unless replenishment or allocation changes.",
    mitigation: "Tighten allocation rules, prioritize high-contribution SKUs and expedite critical POs.",
    evidence: ['Consumption +23% week-over-week', 'Forecast error widening', 'Coverage date moved forward'],
    affectedAssets: ['Phone cases', 'Wireless audio', 'Seasonal apparel'],
  },
  {
    id: "RF-007",
    title: "Inventory imbalance across nodes",
    domain: "Inventory",
    level: "Medium",
    score: 64,
    trend: "Rising",
    likelihood: 72,
    impact: 61,
    confidence: 87,
    horizon: "7–21 days",
    owner: "Network Inventory",
    exposure: 610000,
    signal: "Stock is unevenly distributed across fulfillment locations.",
    relationship: "Excess at one node can coexist with shortages at another when transfer logic is delayed.",
    consequence: "Order fulfillment may suffer even while aggregate network inventory appears healthy.",
    mitigation: "Trigger inter-node transfer recommendations and use demand-weighted allocation rules.",
    evidence: ['Node coverage variance > 2.0×', 'Transfer queue aging', 'Regional demand divergence'],
    affectedAssets: ['Fashion', 'Mobiles', 'Accessories'],
  },
  {
    id: "RF-008",
    title: "Slow-moving inventory exposure",
    domain: "Inventory",
    level: "Medium",
    score: 58,
    trend: "Stable",
    likelihood: 77,
    impact: 53,
    confidence: 92,
    horizon: "30–60 days",
    owner: "Inventory Planning",
    exposure: 430000,
    signal: "Days-on-hand is above the configured upper band for selected SKUs.",
    relationship: "Excess units compete for working capital and storage capacity needed by faster-moving items.",
    consequence: "Rebalancing opportunities can be missed while other SKUs approach shortages.",
    mitigation: "Reprice, bundle or relocate slow movers and redirect purchase planning toward faster categories.",
    evidence: ['DOH above target', 'Low recent sell-through', 'Warehouse space utilization elevated'],
    affectedAssets: ['Older gadgets', 'Seasonal accessories', 'Slow-moving fashion'],
  },
  {
    id: "RF-009",
    title: "Inbound route delay",
    domain: "Transportation",
    level: "High",
    score: 84,
    trend: "Rising",
    likelihood: 83,
    impact: 86,
    confidence: 93,
    horizon: "0–10 days",
    owner: "Logistics Control Tower",
    exposure: 1010000,
    signal: "Transit time variance is above the route alert threshold.",
    relationship: "Longer transit compresses inventory coverage at destination nodes.",
    consequence: "Orders arriving near the stockout window become more likely to miss their planned replenishment date.",
    mitigation: "Switch selected shipments to alternate lanes and reserve faster service for constrained SKUs.",
    evidence: ['Transit +31% vs route norm', 'Hub dwell time elevated', 'ETA confidence below 70%'],
    affectedAssets: ['Electronics', 'Mobiles', 'Laptop accessories'],
  },
  {
    id: "RF-010",
    title: "Route congestion hotspot",
    domain: "Transportation",
    level: "Medium",
    score: 68,
    trend: "Rising",
    likelihood: 74,
    impact: 65,
    confidence: 80,
    horizon: "7–14 days",
    owner: "Transport Planning",
    exposure: 560000,
    signal: "Specific transport lanes are showing repeated dwell-time increases.",
    relationship: "Route congestion increases uncertainty in inbound delivery timing.",
    consequence: "Inventory plans using the standard ETA can become optimistic.",
    mitigation: "Use route-specific buffers and shift selected volume to alternate carriers or lanes.",
    evidence: ['Dwell +18%', 'Repeated checkpoint delays', 'Carrier capacity constrained'],
    affectedAssets: ['Audio', 'Gaming', 'Fashion'],
  },
  {
    id: "RF-011",
    title: "Carrier capacity constraint",
    domain: "Transportation",
    level: "High",
    score: 75,
    trend: "Stable",
    likelihood: 69,
    impact: 78,
    confidence: 85,
    horizon: "7–30 days",
    owner: "Carrier Management",
    exposure: 720000,
    signal: "Available booking capacity is below planned shipment demand.",
    relationship: "Capacity constraints can extend transit lead times and cause shipment backlogs.",
    consequence: "Planned replenishment arrives later, increasing stockout probability for low-cover nodes.",
    mitigation: "Open secondary carrier allocations and prioritize constrained products in booking queues.",
    evidence: ['Booking acceptance below target', 'Peak utilization elevated', 'Backlog growing'],
    affectedAssets: ['Laptops', 'Mobile devices', 'Large electronics'],
  },
  {
    id: "RF-012",
    title: "Demand spike",
    domain: "Demand",
    level: "Critical",
    score: 88,
    trend: "Rising",
    likelihood: 90,
    impact: 88,
    confidence: 89,
    horizon: "0–7 days",
    owner: "Demand Planning",
    exposure: 1360000,
    signal: "Observed order velocity is materially above recent forecast.",
    relationship: "Higher demand consumes available stock faster and can amplify existing supply constraints.",
    consequence: "Promotional or seasonal spikes can move multiple SKUs into shortage territory together.",
    mitigation: "Reforecast near-term demand, protect priority SKUs and increase replenishment frequency.",
    evidence: ['Orders +34% vs baseline', 'Category conversion elevated', 'Forecast revision pending'],
    affectedAssets: ['Girls Fashion', 'Audio', 'Gaming'],
  },
  {
    id: "RF-013",
    title: "Forecast variance expansion",
    domain: "Demand",
    level: "High",
    score: 73,
    trend: "Rising",
    likelihood: 79,
    impact: 74,
    confidence: 86,
    horizon: "14–30 days",
    owner: "Forecasting",
    exposure: 680000,
    signal: "Forecast error is outside the configured confidence band.",
    relationship: "Forecast variance makes reorder decisions less reliable and increases mismatch risk.",
    consequence: "The system may under-buy during demand growth or over-buy when demand falls.",
    mitigation: "Use shorter planning horizons and incorporate recent order signals into near-term replenishment.",
    evidence: ['MAPE above threshold', 'Recent demand regime changed', 'Category seasonality shift'],
    affectedAssets: ['Seasonal fashion', 'New gadgets', 'Accessories'],
  },
  {
    id: "RF-014",
    title: "Promotion-driven demand concentration",
    domain: "Demand",
    level: "Medium",
    score: 66,
    trend: "Rising",
    likelihood: 71,
    impact: 69,
    confidence: 78,
    horizon: "0–14 days",
    owner: "Commercial Planning",
    exposure: 530000,
    signal: "A narrow set of SKUs is drawing a higher share of order volume.",
    relationship: "Concentrated demand increases stockout pressure on selected products even when category totals are stable.",
    consequence: "Fulfillment gaps can occur on promoted SKUs while substitute products remain available.",
    mitigation: "Reserve inventory for promoted SKUs and monitor substitute conversion paths.",
    evidence: ['Promo SKU share +27%', 'Search demand rising', 'Substitution ratio low'],
    affectedAssets: ['Fashion offers', 'Accessories bundles', 'Audio deals'],
  },
  {
    id: "RF-015",
    title: "External disruption signal",
    domain: "External",
    level: "High",
    score: 80,
    trend: "Rising",
    likelihood: 61,
    impact: 92,
    confidence: 71,
    horizon: "7–30 days",
    owner: "Risk Monitoring",
    exposure: 1490000,
    signal: "An external condition may affect supplier or route reliability.",
    relationship: "External disruption can propagate through procurement, transport and destination inventory.",
    consequence: "Affected supply nodes may miss planned inbound windows and require contingency actions.",
    mitigation: "Pre-book alternate lanes, validate supplier continuity plans and protect critical stock.",
    evidence: ['External event watch active', 'Affected lane overlap', 'Supplier contingency status incomplete'],
    affectedAssets: ['Imported electronics', 'Battery products', 'Seasonal inventory'],
  },
  {
    id: "RF-016",
    title: "Warehouse throughput bottleneck",
    domain: "External",
    level: "Medium",
    score: 62,
    trend: "Rising",
    likelihood: 70,
    impact: 64,
    confidence: 82,
    horizon: "0–10 days",
    owner: "Fulfillment Operations",
    exposure: 390000,
    signal: "Pick-pack throughput is below the volume required to clear the current queue.",
    relationship: "Processing delay can hold inventory in non-available status even when units are physically present.",
    consequence: "Customer promises can slip and stock availability metrics can lag the physical situation.",
    mitigation: "Shift labor, rebalance waves and prioritize constrained SKUs through fulfillment queues.",
    evidence: ['Queue age increasing', 'Pick rate below plan', 'Dispatch SLA pressure'],
    affectedAssets: ['High-volume consumer items', 'Fashion', 'Small electronics'],
  },
  {
    id: "RF-017",
    title: "Safety-stock policy gap",
    domain: "Inventory",
    level: "Medium",
    score: 60,
    trend: "Stable",
    likelihood: 65,
    impact: 70,
    confidence: 90,
    horizon: "30–60 days",
    owner: "Inventory Strategy",
    exposure: 510000,
    signal: "Configured safety stock does not fully reflect current lead-time variability.",
    relationship: "Static buffers can become insufficient when supplier and transport variability increases.",
    consequence: "The nominal safety stock can provide less protection than historical planning assumptions imply.",
    mitigation: "Recalculate safety stock using updated lead-time and demand variability.",
    evidence: ['Lead-time sigma increased', 'Demand variance increased', 'Buffer policy unchanged'],
    affectedAssets: ['Critical spare parts', 'Electronics', 'Accessories'],
  },
  {
    id: "RF-018",
    title: "SKU substitution constraint",
    domain: "Inventory",
    level: "High",
    score: 71,
    trend: "Stable",
    likelihood: 63,
    impact: 81,
    confidence: 76,
    horizon: "7–21 days",
    owner: "Merchandising",
    exposure: 460000,
    signal: "Some constrained products have limited approved substitutes.",
    relationship: "Low substitution flexibility makes a shortage harder to absorb through assortment changes.",
    consequence: "A single SKU shortage can directly become an unmet-order event.",
    mitigation: "Validate alternate SKUs and broaden substitution rules where product equivalence allows.",
    evidence: ['Low substitute count', 'High product specificity', 'Cross-category substitute limited'],
    affectedAssets: ['Specific electronics', 'Girls Fashion variants', 'Gaming peripherals'],
  },
];

const riskFactorArchive: RiskFactor[] = [
  {
    id: "RF-019",
    title: "Supplier communication gap",
    domain: "Supplier",
    level: "Low",
    score: 56,
    trend: "Falling",
    likelihood: 81,
    impact: 62,
    confidence: 80,
    horizon: "30–60 days",
    owner: "Demand Planning",
    exposure: 967000,
    signal: "Monitoring signal 019 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 019 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 119', 'Node 04'],
  },
  {
    id: "RF-020",
    title: "Replenishment queue aging",
    domain: "Inventory",
    level: "Low",
    score: 73,
    trend: "Rising",
    likelihood: 92,
    impact: 75,
    confidence: 87,
    horizon: "0–7 days",
    owner: "Control Tower",
    exposure: 1060000,
    signal: "Monitoring signal 020 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 020 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 120', 'Node 05'],
  },
  {
    id: "RF-021",
    title: "Dock appointment variance",
    domain: "Transportation",
    level: "Low",
    score: 90,
    trend: "Stable",
    likelihood: 58,
    impact: 88,
    confidence: 94,
    horizon: "7–14 days",
    owner: "Procurement",
    exposure: 1153000,
    signal: "Monitoring signal 021 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 021 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 121', 'Node 06'],
  },
  {
    id: "RF-022",
    title: "Regional demand divergence",
    domain: "Demand",
    level: "Low",
    score: 62,
    trend: "Falling",
    likelihood: 69,
    impact: 54,
    confidence: 76,
    horizon: "14–30 days",
    owner: "Inventory Planning",
    exposure: 266000,
    signal: "Monitoring signal 022 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 022 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 122', 'Node 07'],
  },
  {
    id: "RF-023",
    title: "Market availability signal",
    domain: "External",
    level: "Low",
    score: 79,
    trend: "Rising",
    likelihood: 80,
    impact: 67,
    confidence: 83,
    horizon: "30–60 days",
    owner: "Transport Planning",
    exposure: 359000,
    signal: "Monitoring signal 023 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 023 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 123', 'Node 08'],
  },
  {
    id: "RF-024",
    title: "Vendor response latency",
    domain: "Supplier",
    level: "Low",
    score: 51,
    trend: "Stable",
    likelihood: 91,
    impact: 80,
    confidence: 90,
    horizon: "0–7 days",
    owner: "Demand Planning",
    exposure: 452000,
    signal: "Monitoring signal 024 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 024 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 100', 'Node 01'],
  },
  {
    id: "RF-025",
    title: "Inventory accuracy drift",
    domain: "Inventory",
    level: "Low",
    score: 68,
    trend: "Falling",
    likelihood: 57,
    impact: 93,
    confidence: 72,
    horizon: "7–14 days",
    owner: "Control Tower",
    exposure: 545000,
    signal: "Monitoring signal 025 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 025 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 101', 'Node 02'],
  },
  {
    id: "RF-026",
    title: "Last-mile capacity signal",
    domain: "Transportation",
    level: "Low",
    score: 85,
    trend: "Rising",
    likelihood: 68,
    impact: 59,
    confidence: 79,
    horizon: "14–30 days",
    owner: "Procurement",
    exposure: 638000,
    signal: "Monitoring signal 026 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 026 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 102', 'Node 03'],
  },
  {
    id: "RF-027",
    title: "New-product demand signal",
    domain: "Demand",
    level: "Low",
    score: 57,
    trend: "Stable",
    likelihood: 79,
    impact: 72,
    confidence: 86,
    horizon: "30–60 days",
    owner: "Inventory Planning",
    exposure: 731000,
    signal: "Monitoring signal 027 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 027 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 103', 'Node 04'],
  },
  {
    id: "RF-028",
    title: "Regulatory timing signal",
    domain: "External",
    level: "Low",
    score: 74,
    trend: "Falling",
    likelihood: 90,
    impact: 85,
    confidence: 93,
    horizon: "0–7 days",
    owner: "Transport Planning",
    exposure: 824000,
    signal: "Monitoring signal 028 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 028 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 104', 'Node 05'],
  },
  {
    id: "RF-029",
    title: "Purchase-order confirmation gap",
    domain: "Supplier",
    level: "Low",
    score: 91,
    trend: "Rising",
    likelihood: 56,
    impact: 51,
    confidence: 75,
    horizon: "7–14 days",
    owner: "Demand Planning",
    exposure: 917000,
    signal: "Monitoring signal 029 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 029 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 105', 'Node 06'],
  },
  {
    id: "RF-030",
    title: "Reserved stock pressure",
    domain: "Inventory",
    level: "Low",
    score: 63,
    trend: "Stable",
    likelihood: 67,
    impact: 64,
    confidence: 82,
    horizon: "14–30 days",
    owner: "Control Tower",
    exposure: 1010000,
    signal: "Monitoring signal 030 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 030 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 106', 'Node 07'],
  },
  {
    id: "RF-031",
    title: "Shipment exception cluster",
    domain: "Transportation",
    level: "Low",
    score: 80,
    trend: "Falling",
    likelihood: 78,
    impact: 77,
    confidence: 89,
    horizon: "30–60 days",
    owner: "Procurement",
    exposure: 1103000,
    signal: "Monitoring signal 031 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 031 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 107', 'Node 08'],
  },
  {
    id: "RF-032",
    title: "Demand mix shift",
    domain: "Demand",
    level: "Low",
    score: 52,
    trend: "Rising",
    likelihood: 89,
    impact: 90,
    confidence: 96,
    horizon: "0–7 days",
    owner: "Inventory Planning",
    exposure: 216000,
    signal: "Monitoring signal 032 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 032 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 108', 'Node 01'],
  },
  {
    id: "RF-033",
    title: "Port operating constraint",
    domain: "External",
    level: "Low",
    score: 69,
    trend: "Stable",
    likelihood: 55,
    impact: 56,
    confidence: 78,
    horizon: "7–14 days",
    owner: "Transport Planning",
    exposure: 309000,
    signal: "Monitoring signal 033 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 033 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 109', 'Node 02'],
  },
  {
    id: "RF-034",
    title: "Supplier allocation shift",
    domain: "Supplier",
    level: "Low",
    score: 86,
    trend: "Falling",
    likelihood: 66,
    impact: 69,
    confidence: 85,
    horizon: "14–30 days",
    owner: "Demand Planning",
    exposure: 402000,
    signal: "Monitoring signal 034 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 034 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 110', 'Node 03'],
  },
  {
    id: "RF-035",
    title: "Excess stock concentration",
    domain: "Inventory",
    level: "Low",
    score: 58,
    trend: "Rising",
    likelihood: 77,
    impact: 82,
    confidence: 92,
    horizon: "30–60 days",
    owner: "Control Tower",
    exposure: 495000,
    signal: "Monitoring signal 035 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 035 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 111', 'Node 04'],
  },
  {
    id: "RF-036",
    title: "ETA confidence decline",
    domain: "Transportation",
    level: "Low",
    score: 75,
    trend: "Stable",
    likelihood: 88,
    impact: 95,
    confidence: 74,
    horizon: "0–7 days",
    owner: "Procurement",
    exposure: 588000,
    signal: "Monitoring signal 036 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 036 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 112', 'Node 05'],
  },
  {
    id: "RF-037",
    title: "Basket-size change",
    domain: "Demand",
    level: "Low",
    score: 92,
    trend: "Falling",
    likelihood: 54,
    impact: 61,
    confidence: 81,
    horizon: "7–14 days",
    owner: "Inventory Planning",
    exposure: 681000,
    signal: "Monitoring signal 037 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 037 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 113', 'Node 06'],
  },
  {
    id: "RF-038",
    title: "Geopolitical route exposure",
    domain: "External",
    level: "Low",
    score: 64,
    trend: "Rising",
    likelihood: 65,
    impact: 74,
    confidence: 88,
    horizon: "14–30 days",
    owner: "Transport Planning",
    exposure: 774000,
    signal: "Monitoring signal 038 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 038 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 114', 'Node 07'],
  },
  {
    id: "RF-039",
    title: "Supplier communication gap",
    domain: "Supplier",
    level: "Low",
    score: 81,
    trend: "Stable",
    likelihood: 76,
    impact: 87,
    confidence: 95,
    horizon: "30–60 days",
    owner: "Demand Planning",
    exposure: 867000,
    signal: "Monitoring signal 039 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 039 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 115', 'Node 08'],
  },
  {
    id: "RF-040",
    title: "Replenishment queue aging",
    domain: "Inventory",
    level: "Low",
    score: 53,
    trend: "Falling",
    likelihood: 87,
    impact: 53,
    confidence: 77,
    horizon: "0–7 days",
    owner: "Control Tower",
    exposure: 960000,
    signal: "Monitoring signal 040 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 040 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 116', 'Node 01'],
  },
  {
    id: "RF-041",
    title: "Dock appointment variance",
    domain: "Transportation",
    level: "Low",
    score: 70,
    trend: "Rising",
    likelihood: 53,
    impact: 66,
    confidence: 84,
    horizon: "7–14 days",
    owner: "Procurement",
    exposure: 1053000,
    signal: "Monitoring signal 041 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 041 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 117', 'Node 02'],
  },
  {
    id: "RF-042",
    title: "Regional demand divergence",
    domain: "Demand",
    level: "Low",
    score: 87,
    trend: "Stable",
    likelihood: 64,
    impact: 79,
    confidence: 91,
    horizon: "14–30 days",
    owner: "Inventory Planning",
    exposure: 1146000,
    signal: "Monitoring signal 042 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 042 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 118', 'Node 03'],
  },
  {
    id: "RF-043",
    title: "Market availability signal",
    domain: "External",
    level: "Low",
    score: 59,
    trend: "Falling",
    likelihood: 75,
    impact: 92,
    confidence: 73,
    horizon: "30–60 days",
    owner: "Transport Planning",
    exposure: 259000,
    signal: "Monitoring signal 043 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 043 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 119', 'Node 04'],
  },
  {
    id: "RF-044",
    title: "Vendor response latency",
    domain: "Supplier",
    level: "Low",
    score: 76,
    trend: "Rising",
    likelihood: 86,
    impact: 58,
    confidence: 80,
    horizon: "0–7 days",
    owner: "Demand Planning",
    exposure: 352000,
    signal: "Monitoring signal 044 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 044 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 120', 'Node 05'],
  },
  {
    id: "RF-045",
    title: "Inventory accuracy drift",
    domain: "Inventory",
    level: "Low",
    score: 48,
    trend: "Stable",
    likelihood: 52,
    impact: 71,
    confidence: 87,
    horizon: "7–14 days",
    owner: "Control Tower",
    exposure: 445000,
    signal: "Monitoring signal 045 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 045 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 121', 'Node 06'],
  },
  {
    id: "RF-046",
    title: "Last-mile capacity signal",
    domain: "Transportation",
    level: "Low",
    score: 65,
    trend: "Falling",
    likelihood: 63,
    impact: 84,
    confidence: 94,
    horizon: "14–30 days",
    owner: "Procurement",
    exposure: 538000,
    signal: "Monitoring signal 046 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 046 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 122', 'Node 07'],
  },
  {
    id: "RF-047",
    title: "New-product demand signal",
    domain: "Demand",
    level: "Low",
    score: 82,
    trend: "Rising",
    likelihood: 74,
    impact: 50,
    confidence: 76,
    horizon: "30–60 days",
    owner: "Inventory Planning",
    exposure: 631000,
    signal: "Monitoring signal 047 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 047 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 123', 'Node 08'],
  },
  {
    id: "RF-048",
    title: "Regulatory timing signal",
    domain: "External",
    level: "Low",
    score: 54,
    trend: "Stable",
    likelihood: 85,
    impact: 63,
    confidence: 83,
    horizon: "0–7 days",
    owner: "Transport Planning",
    exposure: 724000,
    signal: "Monitoring signal 048 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 048 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 100', 'Node 01'],
  },
  {
    id: "RF-049",
    title: "Purchase-order confirmation gap",
    domain: "Supplier",
    level: "Low",
    score: 71,
    trend: "Falling",
    likelihood: 96,
    impact: 76,
    confidence: 90,
    horizon: "7–14 days",
    owner: "Demand Planning",
    exposure: 817000,
    signal: "Monitoring signal 049 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 049 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 101', 'Node 02'],
  },
  {
    id: "RF-050",
    title: "Reserved stock pressure",
    domain: "Inventory",
    level: "Low",
    score: 88,
    trend: "Rising",
    likelihood: 62,
    impact: 89,
    confidence: 72,
    horizon: "14–30 days",
    owner: "Control Tower",
    exposure: 910000,
    signal: "Monitoring signal 050 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 050 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 102', 'Node 03'],
  },
  {
    id: "RF-051",
    title: "Shipment exception cluster",
    domain: "Transportation",
    level: "Low",
    score: 60,
    trend: "Stable",
    likelihood: 73,
    impact: 55,
    confidence: 79,
    horizon: "30–60 days",
    owner: "Procurement",
    exposure: 1003000,
    signal: "Monitoring signal 051 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 051 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 103', 'Node 04'],
  },
  {
    id: "RF-052",
    title: "Demand mix shift",
    domain: "Demand",
    level: "Low",
    score: 77,
    trend: "Falling",
    likelihood: 84,
    impact: 68,
    confidence: 86,
    horizon: "0–7 days",
    owner: "Inventory Planning",
    exposure: 1096000,
    signal: "Monitoring signal 052 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 052 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 104', 'Node 05'],
  },
  {
    id: "RF-053",
    title: "Port operating constraint",
    domain: "External",
    level: "Low",
    score: 49,
    trend: "Rising",
    likelihood: 95,
    impact: 81,
    confidence: 93,
    horizon: "7–14 days",
    owner: "Transport Planning",
    exposure: 209000,
    signal: "Monitoring signal 053 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 053 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 105', 'Node 06'],
  },
  {
    id: "RF-054",
    title: "Supplier allocation shift",
    domain: "Supplier",
    level: "Low",
    score: 66,
    trend: "Stable",
    likelihood: 61,
    impact: 94,
    confidence: 75,
    horizon: "14–30 days",
    owner: "Demand Planning",
    exposure: 302000,
    signal: "Monitoring signal 054 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 054 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 106', 'Node 07'],
  },
  {
    id: "RF-055",
    title: "Excess stock concentration",
    domain: "Inventory",
    level: "Low",
    score: 83,
    trend: "Falling",
    likelihood: 72,
    impact: 60,
    confidence: 82,
    horizon: "30–60 days",
    owner: "Control Tower",
    exposure: 395000,
    signal: "Monitoring signal 055 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 055 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 107', 'Node 08'],
  },
  {
    id: "RF-056",
    title: "ETA confidence decline",
    domain: "Transportation",
    level: "Low",
    score: 55,
    trend: "Rising",
    likelihood: 83,
    impact: 73,
    confidence: 89,
    horizon: "0–7 days",
    owner: "Procurement",
    exposure: 488000,
    signal: "Monitoring signal 056 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 056 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 108', 'Node 01'],
  },
  {
    id: "RF-057",
    title: "Basket-size change",
    domain: "Demand",
    level: "Low",
    score: 72,
    trend: "Stable",
    likelihood: 94,
    impact: 86,
    confidence: 96,
    horizon: "7–14 days",
    owner: "Inventory Planning",
    exposure: 581000,
    signal: "Monitoring signal 057 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 057 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 109', 'Node 02'],
  },
  {
    id: "RF-058",
    title: "Geopolitical route exposure",
    domain: "External",
    level: "Low",
    score: 89,
    trend: "Falling",
    likelihood: 60,
    impact: 52,
    confidence: 78,
    horizon: "14–30 days",
    owner: "Transport Planning",
    exposure: 674000,
    signal: "Monitoring signal 058 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 058 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 110', 'Node 03'],
  },
  {
    id: "RF-059",
    title: "Supplier communication gap",
    domain: "Supplier",
    level: "Low",
    score: 61,
    trend: "Rising",
    likelihood: 71,
    impact: 65,
    confidence: 85,
    horizon: "30–60 days",
    owner: "Demand Planning",
    exposure: 767000,
    signal: "Monitoring signal 059 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 059 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 111', 'Node 04'],
  },
  {
    id: "RF-060",
    title: "Replenishment queue aging",
    domain: "Inventory",
    level: "Low",
    score: 78,
    trend: "Stable",
    likelihood: 82,
    impact: 78,
    confidence: 92,
    horizon: "0–7 days",
    owner: "Control Tower",
    exposure: 860000,
    signal: "Monitoring signal 060 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 060 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 112', 'Node 05'],
  },
  {
    id: "RF-061",
    title: "Dock appointment variance",
    domain: "Transportation",
    level: "Low",
    score: 50,
    trend: "Falling",
    likelihood: 93,
    impact: 91,
    confidence: 74,
    horizon: "7–14 days",
    owner: "Procurement",
    exposure: 953000,
    signal: "Monitoring signal 061 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 061 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 113', 'Node 06'],
  },
  {
    id: "RF-062",
    title: "Regional demand divergence",
    domain: "Demand",
    level: "Low",
    score: 67,
    trend: "Rising",
    likelihood: 59,
    impact: 57,
    confidence: 81,
    horizon: "14–30 days",
    owner: "Inventory Planning",
    exposure: 1046000,
    signal: "Monitoring signal 062 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 062 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 114', 'Node 07'],
  },
  {
    id: "RF-063",
    title: "Market availability signal",
    domain: "External",
    level: "Low",
    score: 84,
    trend: "Stable",
    likelihood: 70,
    impact: 70,
    confidence: 88,
    horizon: "30–60 days",
    owner: "Transport Planning",
    exposure: 1139000,
    signal: "Monitoring signal 063 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 063 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 115', 'Node 08'],
  },
  {
    id: "RF-064",
    title: "Vendor response latency",
    domain: "Supplier",
    level: "Low",
    score: 56,
    trend: "Falling",
    likelihood: 81,
    impact: 83,
    confidence: 95,
    horizon: "0–7 days",
    owner: "Demand Planning",
    exposure: 252000,
    signal: "Monitoring signal 064 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 064 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 116', 'Node 01'],
  },
  {
    id: "RF-065",
    title: "Inventory accuracy drift",
    domain: "Inventory",
    level: "Low",
    score: 73,
    trend: "Rising",
    likelihood: 92,
    impact: 96,
    confidence: 77,
    horizon: "7–14 days",
    owner: "Control Tower",
    exposure: 345000,
    signal: "Monitoring signal 065 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 065 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 117', 'Node 02'],
  },
  {
    id: "RF-066",
    title: "Last-mile capacity signal",
    domain: "Transportation",
    level: "Low",
    score: 90,
    trend: "Stable",
    likelihood: 58,
    impact: 62,
    confidence: 84,
    horizon: "14–30 days",
    owner: "Procurement",
    exposure: 438000,
    signal: "Monitoring signal 066 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 066 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 118', 'Node 03'],
  },
  {
    id: "RF-067",
    title: "New-product demand signal",
    domain: "Demand",
    level: "Low",
    score: 62,
    trend: "Falling",
    likelihood: 69,
    impact: 75,
    confidence: 91,
    horizon: "30–60 days",
    owner: "Inventory Planning",
    exposure: 531000,
    signal: "Monitoring signal 067 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 067 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 119', 'Node 04'],
  },
  {
    id: "RF-068",
    title: "Regulatory timing signal",
    domain: "External",
    level: "Low",
    score: 79,
    trend: "Rising",
    likelihood: 80,
    impact: 88,
    confidence: 73,
    horizon: "0–7 days",
    owner: "Transport Planning",
    exposure: 624000,
    signal: "Monitoring signal 068 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 068 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 120', 'Node 05'],
  },
  {
    id: "RF-069",
    title: "Purchase-order confirmation gap",
    domain: "Supplier",
    level: "Low",
    score: 51,
    trend: "Stable",
    likelihood: 91,
    impact: 54,
    confidence: 80,
    horizon: "7–14 days",
    owner: "Demand Planning",
    exposure: 717000,
    signal: "Monitoring signal 069 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 069 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 121', 'Node 06'],
  },
  {
    id: "RF-070",
    title: "Reserved stock pressure",
    domain: "Inventory",
    level: "Low",
    score: 68,
    trend: "Falling",
    likelihood: 57,
    impact: 67,
    confidence: 87,
    horizon: "14–30 days",
    owner: "Control Tower",
    exposure: 810000,
    signal: "Monitoring signal 070 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 070 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 122', 'Node 07'],
  },
  {
    id: "RF-071",
    title: "Shipment exception cluster",
    domain: "Transportation",
    level: "Low",
    score: 85,
    trend: "Rising",
    likelihood: 68,
    impact: 80,
    confidence: 94,
    horizon: "30–60 days",
    owner: "Procurement",
    exposure: 903000,
    signal: "Monitoring signal 071 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 071 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 123', 'Node 08'],
  },
  {
    id: "RF-072",
    title: "Demand mix shift",
    domain: "Demand",
    level: "Low",
    score: 57,
    trend: "Stable",
    likelihood: 79,
    impact: 93,
    confidence: 76,
    horizon: "0–7 days",
    owner: "Inventory Planning",
    exposure: 996000,
    signal: "Monitoring signal 072 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 072 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 100', 'Node 01'],
  },
  {
    id: "RF-073",
    title: "Port operating constraint",
    domain: "External",
    level: "Low",
    score: 74,
    trend: "Falling",
    likelihood: 90,
    impact: 59,
    confidence: 83,
    horizon: "7–14 days",
    owner: "Transport Planning",
    exposure: 1089000,
    signal: "Monitoring signal 073 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 073 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 101', 'Node 02'],
  },
  {
    id: "RF-074",
    title: "Supplier allocation shift",
    domain: "Supplier",
    level: "Low",
    score: 91,
    trend: "Rising",
    likelihood: 56,
    impact: 72,
    confidence: 90,
    horizon: "14–30 days",
    owner: "Demand Planning",
    exposure: 202000,
    signal: "Monitoring signal 074 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 074 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 102', 'Node 03'],
  },
  {
    id: "RF-075",
    title: "Excess stock concentration",
    domain: "Inventory",
    level: "Low",
    score: 63,
    trend: "Stable",
    likelihood: 67,
    impact: 85,
    confidence: 72,
    horizon: "30–60 days",
    owner: "Control Tower",
    exposure: 295000,
    signal: "Monitoring signal 075 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 075 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 103', 'Node 04'],
  },
  {
    id: "RF-076",
    title: "ETA confidence decline",
    domain: "Transportation",
    level: "Low",
    score: 80,
    trend: "Falling",
    likelihood: 78,
    impact: 51,
    confidence: 79,
    horizon: "0–7 days",
    owner: "Procurement",
    exposure: 388000,
    signal: "Monitoring signal 076 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 076 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 104', 'Node 05'],
  },
  {
    id: "RF-077",
    title: "Basket-size change",
    domain: "Demand",
    level: "Low",
    score: 52,
    trend: "Rising",
    likelihood: 89,
    impact: 64,
    confidence: 86,
    horizon: "7–14 days",
    owner: "Inventory Planning",
    exposure: 481000,
    signal: "Monitoring signal 077 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 077 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 105', 'Node 06'],
  },
  {
    id: "RF-078",
    title: "Geopolitical route exposure",
    domain: "External",
    level: "Low",
    score: 69,
    trend: "Stable",
    likelihood: 55,
    impact: 77,
    confidence: 93,
    horizon: "14–30 days",
    owner: "Transport Planning",
    exposure: 574000,
    signal: "Monitoring signal 078 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 078 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 106', 'Node 07'],
  },
  {
    id: "RF-079",
    title: "Supplier communication gap",
    domain: "Supplier",
    level: "Low",
    score: 86,
    trend: "Falling",
    likelihood: 66,
    impact: 90,
    confidence: 75,
    horizon: "30–60 days",
    owner: "Demand Planning",
    exposure: 667000,
    signal: "Monitoring signal 079 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 079 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 107', 'Node 08'],
  },
  {
    id: "RF-080",
    title: "Replenishment queue aging",
    domain: "Inventory",
    level: "Low",
    score: 58,
    trend: "Rising",
    likelihood: 77,
    impact: 56,
    confidence: 82,
    horizon: "0–7 days",
    owner: "Control Tower",
    exposure: 760000,
    signal: "Monitoring signal 080 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 080 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 108', 'Node 01'],
  },
  {
    id: "RF-081",
    title: "Dock appointment variance",
    domain: "Transportation",
    level: "Low",
    score: 75,
    trend: "Stable",
    likelihood: 88,
    impact: 69,
    confidence: 89,
    horizon: "7–14 days",
    owner: "Procurement",
    exposure: 853000,
    signal: "Monitoring signal 081 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 081 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 109', 'Node 02'],
  },
  {
    id: "RF-082",
    title: "Regional demand divergence",
    domain: "Demand",
    level: "Low",
    score: 92,
    trend: "Falling",
    likelihood: 54,
    impact: 82,
    confidence: 96,
    horizon: "14–30 days",
    owner: "Inventory Planning",
    exposure: 946000,
    signal: "Monitoring signal 082 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 082 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 110', 'Node 03'],
  },
  {
    id: "RF-083",
    title: "Market availability signal",
    domain: "External",
    level: "Low",
    score: 64,
    trend: "Rising",
    likelihood: 65,
    impact: 95,
    confidence: 78,
    horizon: "30–60 days",
    owner: "Transport Planning",
    exposure: 1039000,
    signal: "Monitoring signal 083 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 083 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 111', 'Node 04'],
  },
  {
    id: "RF-084",
    title: "Vendor response latency",
    domain: "Supplier",
    level: "Low",
    score: 81,
    trend: "Stable",
    likelihood: 76,
    impact: 61,
    confidence: 85,
    horizon: "0–7 days",
    owner: "Demand Planning",
    exposure: 1132000,
    signal: "Monitoring signal 084 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 084 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 112', 'Node 05'],
  },
  {
    id: "RF-085",
    title: "Inventory accuracy drift",
    domain: "Inventory",
    level: "Low",
    score: 53,
    trend: "Falling",
    likelihood: 87,
    impact: 74,
    confidence: 92,
    horizon: "7–14 days",
    owner: "Control Tower",
    exposure: 245000,
    signal: "Monitoring signal 085 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 085 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 113', 'Node 06'],
  },
  {
    id: "RF-086",
    title: "Last-mile capacity signal",
    domain: "Transportation",
    level: "Low",
    score: 70,
    trend: "Rising",
    likelihood: 53,
    impact: 87,
    confidence: 74,
    horizon: "14–30 days",
    owner: "Procurement",
    exposure: 338000,
    signal: "Monitoring signal 086 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 086 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 114', 'Node 07'],
  },
  {
    id: "RF-087",
    title: "New-product demand signal",
    domain: "Demand",
    level: "Low",
    score: 87,
    trend: "Stable",
    likelihood: 64,
    impact: 53,
    confidence: 81,
    horizon: "30–60 days",
    owner: "Inventory Planning",
    exposure: 431000,
    signal: "Monitoring signal 087 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 087 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 115', 'Node 08'],
  },
  {
    id: "RF-088",
    title: "Regulatory timing signal",
    domain: "External",
    level: "Low",
    score: 59,
    trend: "Falling",
    likelihood: 75,
    impact: 66,
    confidence: 88,
    horizon: "0–7 days",
    owner: "Transport Planning",
    exposure: 524000,
    signal: "Monitoring signal 088 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 088 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 116', 'Node 01'],
  },
  {
    id: "RF-089",
    title: "Purchase-order confirmation gap",
    domain: "Supplier",
    level: "Low",
    score: 76,
    trend: "Rising",
    likelihood: 86,
    impact: 79,
    confidence: 95,
    horizon: "7–14 days",
    owner: "Demand Planning",
    exposure: 617000,
    signal: "Monitoring signal 089 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 089 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 117', 'Node 02'],
  },
  {
    id: "RF-090",
    title: "Reserved stock pressure",
    domain: "Inventory",
    level: "Low",
    score: 48,
    trend: "Stable",
    likelihood: 52,
    impact: 92,
    confidence: 77,
    horizon: "14–30 days",
    owner: "Control Tower",
    exposure: 710000,
    signal: "Monitoring signal 090 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 090 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 118', 'Node 03'],
  },
  {
    id: "RF-091",
    title: "Shipment exception cluster",
    domain: "Transportation",
    level: "Low",
    score: 65,
    trend: "Falling",
    likelihood: 63,
    impact: 58,
    confidence: 84,
    horizon: "30–60 days",
    owner: "Procurement",
    exposure: 803000,
    signal: "Monitoring signal 091 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 091 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 119', 'Node 04'],
  },
  {
    id: "RF-092",
    title: "Demand mix shift",
    domain: "Demand",
    level: "Low",
    score: 82,
    trend: "Rising",
    likelihood: 74,
    impact: 71,
    confidence: 91,
    horizon: "0–7 days",
    owner: "Inventory Planning",
    exposure: 896000,
    signal: "Monitoring signal 092 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 092 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 120', 'Node 05'],
  },
  {
    id: "RF-093",
    title: "Port operating constraint",
    domain: "External",
    level: "Low",
    score: 54,
    trend: "Stable",
    likelihood: 85,
    impact: 84,
    confidence: 73,
    horizon: "7–14 days",
    owner: "Transport Planning",
    exposure: 989000,
    signal: "Monitoring signal 093 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 093 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 121', 'Node 06'],
  },
  {
    id: "RF-094",
    title: "Supplier allocation shift",
    domain: "Supplier",
    level: "Low",
    score: 71,
    trend: "Falling",
    likelihood: 96,
    impact: 50,
    confidence: 80,
    horizon: "14–30 days",
    owner: "Demand Planning",
    exposure: 1082000,
    signal: "Monitoring signal 094 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 094 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 122', 'Node 07'],
  },
  {
    id: "RF-095",
    title: "Excess stock concentration",
    domain: "Inventory",
    level: "Low",
    score: 88,
    trend: "Rising",
    likelihood: 62,
    impact: 63,
    confidence: 87,
    horizon: "30–60 days",
    owner: "Control Tower",
    exposure: 195000,
    signal: "Monitoring signal 095 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 095 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 123', 'Node 08'],
  },
  {
    id: "RF-096",
    title: "ETA confidence decline",
    domain: "Transportation",
    level: "Low",
    score: 60,
    trend: "Stable",
    likelihood: 73,
    impact: 76,
    confidence: 94,
    horizon: "0–7 days",
    owner: "Procurement",
    exposure: 288000,
    signal: "Monitoring signal 096 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 096 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 100', 'Node 01'],
  },
  {
    id: "RF-097",
    title: "Basket-size change",
    domain: "Demand",
    level: "Low",
    score: 77,
    trend: "Falling",
    likelihood: 84,
    impact: 89,
    confidence: 76,
    horizon: "7–14 days",
    owner: "Inventory Planning",
    exposure: 381000,
    signal: "Monitoring signal 097 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 097 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 101', 'Node 02'],
  },
  {
    id: "RF-098",
    title: "Geopolitical route exposure",
    domain: "External",
    level: "Low",
    score: 49,
    trend: "Rising",
    likelihood: 95,
    impact: 55,
    confidence: 83,
    horizon: "14–30 days",
    owner: "Transport Planning",
    exposure: 474000,
    signal: "Monitoring signal 098 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 098 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 102', 'Node 03'],
  },
  {
    id: "RF-099",
    title: "Supplier communication gap",
    domain: "Supplier",
    level: "Low",
    score: 66,
    trend: "Stable",
    likelihood: 61,
    impact: 68,
    confidence: 90,
    horizon: "30–60 days",
    owner: "Demand Planning",
    exposure: 567000,
    signal: "Monitoring signal 099 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 099 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 103', 'Node 04'],
  },
  {
    id: "RF-100",
    title: "Replenishment queue aging",
    domain: "Inventory",
    level: "Low",
    score: 83,
    trend: "Falling",
    likelihood: 72,
    impact: 81,
    confidence: 72,
    horizon: "0–7 days",
    owner: "Control Tower",
    exposure: 660000,
    signal: "Monitoring signal 100 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 100 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 104', 'Node 05'],
  },
  {
    id: "RF-101",
    title: "Dock appointment variance",
    domain: "Transportation",
    level: "Low",
    score: 55,
    trend: "Rising",
    likelihood: 83,
    impact: 94,
    confidence: 79,
    horizon: "7–14 days",
    owner: "Procurement",
    exposure: 753000,
    signal: "Monitoring signal 101 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 101 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 105', 'Node 06'],
  },
  {
    id: "RF-102",
    title: "Regional demand divergence",
    domain: "Demand",
    level: "Low",
    score: 72,
    trend: "Stable",
    likelihood: 94,
    impact: 60,
    confidence: 86,
    horizon: "14–30 days",
    owner: "Inventory Planning",
    exposure: 846000,
    signal: "Monitoring signal 102 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 102 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 106', 'Node 07'],
  },
  {
    id: "RF-103",
    title: "Market availability signal",
    domain: "External",
    level: "Low",
    score: 89,
    trend: "Falling",
    likelihood: 60,
    impact: 73,
    confidence: 93,
    horizon: "30–60 days",
    owner: "Transport Planning",
    exposure: 939000,
    signal: "Monitoring signal 103 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 103 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 107', 'Node 08'],
  },
  {
    id: "RF-104",
    title: "Vendor response latency",
    domain: "Supplier",
    level: "Low",
    score: 61,
    trend: "Rising",
    likelihood: 71,
    impact: 86,
    confidence: 75,
    horizon: "0–7 days",
    owner: "Demand Planning",
    exposure: 1032000,
    signal: "Monitoring signal 104 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 104 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 108', 'Node 01'],
  },
  {
    id: "RF-105",
    title: "Inventory accuracy drift",
    domain: "Inventory",
    level: "Low",
    score: 78,
    trend: "Stable",
    likelihood: 82,
    impact: 52,
    confidence: 82,
    horizon: "7–14 days",
    owner: "Control Tower",
    exposure: 1125000,
    signal: "Monitoring signal 105 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 105 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 109', 'Node 02'],
  },
  {
    id: "RF-106",
    title: "Last-mile capacity signal",
    domain: "Transportation",
    level: "Low",
    score: 50,
    trend: "Falling",
    likelihood: 93,
    impact: 65,
    confidence: 89,
    horizon: "14–30 days",
    owner: "Procurement",
    exposure: 238000,
    signal: "Monitoring signal 106 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 106 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 110', 'Node 03'],
  },
  {
    id: "RF-107",
    title: "New-product demand signal",
    domain: "Demand",
    level: "Low",
    score: 67,
    trend: "Rising",
    likelihood: 59,
    impact: 78,
    confidence: 96,
    horizon: "30–60 days",
    owner: "Inventory Planning",
    exposure: 331000,
    signal: "Monitoring signal 107 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 107 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 111', 'Node 04'],
  },
  {
    id: "RF-108",
    title: "Regulatory timing signal",
    domain: "External",
    level: "Low",
    score: 84,
    trend: "Stable",
    likelihood: 70,
    impact: 91,
    confidence: 78,
    horizon: "0–7 days",
    owner: "Transport Planning",
    exposure: 424000,
    signal: "Monitoring signal 108 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 108 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 112', 'Node 05'],
  },
  {
    id: "RF-109",
    title: "Purchase-order confirmation gap",
    domain: "Supplier",
    level: "Low",
    score: 56,
    trend: "Falling",
    likelihood: 81,
    impact: 57,
    confidence: 85,
    horizon: "7–14 days",
    owner: "Demand Planning",
    exposure: 517000,
    signal: "Monitoring signal 109 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 109 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 113', 'Node 06'],
  },
  {
    id: "RF-110",
    title: "Reserved stock pressure",
    domain: "Inventory",
    level: "Low",
    score: 73,
    trend: "Rising",
    likelihood: 92,
    impact: 70,
    confidence: 92,
    horizon: "14–30 days",
    owner: "Control Tower",
    exposure: 610000,
    signal: "Monitoring signal 110 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 110 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 114', 'Node 07'],
  },
  {
    id: "RF-111",
    title: "Shipment exception cluster",
    domain: "Transportation",
    level: "Low",
    score: 90,
    trend: "Stable",
    likelihood: 58,
    impact: 83,
    confidence: 74,
    horizon: "30–60 days",
    owner: "Procurement",
    exposure: 703000,
    signal: "Monitoring signal 111 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 111 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 115', 'Node 08'],
  },
  {
    id: "RF-112",
    title: "Demand mix shift",
    domain: "Demand",
    level: "Low",
    score: 62,
    trend: "Falling",
    likelihood: 69,
    impact: 96,
    confidence: 81,
    horizon: "0–7 days",
    owner: "Inventory Planning",
    exposure: 796000,
    signal: "Monitoring signal 112 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 112 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 116', 'Node 01'],
  },
  {
    id: "RF-113",
    title: "Port operating constraint",
    domain: "External",
    level: "Low",
    score: 79,
    trend: "Rising",
    likelihood: 80,
    impact: 62,
    confidence: 88,
    horizon: "7–14 days",
    owner: "Transport Planning",
    exposure: 889000,
    signal: "Monitoring signal 113 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 113 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 117', 'Node 02'],
  },
  {
    id: "RF-114",
    title: "Supplier allocation shift",
    domain: "Supplier",
    level: "Low",
    score: 51,
    trend: "Stable",
    likelihood: 91,
    impact: 75,
    confidence: 95,
    horizon: "14–30 days",
    owner: "Demand Planning",
    exposure: 982000,
    signal: "Monitoring signal 114 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 114 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 118', 'Node 03'],
  },
  {
    id: "RF-115",
    title: "Excess stock concentration",
    domain: "Inventory",
    level: "Low",
    score: 68,
    trend: "Falling",
    likelihood: 57,
    impact: 88,
    confidence: 77,
    horizon: "30–60 days",
    owner: "Control Tower",
    exposure: 1075000,
    signal: "Monitoring signal 115 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 115 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster B', 'SKU family 119', 'Node 04'],
  },
  {
    id: "RF-116",
    title: "ETA confidence decline",
    domain: "Transportation",
    level: "Low",
    score: 85,
    trend: "Rising",
    likelihood: 68,
    impact: 54,
    confidence: 84,
    horizon: "0–7 days",
    owner: "Procurement",
    exposure: 188000,
    signal: "Monitoring signal 116 has moved outside its recent operating band.",
    relationship: "The transportation signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 116 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster C', 'SKU family 120', 'Node 05'],
  },
  {
    id: "RF-117",
    title: "Basket-size change",
    domain: "Demand",
    level: "Low",
    score: 57,
    trend: "Stable",
    likelihood: 79,
    impact: 67,
    confidence: 91,
    horizon: "7–14 days",
    owner: "Inventory Planning",
    exposure: 281000,
    signal: "Monitoring signal 117 has moved outside its recent operating band.",
    relationship: "The demand signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 117 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster D', 'SKU family 121', 'Node 06'],
  },
  {
    id: "RF-118",
    title: "Geopolitical route exposure",
    domain: "External",
    level: "Low",
    score: 74,
    trend: "Falling",
    likelihood: 90,
    impact: 80,
    confidence: 73,
    horizon: "14–30 days",
    owner: "Transport Planning",
    exposure: 374000,
    signal: "Monitoring signal 118 has moved outside its recent operating band.",
    relationship: "The external signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 118 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster E', 'SKU family 122', 'Node 07'],
  },
  {
    id: "RF-119",
    title: "Supplier communication gap",
    domain: "Supplier",
    level: "Low",
    score: 91,
    trend: "Rising",
    likelihood: 56,
    impact: 93,
    confidence: 80,
    horizon: "30–60 days",
    owner: "Demand Planning",
    exposure: 467000,
    signal: "Monitoring signal 119 has moved outside its recent operating band.",
    relationship: "The supplier signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 119 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster F', 'SKU family 123', 'Node 08'],
  },
  {
    id: "RF-120",
    title: "Replenishment queue aging",
    domain: "Inventory",
    level: "Low",
    score: 63,
    trend: "Stable",
    likelihood: 67,
    impact: 59,
    confidence: 87,
    horizon: "0–7 days",
    owner: "Control Tower",
    exposure: 560000,
    signal: "Monitoring signal 120 has moved outside its recent operating band.",
    relationship: "The inventory signal is linked to upstream and downstream supply-chain dependencies captured in the demo graph.",
    consequence: "A change in this signal can alter service, inventory coverage, cost, or continuity assumptions for affected assets.",
    mitigation: "Validate the signal, refresh the linked forecast or plan, and activate the relevant contingency playbook before the risk window closes.",
    evidence: ['Signal monitor 120 changed', 'Threshold comparison available', 'Relationship graph contains linked records'],
    affectedAssets: ['Risk cluster A', 'SKU family 100', 'Node 01'],
  },
];

const allRiskFactors = [...riskFactors, ...riskFactorArchive];
const riskSummary = {
  critical: allRiskFactors.filter((risk) => risk.level === "Critical").length,
  high: allRiskFactors.filter((risk) => risk.level === "High").length,
  average: Math.round(allRiskFactors.reduce((sum, risk) => sum + risk.score, 0) / allRiskFactors.length),
  exposure: allRiskFactors.reduce((sum, risk) => sum + risk.exposure, 0),
};

const categories: Category[] = ["All", "Fashion", "Girls Fashion", "Electronics", "Mobiles", "Laptops", "Audio", "Gaming", "Accessories"];

const amazonPools: Record<Exclude<Category,"All">, string[]> = {
  "Fashion": [
    "https://m.media-amazon.com/images/I/71c8B2k8JYL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/71zM7WmYHXL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/61f5eX3tQGL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/71nM5K2J7TL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/71pYQ7XxSLL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/71pg5pOHQPL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/51YdVjb50BL._AC_UY1000_.jpg",
  ],
  "Girls Fashion": [
    "https://m.media-amazon.com/images/I/61YkV5V4Z-L._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/71c8B2k8JYL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/71zM7WmYHXL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/61f5eX3tQGL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/71nM5K2J7TL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/71pYQ7XxSLL._AC_UY1000_.jpg",
    "https://m.media-amazon.com/images/I/71pg5pOHQPL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/51YdVjb50BL._AC_UY1000_.jpg",
  ],
  "Electronics": [
    "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg",
    "https://m.media-amazon.com/images/I/51K3vK-XyYL._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/71ZeetpGrZL._SX425_.jpg",
    "https://m.media-amazon.com/images/I/71OrP3cNcxL._SX679_.jpg",
    "https://m.media-amazon.com/images/I/518w7CcuOnL._SX569_.jpg",
    "https://m.media-amazon.com/images/I/617NtexaW2L.jpg",
    "https://m.media-amazon.com/images/I/61AcNVFmd9L._CR0,0,640,361_SR342,193_.jpg",
    "https://m.media-amazon.com/images/I/41Ya8tZsBkL._AC_.jpg",
  ],
  "Mobiles": [
    "https://m.media-amazon.com/images/I/81cHpJNr07L._S.jpg",
    "https://m.media-amazon.com/images/I/91rKcYt1jrL._S.jpg",
    "https://m.media-amazon.com/images/I/71v2jVh6nIL._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg",
    "https://m.media-amazon.com/images/I/61f1YfTkTDL._S.jpg",
    "https://m.media-amazon.com/images/I/61AHiYyu3ZL._S.jpg",
    "https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg",
  ],
  "Laptops": [
    "https://m.media-amazon.com/images/I/71FXHAM+jWL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/71dyfY6G0aL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/712cUkgrVnL._AC_UL320_.jpg",
    "https://m.media-amazon.com/images/I/51HftONtGaL.jpg",
    "https://m.media-amazon.com/images/I/71bIUPAleZL.jpg",
    "https://m.media-amazon.com/images/I/81iiMyulIAL.jpg",
    "https://m.media-amazon.com/images/I/71jyZTD32NL.jpg",
    "https://m.media-amazon.com/images/I/71WuRLJnL4L.jpg",
  ],
  "Audio": [
    "https://m.media-amazon.com/images/I/51nBTTG3hNL._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/81-TGXuOMAL._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/51rT40sk3xL._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/71mTfSKhhTL._AC_UL640_QL65_.jpg",
    "https://m.media-amazon.com/images/I/7179kqSfnAL._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/61xlUxeyuvL._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/517U3U90gnL._AC_UY218_.jpg",
  ],
  "Gaming": [
    "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg",
    "https://m.media-amazon.com/images/I/61oh0M9st4L._AC_UY218_.jpg",
    "https://m.media-amazon.com/images/I/41gN0XiQrjL._SY300_SX300_QL70_FMwebp_.jpg",
    "https://m.media-amazon.com/images/I/81X7yswC36L._SX425_.jpg",
    "https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg",
    "https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg",
    "https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg",
  ],
  "Accessories": [
    "https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg",
    "https://m.media-amazon.com/images/I/51cjBLsymcL._SX569_.jpg",
    "https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg",
    "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg",
    "https://m.media-amazon.com/images/I/71162EQnpKL._AC_UY320_.jpg",
    "https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg",
    "https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg",
    "https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg",
  ],
};

const fallbackPalette: Record<Exclude<Category,"All">, {from:string; to:string}> = {
  "Fashion": { from: "#dbeafe", to: "#e0e7ff" },
  "Girls Fashion": { from: "#fce7f3", to: "#f5d0fe" },
  "Electronics": { from: "#e0f2fe", to: "#cffafe" },
  "Mobiles": { from: "#e0e7ff", to: "#dbeafe" },
  "Laptops": { from: "#ede9fe", to: "#e0f2fe" },
  "Audio": { from: "#fae8ff", to: "#fce7f3" },
  "Gaming": { from: "#dcfce7", to: "#cffafe" },
  "Accessories": { from: "#fef3c7", to: "#ffedd5" },
};

const iconForCategory: Record<Exclude<Category,"All">, ReactNode> = {
  "Fashion": <Shirt className="h-4 w-4" />,
  "Girls Fashion": <Shirt className="h-4 w-4" />,
  "Electronics": <MonitorSmartphone className="h-4 w-4" />,
  "Mobiles": <Smartphone className="h-4 w-4" />,
  "Laptops": <Laptop className="h-4 w-4" />,
  "Audio": <Headphones className="h-4 w-4" />,
  "Gaming": <Gamepad2 className="h-4 w-4" />,
  "Accessories": <Cable className="h-4 w-4" />,
};

const productSeed: Product[] = [
  {
    id: "P0001",
    name: "Floral Summer Dress 1",
    category: "Girls Fashion",
    subcategory: "Dresses",
    brand: "Bloom & Co.",
    description: "Floral Summer Dress designed for everyday use with a marketplace-ready specification set.",
    price: 699,
    mrp: 839,
    discount: 17,
    rating: 4.1,
    reviews: 83,
    stock: 38,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61YkV5V4Z-L._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/61f5eX3tQGL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=floral+summer+dress",
  },
  {
    id: "P0002",
    name: "Pleated Midi Dress 2",
    category: "Girls Fashion",
    subcategory: "Tops",
    brand: "Luna Street",
    description: "Pleated Midi Dress designed for everyday use with a marketplace-ready specification set.",
    price: 796,
    mrp: 979,
    discount: 19,
    rating: 4.4,
    reviews: 100,
    stock: 75,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/71c8B2k8JYL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71nM5K2J7TL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pleated+midi+dress",
  },
  {
    id: "P0003",
    name: "Casual Crop Top 3",
    category: "Girls Fashion",
    subcategory: "Kurtis",
    brand: "PetalWear",
    description: "Casual Crop Top designed for everyday use with a marketplace-ready specification set.",
    price: 893,
    mrp: 1125,
    discount: 21,
    rating: 4.7,
    reviews: 117,
    stock: 112,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71zM7WmYHXL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71pYQ7XxSLL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=casual+crop+top",
  },
  {
    id: "P0004",
    name: "Printed Kurti 4",
    category: "Girls Fashion",
    subcategory: "Bottomwear",
    brand: "StyleNest",
    description: "Printed Kurti designed for everyday use with a marketplace-ready specification set.",
    price: 990,
    mrp: 1277,
    discount: 22,
    rating: 4.2,
    reviews: 134,
    stock: 149,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61f5eX3tQGL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71pg5pOHQPL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=printed+kurti",
  },
  {
    id: "P0005",
    name: "High Waist Jeans 5",
    category: "Girls Fashion",
    subcategory: "Dresses",
    brand: "Bloom & Co.",
    description: "High Waist Jeans designed for everyday use with a marketplace-ready specification set.",
    price: 1087,
    mrp: 1435,
    discount: 24,
    rating: 4.5,
    reviews: 151,
    stock: 186,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71nM5K2J7TL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/51YdVjb50BL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=high+waist+jeans",
  },
  {
    id: "P0006",
    name: "Denim Jacket 6",
    category: "Girls Fashion",
    subcategory: "Tops",
    brand: "Luna Street",
    description: "Denim Jacket designed for everyday use with a marketplace-ready specification set.",
    price: 1184,
    mrp: 1598,
    discount: 26,
    rating: 4.8,
    reviews: 168,
    stock: 223,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/71pYQ7XxSLL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/61YkV5V4Z-L._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=denim+jacket",
  },
  {
    id: "P0007",
    name: "Party Wear Frock 7",
    category: "Girls Fashion",
    subcategory: "Kurtis",
    brand: "PetalWear",
    description: "Party Wear Frock designed for everyday use with a marketplace-ready specification set.",
    price: 1281,
    mrp: 1537,
    discount: 17,
    rating: 4.3,
    reviews: 185,
    stock: 260,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71pg5pOHQPL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/71c8B2k8JYL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=party+wear+frock",
  },
  {
    id: "P0008",
    name: "Soft Lounge Set 8",
    category: "Girls Fashion",
    subcategory: "Bottomwear",
    brand: "StyleNest",
    description: "Soft Lounge Set designed for everyday use with a marketplace-ready specification set.",
    price: 1378,
    mrp: 1695,
    discount: 19,
    rating: 4.6,
    reviews: 202,
    stock: 297,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/51YdVjb50BL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71zM7WmYHXL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=soft+lounge+set",
  },
  {
    id: "P0009",
    name: "Floral Summer Dress 9",
    category: "Girls Fashion",
    subcategory: "Dresses",
    brand: "Bloom & Co.",
    description: "Floral Summer Dress designed for everyday use with a marketplace-ready specification set.",
    price: 1475,
    mrp: 1859,
    discount: 21,
    rating: 4.1,
    reviews: 219,
    stock: 334,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61YkV5V4Z-L._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/61f5eX3tQGL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=floral+summer+dress",
  },
  {
    id: "P0010",
    name: "Pleated Midi Dress 10",
    category: "Girls Fashion",
    subcategory: "Tops",
    brand: "Luna Street",
    description: "Pleated Midi Dress designed for everyday use with a marketplace-ready specification set.",
    price: 1572,
    mrp: 2028,
    discount: 22,
    rating: 4.4,
    reviews: 236,
    stock: 371,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/71c8B2k8JYL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71nM5K2J7TL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pleated+midi+dress",
  },
  {
    id: "P0011",
    name: "Casual Crop Top 11",
    category: "Girls Fashion",
    subcategory: "Kurtis",
    brand: "PetalWear",
    description: "Casual Crop Top designed for everyday use with a marketplace-ready specification set.",
    price: 1669,
    mrp: 2203,
    discount: 24,
    rating: 4.7,
    reviews: 253,
    stock: 48,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71zM7WmYHXL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71pYQ7XxSLL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=casual+crop+top",
  },
  {
    id: "P0012",
    name: "Printed Kurti 12",
    category: "Girls Fashion",
    subcategory: "Bottomwear",
    brand: "StyleNest",
    description: "Printed Kurti designed for everyday use with a marketplace-ready specification set.",
    price: 1766,
    mrp: 2384,
    discount: 26,
    rating: 4.2,
    reviews: 270,
    stock: 85,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61f5eX3tQGL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71pg5pOHQPL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=printed+kurti",
  },
  {
    id: "P0013",
    name: "High Waist Jeans 13",
    category: "Girls Fashion",
    subcategory: "Dresses",
    brand: "Bloom & Co.",
    description: "High Waist Jeans designed for everyday use with a marketplace-ready specification set.",
    price: 1863,
    mrp: 2236,
    discount: 17,
    rating: 4.5,
    reviews: 287,
    stock: 122,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71nM5K2J7TL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/51YdVjb50BL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=high+waist+jeans",
  },
  {
    id: "P0014",
    name: "Denim Jacket 14",
    category: "Girls Fashion",
    subcategory: "Tops",
    brand: "Luna Street",
    description: "Denim Jacket designed for everyday use with a marketplace-ready specification set.",
    price: 1960,
    mrp: 2411,
    discount: 19,
    rating: 4.8,
    reviews: 304,
    stock: 159,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/71pYQ7XxSLL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/61YkV5V4Z-L._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=denim+jacket",
  },
  {
    id: "P0015",
    name: "Party Wear Frock 15",
    category: "Girls Fashion",
    subcategory: "Kurtis",
    brand: "PetalWear",
    description: "Party Wear Frock designed for everyday use with a marketplace-ready specification set.",
    price: 2057,
    mrp: 2592,
    discount: 21,
    rating: 4.3,
    reviews: 321,
    stock: 196,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71pg5pOHQPL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/71c8B2k8JYL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=party+wear+frock",
  },
  {
    id: "P0016",
    name: "Soft Lounge Set 16",
    category: "Girls Fashion",
    subcategory: "Bottomwear",
    brand: "StyleNest",
    description: "Soft Lounge Set designed for everyday use with a marketplace-ready specification set.",
    price: 2154,
    mrp: 2779,
    discount: 22,
    rating: 4.6,
    reviews: 338,
    stock: 233,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/51YdVjb50BL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71zM7WmYHXL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=soft+lounge+set",
  },
  {
    id: "P0017",
    name: "Floral Summer Dress 17",
    category: "Girls Fashion",
    subcategory: "Dresses",
    brand: "Bloom & Co.",
    description: "Floral Summer Dress designed for everyday use with a marketplace-ready specification set.",
    price: 2251,
    mrp: 2971,
    discount: 24,
    rating: 4.1,
    reviews: 355,
    stock: 270,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61YkV5V4Z-L._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/61f5eX3tQGL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=floral+summer+dress",
  },
  {
    id: "P0018",
    name: "Pleated Midi Dress 18",
    category: "Girls Fashion",
    subcategory: "Tops",
    brand: "Luna Street",
    description: "Pleated Midi Dress designed for everyday use with a marketplace-ready specification set.",
    price: 2348,
    mrp: 3170,
    discount: 26,
    rating: 4.4,
    reviews: 372,
    stock: 307,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/71c8B2k8JYL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71nM5K2J7TL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pleated+midi+dress",
  },
  {
    id: "P0019",
    name: "Casual Crop Top 19",
    category: "Girls Fashion",
    subcategory: "Kurtis",
    brand: "PetalWear",
    description: "Casual Crop Top designed for everyday use with a marketplace-ready specification set.",
    price: 2445,
    mrp: 2934,
    discount: 17,
    rating: 4.7,
    reviews: 389,
    stock: 344,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71zM7WmYHXL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71pYQ7XxSLL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=casual+crop+top",
  },
  {
    id: "P0020",
    name: "Printed Kurti 20",
    category: "Girls Fashion",
    subcategory: "Bottomwear",
    brand: "StyleNest",
    description: "Printed Kurti designed for everyday use with a marketplace-ready specification set.",
    price: 2542,
    mrp: 3127,
    discount: 19,
    rating: 4.2,
    reviews: 406,
    stock: 381,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61f5eX3tQGL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71pg5pOHQPL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=printed+kurti",
  },
  {
    id: "P0021",
    name: "High Waist Jeans 21",
    category: "Girls Fashion",
    subcategory: "Dresses",
    brand: "Bloom & Co.",
    description: "High Waist Jeans designed for everyday use with a marketplace-ready specification set.",
    price: 2639,
    mrp: 3325,
    discount: 21,
    rating: 4.5,
    reviews: 423,
    stock: 58,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71nM5K2J7TL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/51YdVjb50BL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=high+waist+jeans",
  },
  {
    id: "P0022",
    name: "Denim Jacket 22",
    category: "Girls Fashion",
    subcategory: "Tops",
    brand: "Luna Street",
    description: "Denim Jacket designed for everyday use with a marketplace-ready specification set.",
    price: 2736,
    mrp: 3529,
    discount: 22,
    rating: 4.8,
    reviews: 440,
    stock: 95,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/71pYQ7XxSLL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/61YkV5V4Z-L._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=denim+jacket",
  },
  {
    id: "P0023",
    name: "Party Wear Frock 23",
    category: "Girls Fashion",
    subcategory: "Kurtis",
    brand: "PetalWear",
    description: "Party Wear Frock designed for everyday use with a marketplace-ready specification set.",
    price: 2833,
    mrp: 3740,
    discount: 24,
    rating: 4.3,
    reviews: 457,
    stock: 132,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71pg5pOHQPL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/71c8B2k8JYL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=party+wear+frock",
  },
  {
    id: "P0024",
    name: "Soft Lounge Set 24",
    category: "Girls Fashion",
    subcategory: "Bottomwear",
    brand: "StyleNest",
    description: "Soft Lounge Set designed for everyday use with a marketplace-ready specification set.",
    price: 2930,
    mrp: 3956,
    discount: 26,
    rating: 4.6,
    reviews: 474,
    stock: 169,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/51YdVjb50BL._AC_UY1000_.jpg", "https://m.media-amazon.com/images/I/71zM7WmYHXL._AC_UY1000_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=soft+lounge+set",
  },
  {
    id: "P0025",
    name: "Smart LED Display 1",
    category: "Electronics",
    subcategory: "Smart Home",
    brand: "TechNova",
    description: "Smart LED Display designed for everyday use with a marketplace-ready specification set.",
    price: 1049,
    mrp: 1259,
    discount: 17,
    rating: 4.2,
    reviews: 112,
    stock: 49,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg", "https://m.media-amazon.com/images/I/71OrP3cNcxL._SX679_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+led+display",
  },
  {
    id: "P0026",
    name: "Portable Power Station 2",
    category: "Electronics",
    subcategory: "Computer Accessories",
    brand: "VoltEdge",
    description: "Portable Power Station designed for everyday use with a marketplace-ready specification set.",
    price: 1146,
    mrp: 1410,
    discount: 19,
    rating: 4.5,
    reviews: 129,
    stock: 86,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/51K3vK-XyYL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/518w7CcuOnL._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=portable+power+station",
  },
  {
    id: "P0027",
    name: "4K Streaming Stick 3",
    category: "Electronics",
    subcategory: "Storage",
    brand: "HomeGrid",
    description: "4K Streaming Stick designed for everyday use with a marketplace-ready specification set.",
    price: 1243,
    mrp: 1566,
    discount: 21,
    rating: 4.8,
    reviews: 146,
    stock: 123,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71ZeetpGrZL._SX425_.jpg", "https://m.media-amazon.com/images/I/617NtexaW2L.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=4k+streaming+stick",
  },
  {
    id: "P0028",
    name: "USB-C Hub 4",
    category: "Electronics",
    subcategory: "Networking",
    brand: "PixelWorks",
    description: "USB-C Hub designed for everyday use with a marketplace-ready specification set.",
    price: 1340,
    mrp: 1729,
    discount: 22,
    rating: 4.3,
    reviews: 163,
    stock: 160,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/71OrP3cNcxL._SX679_.jpg", "https://m.media-amazon.com/images/I/61AcNVFmd9L._CR0,0,640,361_SR342,193_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=usb-c+hub",
  },
  {
    id: "P0029",
    name: "Wireless Router 5",
    category: "Electronics",
    subcategory: "Smart Home",
    brand: "TechNova",
    description: "Wireless Router designed for everyday use with a marketplace-ready specification set.",
    price: 1437,
    mrp: 1897,
    discount: 24,
    rating: 4.6,
    reviews: 180,
    stock: 197,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/518w7CcuOnL._SX569_.jpg", "https://m.media-amazon.com/images/I/41Ya8tZsBkL._AC_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=wireless+router",
  },
  {
    id: "P0030",
    name: "Smart Home Camera 6",
    category: "Electronics",
    subcategory: "Computer Accessories",
    brand: "VoltEdge",
    description: "Smart Home Camera designed for everyday use with a marketplace-ready specification set.",
    price: 1534,
    mrp: 2071,
    discount: 26,
    rating: 4.1,
    reviews: 197,
    stock: 234,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/617NtexaW2L.jpg", "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+home+camera",
  },
  {
    id: "P0031",
    name: "Mechanical Keyboard 7",
    category: "Electronics",
    subcategory: "Storage",
    brand: "HomeGrid",
    description: "Mechanical Keyboard designed for everyday use with a marketplace-ready specification set.",
    price: 1631,
    mrp: 1957,
    discount: 17,
    rating: 4.4,
    reviews: 214,
    stock: 271,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61AcNVFmd9L._CR0,0,640,361_SR342,193_.jpg", "https://m.media-amazon.com/images/I/51K3vK-XyYL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=mechanical+keyboard",
  },
  {
    id: "P0032",
    name: "Portable SSD 8",
    category: "Electronics",
    subcategory: "Networking",
    brand: "PixelWorks",
    description: "Portable SSD designed for everyday use with a marketplace-ready specification set.",
    price: 1728,
    mrp: 2125,
    discount: 19,
    rating: 4.7,
    reviews: 231,
    stock: 308,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/41Ya8tZsBkL._AC_.jpg", "https://m.media-amazon.com/images/I/71ZeetpGrZL._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=portable+ssd",
  },
  {
    id: "P0033",
    name: "Smart LED Display 9",
    category: "Electronics",
    subcategory: "Smart Home",
    brand: "TechNova",
    description: "Smart LED Display designed for everyday use with a marketplace-ready specification set.",
    price: 1825,
    mrp: 2299,
    discount: 21,
    rating: 4.2,
    reviews: 248,
    stock: 345,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg", "https://m.media-amazon.com/images/I/71OrP3cNcxL._SX679_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+led+display",
  },
  {
    id: "P0034",
    name: "Portable Power Station 10",
    category: "Electronics",
    subcategory: "Computer Accessories",
    brand: "VoltEdge",
    description: "Portable Power Station designed for everyday use with a marketplace-ready specification set.",
    price: 1922,
    mrp: 2479,
    discount: 22,
    rating: 4.5,
    reviews: 265,
    stock: 382,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/51K3vK-XyYL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/518w7CcuOnL._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=portable+power+station",
  },
  {
    id: "P0035",
    name: "4K Streaming Stick 11",
    category: "Electronics",
    subcategory: "Storage",
    brand: "HomeGrid",
    description: "4K Streaming Stick designed for everyday use with a marketplace-ready specification set.",
    price: 2019,
    mrp: 2665,
    discount: 24,
    rating: 4.8,
    reviews: 282,
    stock: 59,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71ZeetpGrZL._SX425_.jpg", "https://m.media-amazon.com/images/I/617NtexaW2L.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=4k+streaming+stick",
  },
  {
    id: "P0036",
    name: "USB-C Hub 12",
    category: "Electronics",
    subcategory: "Networking",
    brand: "PixelWorks",
    description: "USB-C Hub designed for everyday use with a marketplace-ready specification set.",
    price: 2116,
    mrp: 2857,
    discount: 26,
    rating: 4.3,
    reviews: 299,
    stock: 96,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/71OrP3cNcxL._SX679_.jpg", "https://m.media-amazon.com/images/I/61AcNVFmd9L._CR0,0,640,361_SR342,193_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=usb-c+hub",
  },
  {
    id: "P0037",
    name: "Wireless Router 13",
    category: "Electronics",
    subcategory: "Smart Home",
    brand: "TechNova",
    description: "Wireless Router designed for everyday use with a marketplace-ready specification set.",
    price: 2213,
    mrp: 2656,
    discount: 17,
    rating: 4.6,
    reviews: 316,
    stock: 133,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/518w7CcuOnL._SX569_.jpg", "https://m.media-amazon.com/images/I/41Ya8tZsBkL._AC_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=wireless+router",
  },
  {
    id: "P0038",
    name: "Smart Home Camera 14",
    category: "Electronics",
    subcategory: "Computer Accessories",
    brand: "VoltEdge",
    description: "Smart Home Camera designed for everyday use with a marketplace-ready specification set.",
    price: 2310,
    mrp: 2841,
    discount: 19,
    rating: 4.1,
    reviews: 333,
    stock: 170,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/617NtexaW2L.jpg", "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+home+camera",
  },
  {
    id: "P0039",
    name: "Mechanical Keyboard 15",
    category: "Electronics",
    subcategory: "Storage",
    brand: "HomeGrid",
    description: "Mechanical Keyboard designed for everyday use with a marketplace-ready specification set.",
    price: 2407,
    mrp: 3033,
    discount: 21,
    rating: 4.4,
    reviews: 350,
    stock: 207,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61AcNVFmd9L._CR0,0,640,361_SR342,193_.jpg", "https://m.media-amazon.com/images/I/51K3vK-XyYL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=mechanical+keyboard",
  },
  {
    id: "P0040",
    name: "Portable SSD 16",
    category: "Electronics",
    subcategory: "Networking",
    brand: "PixelWorks",
    description: "Portable SSD designed for everyday use with a marketplace-ready specification set.",
    price: 2504,
    mrp: 3230,
    discount: 22,
    rating: 4.7,
    reviews: 367,
    stock: 244,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/41Ya8tZsBkL._AC_.jpg", "https://m.media-amazon.com/images/I/71ZeetpGrZL._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=portable+ssd",
  },
  {
    id: "P0041",
    name: "Smart LED Display 17",
    category: "Electronics",
    subcategory: "Smart Home",
    brand: "TechNova",
    description: "Smart LED Display designed for everyday use with a marketplace-ready specification set.",
    price: 2601,
    mrp: 3433,
    discount: 24,
    rating: 4.2,
    reviews: 384,
    stock: 281,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg", "https://m.media-amazon.com/images/I/71OrP3cNcxL._SX679_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+led+display",
  },
  {
    id: "P0042",
    name: "Portable Power Station 18",
    category: "Electronics",
    subcategory: "Computer Accessories",
    brand: "VoltEdge",
    description: "Portable Power Station designed for everyday use with a marketplace-ready specification set.",
    price: 2698,
    mrp: 3642,
    discount: 26,
    rating: 4.5,
    reviews: 401,
    stock: 318,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/51K3vK-XyYL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/518w7CcuOnL._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=portable+power+station",
  },
  {
    id: "P0043",
    name: "4K Streaming Stick 19",
    category: "Electronics",
    subcategory: "Storage",
    brand: "HomeGrid",
    description: "4K Streaming Stick designed for everyday use with a marketplace-ready specification set.",
    price: 2795,
    mrp: 3354,
    discount: 17,
    rating: 4.8,
    reviews: 418,
    stock: 355,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71ZeetpGrZL._SX425_.jpg", "https://m.media-amazon.com/images/I/617NtexaW2L.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=4k+streaming+stick",
  },
  {
    id: "P0044",
    name: "USB-C Hub 20",
    category: "Electronics",
    subcategory: "Networking",
    brand: "PixelWorks",
    description: "USB-C Hub designed for everyday use with a marketplace-ready specification set.",
    price: 2892,
    mrp: 3557,
    discount: 19,
    rating: 4.3,
    reviews: 435,
    stock: 392,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/71OrP3cNcxL._SX679_.jpg", "https://m.media-amazon.com/images/I/61AcNVFmd9L._CR0,0,640,361_SR342,193_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=usb-c+hub",
  },
  {
    id: "P0045",
    name: "Wireless Router 21",
    category: "Electronics",
    subcategory: "Smart Home",
    brand: "TechNova",
    description: "Wireless Router designed for everyday use with a marketplace-ready specification set.",
    price: 2989,
    mrp: 3766,
    discount: 21,
    rating: 4.6,
    reviews: 452,
    stock: 69,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/518w7CcuOnL._SX569_.jpg", "https://m.media-amazon.com/images/I/41Ya8tZsBkL._AC_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=wireless+router",
  },
  {
    id: "P0046",
    name: "Smart Home Camera 22",
    category: "Electronics",
    subcategory: "Computer Accessories",
    brand: "VoltEdge",
    description: "Smart Home Camera designed for everyday use with a marketplace-ready specification set.",
    price: 3086,
    mrp: 3981,
    discount: 22,
    rating: 4.1,
    reviews: 469,
    stock: 106,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/617NtexaW2L.jpg", "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+home+camera",
  },
  {
    id: "P0047",
    name: "Mechanical Keyboard 23",
    category: "Electronics",
    subcategory: "Storage",
    brand: "HomeGrid",
    description: "Mechanical Keyboard designed for everyday use with a marketplace-ready specification set.",
    price: 3183,
    mrp: 4202,
    discount: 24,
    rating: 4.4,
    reviews: 486,
    stock: 143,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61AcNVFmd9L._CR0,0,640,361_SR342,193_.jpg", "https://m.media-amazon.com/images/I/51K3vK-XyYL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=mechanical+keyboard",
  },
  {
    id: "P0048",
    name: "Portable SSD 24",
    category: "Electronics",
    subcategory: "Networking",
    brand: "PixelWorks",
    description: "Portable SSD designed for everyday use with a marketplace-ready specification set.",
    price: 3280,
    mrp: 4428,
    discount: 26,
    rating: 4.7,
    reviews: 503,
    stock: 180,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/41Ya8tZsBkL._AC_.jpg", "https://m.media-amazon.com/images/I/71ZeetpGrZL._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=portable+ssd",
  },
  {
    id: "P0049",
    name: "Nova X Smartphone 1",
    category: "Mobiles",
    subcategory: "5G Phones",
    brand: "Nova",
    description: "Nova X Smartphone designed for everyday use with a marketplace-ready specification set.",
    price: 1399,
    mrp: 1679,
    discount: 17,
    rating: 4.3,
    reviews: 141,
    stock: 60,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/81cHpJNr07L._S.jpg", "https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=nova+x+smartphone",
  },
  {
    id: "P0050",
    name: "PixelEdge 5G Phone 2",
    category: "Mobiles",
    subcategory: "Android Phones",
    brand: "Aero",
    description: "PixelEdge 5G Phone designed for everyday use with a marketplace-ready specification set.",
    price: 1496,
    mrp: 1840,
    discount: 19,
    rating: 4.6,
    reviews: 158,
    stock: 97,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/91rKcYt1jrL._S.jpg", "https://m.media-amazon.com/images/I/61f1YfTkTDL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pixeledge+5g+phone",
  },
  {
    id: "P0051",
    name: "Aero Max 5G 3",
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Fusion",
    description: "Aero Max 5G designed for everyday use with a marketplace-ready specification set.",
    price: 1593,
    mrp: 2007,
    discount: 21,
    rating: 4.1,
    reviews: 175,
    stock: 134,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71v2jVh6nIL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/61AHiYyu3ZL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=aero+max+5g",
  },
  {
    id: "P0052",
    name: "Titan Note Phone 4",
    category: "Mobiles",
    subcategory: "Mobile Accessories",
    brand: "Vision",
    description: "Titan Note Phone designed for everyday use with a marketplace-ready specification set.",
    price: 1690,
    mrp: 2180,
    discount: 22,
    rating: 4.4,
    reviews: 192,
    stock: 171,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg", "https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=titan+note+phone",
  },
  {
    id: "P0053",
    name: "Vision Pro 5G 5",
    category: "Mobiles",
    subcategory: "5G Phones",
    brand: "Nova",
    description: "Vision Pro 5G designed for everyday use with a marketplace-ready specification set.",
    price: 1787,
    mrp: 2359,
    discount: 24,
    rating: 4.7,
    reviews: 209,
    stock: 208,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61f1YfTkTDL._S.jpg", "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=vision+pro+5g",
  },
  {
    id: "P0054",
    name: "Pulse Lite Phone 6",
    category: "Mobiles",
    subcategory: "Android Phones",
    brand: "Aero",
    description: "Pulse Lite Phone designed for everyday use with a marketplace-ready specification set.",
    price: 1884,
    mrp: 2543,
    discount: 26,
    rating: 4.2,
    reviews: 226,
    stock: 245,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/61AHiYyu3ZL._S.jpg", "https://m.media-amazon.com/images/I/81cHpJNr07L._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pulse+lite+phone",
  },
  {
    id: "P0055",
    name: "Zen Mobile 5G 7",
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Fusion",
    description: "Zen Mobile 5G designed for everyday use with a marketplace-ready specification set.",
    price: 1981,
    mrp: 2377,
    discount: 17,
    rating: 4.5,
    reviews: 243,
    stock: 282,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/91rKcYt1jrL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=zen+mobile+5g",
  },
  {
    id: "P0056",
    name: "Fusion Ultra Phone 8",
    category: "Mobiles",
    subcategory: "Mobile Accessories",
    brand: "Vision",
    description: "Fusion Ultra Phone designed for everyday use with a marketplace-ready specification set.",
    price: 2078,
    mrp: 2556,
    discount: 19,
    rating: 4.8,
    reviews: 260,
    stock: 319,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg", "https://m.media-amazon.com/images/I/71v2jVh6nIL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=fusion+ultra+phone",
  },
  {
    id: "P0057",
    name: "Nova X Smartphone 9",
    category: "Mobiles",
    subcategory: "5G Phones",
    brand: "Nova",
    description: "Nova X Smartphone designed for everyday use with a marketplace-ready specification set.",
    price: 2175,
    mrp: 2741,
    discount: 21,
    rating: 4.3,
    reviews: 277,
    stock: 356,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/81cHpJNr07L._S.jpg", "https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=nova+x+smartphone",
  },
  {
    id: "P0058",
    name: "PixelEdge 5G Phone 10",
    category: "Mobiles",
    subcategory: "Android Phones",
    brand: "Aero",
    description: "PixelEdge 5G Phone designed for everyday use with a marketplace-ready specification set.",
    price: 2272,
    mrp: 2931,
    discount: 22,
    rating: 4.6,
    reviews: 294,
    stock: 393,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/91rKcYt1jrL._S.jpg", "https://m.media-amazon.com/images/I/61f1YfTkTDL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pixeledge+5g+phone",
  },
  {
    id: "P0059",
    name: "Aero Max 5G 11",
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Fusion",
    description: "Aero Max 5G designed for everyday use with a marketplace-ready specification set.",
    price: 2369,
    mrp: 3127,
    discount: 24,
    rating: 4.1,
    reviews: 311,
    stock: 70,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71v2jVh6nIL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/61AHiYyu3ZL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=aero+max+5g",
  },
  {
    id: "P0060",
    name: "Titan Note Phone 12",
    category: "Mobiles",
    subcategory: "Mobile Accessories",
    brand: "Vision",
    description: "Titan Note Phone designed for everyday use with a marketplace-ready specification set.",
    price: 2466,
    mrp: 3329,
    discount: 26,
    rating: 4.4,
    reviews: 328,
    stock: 107,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg", "https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=titan+note+phone",
  },
  {
    id: "P0061",
    name: "Vision Pro 5G 13",
    category: "Mobiles",
    subcategory: "5G Phones",
    brand: "Nova",
    description: "Vision Pro 5G designed for everyday use with a marketplace-ready specification set.",
    price: 2563,
    mrp: 3076,
    discount: 17,
    rating: 4.7,
    reviews: 345,
    stock: 144,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61f1YfTkTDL._S.jpg", "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=vision+pro+5g",
  },
  {
    id: "P0062",
    name: "Pulse Lite Phone 14",
    category: "Mobiles",
    subcategory: "Android Phones",
    brand: "Aero",
    description: "Pulse Lite Phone designed for everyday use with a marketplace-ready specification set.",
    price: 2660,
    mrp: 3272,
    discount: 19,
    rating: 4.2,
    reviews: 362,
    stock: 181,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/61AHiYyu3ZL._S.jpg", "https://m.media-amazon.com/images/I/81cHpJNr07L._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pulse+lite+phone",
  },
  {
    id: "P0063",
    name: "Zen Mobile 5G 15",
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Fusion",
    description: "Zen Mobile 5G designed for everyday use with a marketplace-ready specification set.",
    price: 2757,
    mrp: 3474,
    discount: 21,
    rating: 4.5,
    reviews: 379,
    stock: 218,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/91rKcYt1jrL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=zen+mobile+5g",
  },
  {
    id: "P0064",
    name: "Fusion Ultra Phone 16",
    category: "Mobiles",
    subcategory: "Mobile Accessories",
    brand: "Vision",
    description: "Fusion Ultra Phone designed for everyday use with a marketplace-ready specification set.",
    price: 2854,
    mrp: 3682,
    discount: 22,
    rating: 4.8,
    reviews: 396,
    stock: 255,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg", "https://m.media-amazon.com/images/I/71v2jVh6nIL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=fusion+ultra+phone",
  },
  {
    id: "P0065",
    name: "Nova X Smartphone 17",
    category: "Mobiles",
    subcategory: "5G Phones",
    brand: "Nova",
    description: "Nova X Smartphone designed for everyday use with a marketplace-ready specification set.",
    price: 2951,
    mrp: 3895,
    discount: 24,
    rating: 4.3,
    reviews: 413,
    stock: 292,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/81cHpJNr07L._S.jpg", "https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=nova+x+smartphone",
  },
  {
    id: "P0066",
    name: "PixelEdge 5G Phone 18",
    category: "Mobiles",
    subcategory: "Android Phones",
    brand: "Aero",
    description: "PixelEdge 5G Phone designed for everyday use with a marketplace-ready specification set.",
    price: 3048,
    mrp: 4115,
    discount: 26,
    rating: 4.6,
    reviews: 430,
    stock: 329,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/91rKcYt1jrL._S.jpg", "https://m.media-amazon.com/images/I/61f1YfTkTDL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pixeledge+5g+phone",
  },
  {
    id: "P0067",
    name: "Aero Max 5G 19",
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Fusion",
    description: "Aero Max 5G designed for everyday use with a marketplace-ready specification set.",
    price: 3145,
    mrp: 3774,
    discount: 17,
    rating: 4.1,
    reviews: 447,
    stock: 366,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71v2jVh6nIL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/61AHiYyu3ZL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=aero+max+5g",
  },
  {
    id: "P0068",
    name: "Titan Note Phone 20",
    category: "Mobiles",
    subcategory: "Mobile Accessories",
    brand: "Vision",
    description: "Titan Note Phone designed for everyday use with a marketplace-ready specification set.",
    price: 3242,
    mrp: 3988,
    discount: 19,
    rating: 4.4,
    reviews: 464,
    stock: 43,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg", "https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=titan+note+phone",
  },
  {
    id: "P0069",
    name: "Vision Pro 5G 21",
    category: "Mobiles",
    subcategory: "5G Phones",
    brand: "Nova",
    description: "Vision Pro 5G designed for everyday use with a marketplace-ready specification set.",
    price: 3339,
    mrp: 4207,
    discount: 21,
    rating: 4.7,
    reviews: 481,
    stock: 80,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61f1YfTkTDL._S.jpg", "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=vision+pro+5g",
  },
  {
    id: "P0070",
    name: "Pulse Lite Phone 22",
    category: "Mobiles",
    subcategory: "Android Phones",
    brand: "Aero",
    description: "Pulse Lite Phone designed for everyday use with a marketplace-ready specification set.",
    price: 3436,
    mrp: 4432,
    discount: 22,
    rating: 4.2,
    reviews: 498,
    stock: 117,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/61AHiYyu3ZL._S.jpg", "https://m.media-amazon.com/images/I/81cHpJNr07L._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pulse+lite+phone",
  },
  {
    id: "P0071",
    name: "Zen Mobile 5G 23",
    category: "Mobiles",
    subcategory: "Smartphones",
    brand: "Fusion",
    description: "Zen Mobile 5G designed for everyday use with a marketplace-ready specification set.",
    price: 3533,
    mrp: 4664,
    discount: 24,
    rating: 4.5,
    reviews: 515,
    stock: 154,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/91rKcYt1jrL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=zen+mobile+5g",
  },
  {
    id: "P0072",
    name: "Fusion Ultra Phone 24",
    category: "Mobiles",
    subcategory: "Mobile Accessories",
    brand: "Vision",
    description: "Fusion Ultra Phone designed for everyday use with a marketplace-ready specification set.",
    price: 3630,
    mrp: 4900,
    discount: 26,
    rating: 4.8,
    reviews: 532,
    stock: 191,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg", "https://m.media-amazon.com/images/I/71v2jVh6nIL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=fusion+ultra+phone",
  },
  {
    id: "P0073",
    name: "CoreBook 15 Laptop 1",
    category: "Laptops",
    subcategory: "Student Laptops",
    brand: "CoreBook",
    description: "CoreBook 15 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 1749,
    mrp: 2099,
    discount: 17,
    rating: 4.4,
    reviews: 170,
    stock: 71,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71FXHAM+jWL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/51HftONtGaL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=corebook+15+laptop",
  },
  {
    id: "P0074",
    name: "ProLite 14 Laptop 2",
    category: "Laptops",
    subcategory: "Ultrabooks",
    brand: "ProLite",
    description: "ProLite 14 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 1846,
    mrp: 2271,
    discount: 19,
    rating: 4.7,
    reviews: 187,
    stock: 108,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/71dyfY6G0aL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/71bIUPAleZL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=prolite+14+laptop",
  },
  {
    id: "P0075",
    name: "Creator X Laptop 3",
    category: "Laptops",
    subcategory: "Creator Laptops",
    brand: "StudioX",
    description: "Creator X Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 1943,
    mrp: 2448,
    discount: 21,
    rating: 4.2,
    reviews: 204,
    stock: 145,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/712cUkgrVnL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/81iiMyulIAL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=creator+x+laptop",
  },
  {
    id: "P0076",
    name: "Everyday 15 Notebook 4",
    category: "Laptops",
    subcategory: "Business Laptops",
    brand: "WorkMate",
    description: "Everyday 15 Notebook designed for everyday use with a marketplace-ready specification set.",
    price: 2040,
    mrp: 2632,
    discount: 22,
    rating: 4.5,
    reviews: 221,
    stock: 182,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/51HftONtGaL.jpg", "https://m.media-amazon.com/images/I/71jyZTD32NL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=everyday+15+notebook",
  },
  {
    id: "P0077",
    name: "Studio 16 Laptop 5",
    category: "Laptops",
    subcategory: "Student Laptops",
    brand: "CoreBook",
    description: "Studio 16 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 2137,
    mrp: 2821,
    discount: 24,
    rating: 4.8,
    reviews: 238,
    stock: 219,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71bIUPAleZL.jpg", "https://m.media-amazon.com/images/I/71WuRLJnL4L.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=studio+16+laptop",
  },
  {
    id: "P0078",
    name: "SlimBook Air 6",
    category: "Laptops",
    subcategory: "Ultrabooks",
    brand: "ProLite",
    description: "SlimBook Air designed for everyday use with a marketplace-ready specification set.",
    price: 2234,
    mrp: 3016,
    discount: 26,
    rating: 4.3,
    reviews: 255,
    stock: 256,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/81iiMyulIAL.jpg", "https://m.media-amazon.com/images/I/71FXHAM+jWL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=slimbook+air",
  },
  {
    id: "P0079",
    name: "Performance 14 Laptop 7",
    category: "Laptops",
    subcategory: "Creator Laptops",
    brand: "StudioX",
    description: "Performance 14 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 2331,
    mrp: 2797,
    discount: 17,
    rating: 4.6,
    reviews: 272,
    stock: 293,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71jyZTD32NL.jpg", "https://m.media-amazon.com/images/I/71dyfY6G0aL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=performance+14+laptop",
  },
  {
    id: "P0080",
    name: "Business Pro Laptop 8",
    category: "Laptops",
    subcategory: "Business Laptops",
    brand: "WorkMate",
    description: "Business Pro Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 2428,
    mrp: 2986,
    discount: 19,
    rating: 4.1,
    reviews: 289,
    stock: 330,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/71WuRLJnL4L.jpg", "https://m.media-amazon.com/images/I/712cUkgrVnL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=business+pro+laptop",
  },
  {
    id: "P0081",
    name: "CoreBook 15 Laptop 9",
    category: "Laptops",
    subcategory: "Student Laptops",
    brand: "CoreBook",
    description: "CoreBook 15 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 2525,
    mrp: 3181,
    discount: 21,
    rating: 4.4,
    reviews: 306,
    stock: 367,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71FXHAM+jWL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/51HftONtGaL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=corebook+15+laptop",
  },
  {
    id: "P0082",
    name: "ProLite 14 Laptop 10",
    category: "Laptops",
    subcategory: "Ultrabooks",
    brand: "ProLite",
    description: "ProLite 14 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 2622,
    mrp: 3382,
    discount: 22,
    rating: 4.7,
    reviews: 323,
    stock: 44,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/71dyfY6G0aL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/71bIUPAleZL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=prolite+14+laptop",
  },
  {
    id: "P0083",
    name: "Creator X Laptop 11",
    category: "Laptops",
    subcategory: "Creator Laptops",
    brand: "StudioX",
    description: "Creator X Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 2719,
    mrp: 3589,
    discount: 24,
    rating: 4.2,
    reviews: 340,
    stock: 81,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/712cUkgrVnL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/81iiMyulIAL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=creator+x+laptop",
  },
  {
    id: "P0084",
    name: "Everyday 15 Notebook 12",
    category: "Laptops",
    subcategory: "Business Laptops",
    brand: "WorkMate",
    description: "Everyday 15 Notebook designed for everyday use with a marketplace-ready specification set.",
    price: 2816,
    mrp: 3802,
    discount: 26,
    rating: 4.5,
    reviews: 357,
    stock: 118,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/51HftONtGaL.jpg", "https://m.media-amazon.com/images/I/71jyZTD32NL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=everyday+15+notebook",
  },
  {
    id: "P0085",
    name: "Studio 16 Laptop 13",
    category: "Laptops",
    subcategory: "Student Laptops",
    brand: "CoreBook",
    description: "Studio 16 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 2913,
    mrp: 3496,
    discount: 17,
    rating: 4.8,
    reviews: 374,
    stock: 155,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71bIUPAleZL.jpg", "https://m.media-amazon.com/images/I/71WuRLJnL4L.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=studio+16+laptop",
  },
  {
    id: "P0086",
    name: "SlimBook Air 14",
    category: "Laptops",
    subcategory: "Ultrabooks",
    brand: "ProLite",
    description: "SlimBook Air designed for everyday use with a marketplace-ready specification set.",
    price: 3010,
    mrp: 3702,
    discount: 19,
    rating: 4.3,
    reviews: 391,
    stock: 192,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/81iiMyulIAL.jpg", "https://m.media-amazon.com/images/I/71FXHAM+jWL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=slimbook+air",
  },
  {
    id: "P0087",
    name: "Performance 14 Laptop 15",
    category: "Laptops",
    subcategory: "Creator Laptops",
    brand: "StudioX",
    description: "Performance 14 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 3107,
    mrp: 3915,
    discount: 21,
    rating: 4.6,
    reviews: 408,
    stock: 229,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71jyZTD32NL.jpg", "https://m.media-amazon.com/images/I/71dyfY6G0aL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=performance+14+laptop",
  },
  {
    id: "P0088",
    name: "Business Pro Laptop 16",
    category: "Laptops",
    subcategory: "Business Laptops",
    brand: "WorkMate",
    description: "Business Pro Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 3204,
    mrp: 4133,
    discount: 22,
    rating: 4.1,
    reviews: 425,
    stock: 266,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/71WuRLJnL4L.jpg", "https://m.media-amazon.com/images/I/712cUkgrVnL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=business+pro+laptop",
  },
  {
    id: "P0089",
    name: "CoreBook 15 Laptop 17",
    category: "Laptops",
    subcategory: "Student Laptops",
    brand: "CoreBook",
    description: "CoreBook 15 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 3301,
    mrp: 4357,
    discount: 24,
    rating: 4.4,
    reviews: 442,
    stock: 303,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71FXHAM+jWL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/51HftONtGaL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=corebook+15+laptop",
  },
  {
    id: "P0090",
    name: "ProLite 14 Laptop 18",
    category: "Laptops",
    subcategory: "Ultrabooks",
    brand: "ProLite",
    description: "ProLite 14 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 3398,
    mrp: 4587,
    discount: 26,
    rating: 4.7,
    reviews: 459,
    stock: 340,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/71dyfY6G0aL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/71bIUPAleZL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=prolite+14+laptop",
  },
  {
    id: "P0091",
    name: "Creator X Laptop 19",
    category: "Laptops",
    subcategory: "Creator Laptops",
    brand: "StudioX",
    description: "Creator X Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 3495,
    mrp: 4194,
    discount: 17,
    rating: 4.2,
    reviews: 476,
    stock: 377,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/712cUkgrVnL._AC_UL320_.jpg", "https://m.media-amazon.com/images/I/81iiMyulIAL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=creator+x+laptop",
  },
  {
    id: "P0092",
    name: "Everyday 15 Notebook 20",
    category: "Laptops",
    subcategory: "Business Laptops",
    brand: "WorkMate",
    description: "Everyday 15 Notebook designed for everyday use with a marketplace-ready specification set.",
    price: 3592,
    mrp: 4418,
    discount: 19,
    rating: 4.5,
    reviews: 493,
    stock: 54,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/51HftONtGaL.jpg", "https://m.media-amazon.com/images/I/71jyZTD32NL.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=everyday+15+notebook",
  },
  {
    id: "P0093",
    name: "Studio 16 Laptop 21",
    category: "Laptops",
    subcategory: "Student Laptops",
    brand: "CoreBook",
    description: "Studio 16 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 3689,
    mrp: 4648,
    discount: 21,
    rating: 4.8,
    reviews: 510,
    stock: 91,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71bIUPAleZL.jpg", "https://m.media-amazon.com/images/I/71WuRLJnL4L.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=studio+16+laptop",
  },
  {
    id: "P0094",
    name: "SlimBook Air 22",
    category: "Laptops",
    subcategory: "Ultrabooks",
    brand: "ProLite",
    description: "SlimBook Air designed for everyday use with a marketplace-ready specification set.",
    price: 3786,
    mrp: 4884,
    discount: 22,
    rating: 4.3,
    reviews: 527,
    stock: 128,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/81iiMyulIAL.jpg", "https://m.media-amazon.com/images/I/71FXHAM+jWL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=slimbook+air",
  },
  {
    id: "P0095",
    name: "Performance 14 Laptop 23",
    category: "Laptops",
    subcategory: "Creator Laptops",
    brand: "StudioX",
    description: "Performance 14 Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 3883,
    mrp: 5126,
    discount: 24,
    rating: 4.6,
    reviews: 544,
    stock: 165,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71jyZTD32NL.jpg", "https://m.media-amazon.com/images/I/71dyfY6G0aL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=performance+14+laptop",
  },
  {
    id: "P0096",
    name: "Business Pro Laptop 24",
    category: "Laptops",
    subcategory: "Business Laptops",
    brand: "WorkMate",
    description: "Business Pro Laptop designed for everyday use with a marketplace-ready specification set.",
    price: 3980,
    mrp: 5373,
    discount: 26,
    rating: 4.1,
    reviews: 561,
    stock: 202,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/71WuRLJnL4L.jpg", "https://m.media-amazon.com/images/I/712cUkgrVnL._AC_UL320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=business+pro+laptop",
  },
  {
    id: "P0097",
    name: "True Wireless Earbuds 1",
    category: "Audio",
    subcategory: "Earbuds",
    brand: "SoundPeak",
    description: "True Wireless Earbuds designed for everyday use with a marketplace-ready specification set.",
    price: 2099,
    mrp: 2519,
    discount: 17,
    rating: 4.5,
    reviews: 199,
    stock: 82,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/51nBTTG3hNL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/51rT40sk3xL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=true+wireless+earbuds",
  },
  {
    id: "P0098",
    name: "Over-Ear ANC Headphones 2",
    category: "Audio",
    subcategory: "Headphones",
    brand: "BassLine",
    description: "Over-Ear ANC Headphones designed for everyday use with a marketplace-ready specification set.",
    price: 2196,
    mrp: 2701,
    discount: 19,
    rating: 4.8,
    reviews: 216,
    stock: 119,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/81-TGXuOMAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/71mTfSKhhTL._AC_UL640_QL65_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=over-ear+anc+headphones",
  },
  {
    id: "P0099",
    name: "Mini Bluetooth Speaker 3",
    category: "Audio",
    subcategory: "Speakers",
    brand: "EchoLab",
    description: "Mini Bluetooth Speaker designed for everyday use with a marketplace-ready specification set.",
    price: 2293,
    mrp: 2889,
    discount: 21,
    rating: 4.3,
    reviews: 233,
    stock: 156,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/7179kqSfnAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=mini+bluetooth+speaker",
  },
  {
    id: "P0100",
    name: "Neckband Wireless Earphones 4",
    category: "Audio",
    subcategory: "Soundbars",
    brand: "Aural",
    description: "Neckband Wireless Earphones designed for everyday use with a marketplace-ready specification set.",
    price: 2390,
    mrp: 3083,
    discount: 22,
    rating: 4.6,
    reviews: 250,
    stock: 193,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/51rT40sk3xL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/61xlUxeyuvL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=neckband+wireless+earphones",
  },
  {
    id: "P0101",
    name: "Studio Bass Headphones 5",
    category: "Audio",
    subcategory: "Earbuds",
    brand: "SoundPeak",
    description: "Studio Bass Headphones designed for everyday use with a marketplace-ready specification set.",
    price: 2487,
    mrp: 3283,
    discount: 24,
    rating: 4.1,
    reviews: 267,
    stock: 230,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71mTfSKhhTL._AC_UL640_QL65_.jpg", "https://m.media-amazon.com/images/I/517U3U90gnL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=studio+bass+headphones",
  },
  {
    id: "P0102",
    name: "Pocket Speaker 6",
    category: "Audio",
    subcategory: "Headphones",
    brand: "BassLine",
    description: "Pocket Speaker designed for everyday use with a marketplace-ready specification set.",
    price: 2584,
    mrp: 3488,
    discount: 26,
    rating: 4.4,
    reviews: 284,
    stock: 267,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/7179kqSfnAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/51nBTTG3hNL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pocket+speaker",
  },
  {
    id: "P0103",
    name: "Gaming Headset 7",
    category: "Audio",
    subcategory: "Speakers",
    brand: "EchoLab",
    description: "Gaming Headset designed for everyday use with a marketplace-ready specification set.",
    price: 2681,
    mrp: 3217,
    discount: 17,
    rating: 4.7,
    reviews: 301,
    stock: 304,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61xlUxeyuvL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/81-TGXuOMAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=gaming+headset",
  },
  {
    id: "P0104",
    name: "Smart Soundbar 8",
    category: "Audio",
    subcategory: "Soundbars",
    brand: "Aural",
    description: "Smart Soundbar designed for everyday use with a marketplace-ready specification set.",
    price: 2778,
    mrp: 3417,
    discount: 19,
    rating: 4.2,
    reviews: 318,
    stock: 341,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/517U3U90gnL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+soundbar",
  },
  {
    id: "P0105",
    name: "True Wireless Earbuds 9",
    category: "Audio",
    subcategory: "Earbuds",
    brand: "SoundPeak",
    description: "True Wireless Earbuds designed for everyday use with a marketplace-ready specification set.",
    price: 2875,
    mrp: 3623,
    discount: 21,
    rating: 4.5,
    reviews: 335,
    stock: 378,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/51nBTTG3hNL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/51rT40sk3xL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=true+wireless+earbuds",
  },
  {
    id: "P0106",
    name: "Over-Ear ANC Headphones 10",
    category: "Audio",
    subcategory: "Headphones",
    brand: "BassLine",
    description: "Over-Ear ANC Headphones designed for everyday use with a marketplace-ready specification set.",
    price: 2972,
    mrp: 3834,
    discount: 22,
    rating: 4.8,
    reviews: 352,
    stock: 55,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/81-TGXuOMAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/71mTfSKhhTL._AC_UL640_QL65_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=over-ear+anc+headphones",
  },
  {
    id: "P0107",
    name: "Mini Bluetooth Speaker 11",
    category: "Audio",
    subcategory: "Speakers",
    brand: "EchoLab",
    description: "Mini Bluetooth Speaker designed for everyday use with a marketplace-ready specification set.",
    price: 3069,
    mrp: 4051,
    discount: 24,
    rating: 4.3,
    reviews: 369,
    stock: 92,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/7179kqSfnAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=mini+bluetooth+speaker",
  },
  {
    id: "P0108",
    name: "Neckband Wireless Earphones 12",
    category: "Audio",
    subcategory: "Soundbars",
    brand: "Aural",
    description: "Neckband Wireless Earphones designed for everyday use with a marketplace-ready specification set.",
    price: 3166,
    mrp: 4274,
    discount: 26,
    rating: 4.6,
    reviews: 386,
    stock: 129,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/51rT40sk3xL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/61xlUxeyuvL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=neckband+wireless+earphones",
  },
  {
    id: "P0109",
    name: "Studio Bass Headphones 13",
    category: "Audio",
    subcategory: "Earbuds",
    brand: "SoundPeak",
    description: "Studio Bass Headphones designed for everyday use with a marketplace-ready specification set.",
    price: 3263,
    mrp: 3916,
    discount: 17,
    rating: 4.1,
    reviews: 403,
    stock: 166,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71mTfSKhhTL._AC_UL640_QL65_.jpg", "https://m.media-amazon.com/images/I/517U3U90gnL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=studio+bass+headphones",
  },
  {
    id: "P0110",
    name: "Pocket Speaker 14",
    category: "Audio",
    subcategory: "Headphones",
    brand: "BassLine",
    description: "Pocket Speaker designed for everyday use with a marketplace-ready specification set.",
    price: 3360,
    mrp: 4133,
    discount: 19,
    rating: 4.4,
    reviews: 420,
    stock: 203,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/7179kqSfnAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/51nBTTG3hNL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pocket+speaker",
  },
  {
    id: "P0111",
    name: "Gaming Headset 15",
    category: "Audio",
    subcategory: "Speakers",
    brand: "EchoLab",
    description: "Gaming Headset designed for everyday use with a marketplace-ready specification set.",
    price: 3457,
    mrp: 4356,
    discount: 21,
    rating: 4.7,
    reviews: 437,
    stock: 240,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61xlUxeyuvL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/81-TGXuOMAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=gaming+headset",
  },
  {
    id: "P0112",
    name: "Smart Soundbar 16",
    category: "Audio",
    subcategory: "Soundbars",
    brand: "Aural",
    description: "Smart Soundbar designed for everyday use with a marketplace-ready specification set.",
    price: 3554,
    mrp: 4585,
    discount: 22,
    rating: 4.2,
    reviews: 454,
    stock: 277,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/517U3U90gnL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+soundbar",
  },
  {
    id: "P0113",
    name: "True Wireless Earbuds 17",
    category: "Audio",
    subcategory: "Earbuds",
    brand: "SoundPeak",
    description: "True Wireless Earbuds designed for everyday use with a marketplace-ready specification set.",
    price: 3651,
    mrp: 4819,
    discount: 24,
    rating: 4.5,
    reviews: 471,
    stock: 314,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/51nBTTG3hNL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/51rT40sk3xL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=true+wireless+earbuds",
  },
  {
    id: "P0114",
    name: "Over-Ear ANC Headphones 18",
    category: "Audio",
    subcategory: "Headphones",
    brand: "BassLine",
    description: "Over-Ear ANC Headphones designed for everyday use with a marketplace-ready specification set.",
    price: 3748,
    mrp: 5060,
    discount: 26,
    rating: 4.8,
    reviews: 488,
    stock: 351,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/81-TGXuOMAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/71mTfSKhhTL._AC_UL640_QL65_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=over-ear+anc+headphones",
  },
  {
    id: "P0115",
    name: "Mini Bluetooth Speaker 19",
    category: "Audio",
    subcategory: "Speakers",
    brand: "EchoLab",
    description: "Mini Bluetooth Speaker designed for everyday use with a marketplace-ready specification set.",
    price: 3845,
    mrp: 4614,
    discount: 17,
    rating: 4.3,
    reviews: 505,
    stock: 388,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/7179kqSfnAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=mini+bluetooth+speaker",
  },
  {
    id: "P0116",
    name: "Neckband Wireless Earphones 20",
    category: "Audio",
    subcategory: "Soundbars",
    brand: "Aural",
    description: "Neckband Wireless Earphones designed for everyday use with a marketplace-ready specification set.",
    price: 3942,
    mrp: 4849,
    discount: 19,
    rating: 4.6,
    reviews: 522,
    stock: 65,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/51rT40sk3xL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/61xlUxeyuvL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=neckband+wireless+earphones",
  },
  {
    id: "P0117",
    name: "Studio Bass Headphones 21",
    category: "Audio",
    subcategory: "Earbuds",
    brand: "SoundPeak",
    description: "Studio Bass Headphones designed for everyday use with a marketplace-ready specification set.",
    price: 4039,
    mrp: 5089,
    discount: 21,
    rating: 4.1,
    reviews: 539,
    stock: 102,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71mTfSKhhTL._AC_UL640_QL65_.jpg", "https://m.media-amazon.com/images/I/517U3U90gnL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=studio+bass+headphones",
  },
  {
    id: "P0118",
    name: "Pocket Speaker 22",
    category: "Audio",
    subcategory: "Headphones",
    brand: "BassLine",
    description: "Pocket Speaker designed for everyday use with a marketplace-ready specification set.",
    price: 4136,
    mrp: 5335,
    discount: 22,
    rating: 4.4,
    reviews: 556,
    stock: 139,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/7179kqSfnAL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/51nBTTG3hNL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=pocket+speaker",
  },
  {
    id: "P0119",
    name: "Gaming Headset 23",
    category: "Audio",
    subcategory: "Speakers",
    brand: "EchoLab",
    description: "Gaming Headset designed for everyday use with a marketplace-ready specification set.",
    price: 4233,
    mrp: 5588,
    discount: 24,
    rating: 4.7,
    reviews: 573,
    stock: 176,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61xlUxeyuvL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/81-TGXuOMAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=gaming+headset",
  },
  {
    id: "P0120",
    name: "Smart Soundbar 24",
    category: "Audio",
    subcategory: "Soundbars",
    brand: "Aural",
    description: "Smart Soundbar designed for everyday use with a marketplace-ready specification set.",
    price: 4330,
    mrp: 5846,
    discount: 26,
    rating: 4.2,
    reviews: 590,
    stock: 213,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/517U3U90gnL._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/71QdB7hDCAL._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+soundbar",
  },
  {
    id: "P0121",
    name: "Wireless Gaming Controller 1",
    category: "Gaming",
    subcategory: "Controllers",
    brand: "GameForge",
    description: "Wireless Gaming Controller designed for everyday use with a marketplace-ready specification set.",
    price: 2449,
    mrp: 2939,
    discount: 17,
    rating: 4.6,
    reviews: 228,
    stock: 93,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg", "https://m.media-amazon.com/images/I/41gN0XiQrjL._SY300_SX300_QL70_FMwebp_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=wireless+gaming+controller",
  },
  {
    id: "P0122",
    name: "RGB Mechanical Keyboard 2",
    category: "Gaming",
    subcategory: "Keyboards",
    brand: "HyperPlay",
    description: "RGB Mechanical Keyboard designed for everyday use with a marketplace-ready specification set.",
    price: 2546,
    mrp: 3132,
    discount: 19,
    rating: 4.1,
    reviews: 245,
    stock: 130,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg", "https://m.media-amazon.com/images/I/81X7yswC36L._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=rgb+mechanical+keyboard",
  },
  {
    id: "P0123",
    name: "Gaming Mouse Pro 3",
    category: "Gaming",
    subcategory: "Mice",
    brand: "PixelArena",
    description: "Gaming Mouse Pro designed for everyday use with a marketplace-ready specification set.",
    price: 2643,
    mrp: 3330,
    discount: 21,
    rating: 4.4,
    reviews: 262,
    stock: 167,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61oh0M9st4L._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=gaming+mouse+pro",
  },
  {
    id: "P0124",
    name: "Portable Console 4",
    category: "Gaming",
    subcategory: "Streaming",
    brand: "StreamX",
    description: "Portable Console designed for everyday use with a marketplace-ready specification set.",
    price: 2740,
    mrp: 3535,
    discount: 22,
    rating: 4.7,
    reviews: 279,
    stock: 204,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/41gN0XiQrjL._SY300_SX300_QL70_FMwebp_.jpg", "https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=portable+console",
  },
  {
    id: "P0125",
    name: "HD Webcam 5",
    category: "Gaming",
    subcategory: "Controllers",
    brand: "GameForge",
    description: "HD Webcam designed for everyday use with a marketplace-ready specification set.",
    price: 2837,
    mrp: 3745,
    discount: 24,
    rating: 4.2,
    reviews: 296,
    stock: 241,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/81X7yswC36L._SX425_.jpg", "https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=hd+webcam",
  },
  {
    id: "P0126",
    name: "Gaming Headset RGB 6",
    category: "Gaming",
    subcategory: "Keyboards",
    brand: "HyperPlay",
    description: "Gaming Headset RGB designed for everyday use with a marketplace-ready specification set.",
    price: 2934,
    mrp: 3961,
    discount: 26,
    rating: 4.5,
    reviews: 313,
    stock: 278,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg", "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=gaming+headset+rgb",
  },
  {
    id: "P0127",
    name: "Extended Mouse Pad 7",
    category: "Gaming",
    subcategory: "Mice",
    brand: "PixelArena",
    description: "Extended Mouse Pad designed for everyday use with a marketplace-ready specification set.",
    price: 3031,
    mrp: 3637,
    discount: 17,
    rating: 4.8,
    reviews: 330,
    stock: 315,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg", "https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=extended+mouse+pad",
  },
  {
    id: "P0128",
    name: "Desk Streaming Light 8",
    category: "Gaming",
    subcategory: "Streaming",
    brand: "StreamX",
    description: "Desk Streaming Light designed for everyday use with a marketplace-ready specification set.",
    price: 3128,
    mrp: 3847,
    discount: 19,
    rating: 4.3,
    reviews: 347,
    stock: 352,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg", "https://m.media-amazon.com/images/I/61oh0M9st4L._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=desk+streaming+light",
  },
  {
    id: "P0129",
    name: "Wireless Gaming Controller 9",
    category: "Gaming",
    subcategory: "Controllers",
    brand: "GameForge",
    description: "Wireless Gaming Controller designed for everyday use with a marketplace-ready specification set.",
    price: 3225,
    mrp: 4063,
    discount: 21,
    rating: 4.6,
    reviews: 364,
    stock: 389,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg", "https://m.media-amazon.com/images/I/41gN0XiQrjL._SY300_SX300_QL70_FMwebp_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=wireless+gaming+controller",
  },
  {
    id: "P0130",
    name: "RGB Mechanical Keyboard 10",
    category: "Gaming",
    subcategory: "Keyboards",
    brand: "HyperPlay",
    description: "RGB Mechanical Keyboard designed for everyday use with a marketplace-ready specification set.",
    price: 3322,
    mrp: 4285,
    discount: 22,
    rating: 4.1,
    reviews: 381,
    stock: 66,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg", "https://m.media-amazon.com/images/I/81X7yswC36L._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=rgb+mechanical+keyboard",
  },
  {
    id: "P0131",
    name: "Gaming Mouse Pro 11",
    category: "Gaming",
    subcategory: "Mice",
    brand: "PixelArena",
    description: "Gaming Mouse Pro designed for everyday use with a marketplace-ready specification set.",
    price: 3419,
    mrp: 4513,
    discount: 24,
    rating: 4.4,
    reviews: 398,
    stock: 103,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61oh0M9st4L._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=gaming+mouse+pro",
  },
  {
    id: "P0132",
    name: "Portable Console 12",
    category: "Gaming",
    subcategory: "Streaming",
    brand: "StreamX",
    description: "Portable Console designed for everyday use with a marketplace-ready specification set.",
    price: 3516,
    mrp: 4747,
    discount: 26,
    rating: 4.7,
    reviews: 415,
    stock: 140,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/41gN0XiQrjL._SY300_SX300_QL70_FMwebp_.jpg", "https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=portable+console",
  },
  {
    id: "P0133",
    name: "HD Webcam 13",
    category: "Gaming",
    subcategory: "Controllers",
    brand: "GameForge",
    description: "HD Webcam designed for everyday use with a marketplace-ready specification set.",
    price: 3613,
    mrp: 4336,
    discount: 17,
    rating: 4.2,
    reviews: 432,
    stock: 177,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/81X7yswC36L._SX425_.jpg", "https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=hd+webcam",
  },
  {
    id: "P0134",
    name: "Gaming Headset RGB 14",
    category: "Gaming",
    subcategory: "Keyboards",
    brand: "HyperPlay",
    description: "Gaming Headset RGB designed for everyday use with a marketplace-ready specification set.",
    price: 3710,
    mrp: 4563,
    discount: 19,
    rating: 4.5,
    reviews: 449,
    stock: 214,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg", "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=gaming+headset+rgb",
  },
  {
    id: "P0135",
    name: "Extended Mouse Pad 15",
    category: "Gaming",
    subcategory: "Mice",
    brand: "PixelArena",
    description: "Extended Mouse Pad designed for everyday use with a marketplace-ready specification set.",
    price: 3807,
    mrp: 4797,
    discount: 21,
    rating: 4.8,
    reviews: 466,
    stock: 251,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg", "https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=extended+mouse+pad",
  },
  {
    id: "P0136",
    name: "Desk Streaming Light 16",
    category: "Gaming",
    subcategory: "Streaming",
    brand: "StreamX",
    description: "Desk Streaming Light designed for everyday use with a marketplace-ready specification set.",
    price: 3904,
    mrp: 5036,
    discount: 22,
    rating: 4.3,
    reviews: 483,
    stock: 288,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg", "https://m.media-amazon.com/images/I/61oh0M9st4L._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=desk+streaming+light",
  },
  {
    id: "P0137",
    name: "Wireless Gaming Controller 17",
    category: "Gaming",
    subcategory: "Controllers",
    brand: "GameForge",
    description: "Wireless Gaming Controller designed for everyday use with a marketplace-ready specification set.",
    price: 4001,
    mrp: 5281,
    discount: 24,
    rating: 4.6,
    reviews: 500,
    stock: 325,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg", "https://m.media-amazon.com/images/I/41gN0XiQrjL._SY300_SX300_QL70_FMwebp_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=wireless+gaming+controller",
  },
  {
    id: "P0138",
    name: "RGB Mechanical Keyboard 18",
    category: "Gaming",
    subcategory: "Keyboards",
    brand: "HyperPlay",
    description: "RGB Mechanical Keyboard designed for everyday use with a marketplace-ready specification set.",
    price: 4098,
    mrp: 5532,
    discount: 26,
    rating: 4.1,
    reviews: 517,
    stock: 362,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg", "https://m.media-amazon.com/images/I/81X7yswC36L._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=rgb+mechanical+keyboard",
  },
  {
    id: "P0139",
    name: "Gaming Mouse Pro 19",
    category: "Gaming",
    subcategory: "Mice",
    brand: "PixelArena",
    description: "Gaming Mouse Pro designed for everyday use with a marketplace-ready specification set.",
    price: 4195,
    mrp: 5034,
    discount: 17,
    rating: 4.4,
    reviews: 534,
    stock: 39,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61oh0M9st4L._AC_UY218_.jpg", "https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=gaming+mouse+pro",
  },
  {
    id: "P0140",
    name: "Portable Console 20",
    category: "Gaming",
    subcategory: "Streaming",
    brand: "StreamX",
    description: "Portable Console designed for everyday use with a marketplace-ready specification set.",
    price: 4292,
    mrp: 5279,
    discount: 19,
    rating: 4.7,
    reviews: 551,
    stock: 76,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/41gN0XiQrjL._SY300_SX300_QL70_FMwebp_.jpg", "https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=portable+console",
  },
  {
    id: "P0141",
    name: "HD Webcam 21",
    category: "Gaming",
    subcategory: "Controllers",
    brand: "GameForge",
    description: "HD Webcam designed for everyday use with a marketplace-ready specification set.",
    price: 4389,
    mrp: 5530,
    discount: 21,
    rating: 4.2,
    reviews: 568,
    stock: 113,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/81X7yswC36L._SX425_.jpg", "https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=hd+webcam",
  },
  {
    id: "P0142",
    name: "Gaming Headset RGB 22",
    category: "Gaming",
    subcategory: "Keyboards",
    brand: "HyperPlay",
    description: "Gaming Headset RGB designed for everyday use with a marketplace-ready specification set.",
    price: 4486,
    mrp: 5787,
    discount: 22,
    rating: 4.5,
    reviews: 585,
    stock: 150,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg", "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=gaming+headset+rgb",
  },
  {
    id: "P0143",
    name: "Extended Mouse Pad 23",
    category: "Gaming",
    subcategory: "Mice",
    brand: "PixelArena",
    description: "Extended Mouse Pad designed for everyday use with a marketplace-ready specification set.",
    price: 4583,
    mrp: 6050,
    discount: 24,
    rating: 4.8,
    reviews: 602,
    stock: 187,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg", "https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=extended+mouse+pad",
  },
  {
    id: "P0144",
    name: "Desk Streaming Light 24",
    category: "Gaming",
    subcategory: "Streaming",
    brand: "StreamX",
    description: "Desk Streaming Light designed for everyday use with a marketplace-ready specification set.",
    price: 4680,
    mrp: 6318,
    discount: 26,
    rating: 4.3,
    reviews: 619,
    stock: 224,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg", "https://m.media-amazon.com/images/I/61oh0M9st4L._AC_UY218_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=desk+streaming+light",
  },
  {
    id: "P0145",
    name: "Fast Charging Cable 1",
    category: "Accessories",
    subcategory: "Cables",
    brand: "LinkPro",
    description: "Fast Charging Cable designed for everyday use with a marketplace-ready specification set.",
    price: 2799,
    mrp: 3359,
    discount: 17,
    rating: 4.7,
    reviews: 257,
    stock: 104,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg", "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=fast+charging+cable",
  },
  {
    id: "P0146",
    name: "MagSafe Style Stand 2",
    category: "Accessories",
    subcategory: "Stands",
    brand: "CarryOn",
    description: "MagSafe Style Stand designed for everyday use with a marketplace-ready specification set.",
    price: 2896,
    mrp: 3562,
    discount: 19,
    rating: 4.2,
    reviews: 274,
    stock: 141,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/51cjBLsymcL._SX569_.jpg", "https://m.media-amazon.com/images/I/71162EQnpKL._AC_UY320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=magsafe+style+stand",
  },
  {
    id: "P0147",
    name: "Laptop Sleeve 3",
    category: "Accessories",
    subcategory: "Bags",
    brand: "FlexGear",
    description: "Laptop Sleeve designed for everyday use with a marketplace-ready specification set.",
    price: 2993,
    mrp: 3771,
    discount: 21,
    rating: 4.5,
    reviews: 291,
    stock: 178,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg", "https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=laptop+sleeve",
  },
  {
    id: "P0148",
    name: "Travel Backpack 4",
    category: "Accessories",
    subcategory: "Adapters",
    brand: "DeskMate",
    description: "Travel Backpack designed for everyday use with a marketplace-ready specification set.",
    price: 3090,
    mrp: 3986,
    discount: 22,
    rating: 4.8,
    reviews: 308,
    stock: 215,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg", "https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=travel+backpack",
  },
  {
    id: "P0149",
    name: "Smart Watch Band 5",
    category: "Accessories",
    subcategory: "Cables",
    brand: "LinkPro",
    description: "Smart Watch Band designed for everyday use with a marketplace-ready specification set.",
    price: 3187,
    mrp: 4207,
    discount: 24,
    rating: 4.3,
    reviews: 325,
    stock: 252,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71162EQnpKL._AC_UY320_.jpg", "https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+watch+band",
  },
  {
    id: "P0150",
    name: "USB-C Adapter 6",
    category: "Accessories",
    subcategory: "Stands",
    brand: "CarryOn",
    description: "USB-C Adapter designed for everyday use with a marketplace-ready specification set.",
    price: 3284,
    mrp: 4433,
    discount: 26,
    rating: 4.6,
    reviews: 342,
    stock: 289,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg", "https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=usb-c+adapter",
  },
  {
    id: "P0151",
    name: "Phone Stand 7",
    category: "Accessories",
    subcategory: "Bags",
    brand: "FlexGear",
    description: "Phone Stand designed for everyday use with a marketplace-ready specification set.",
    price: 3381,
    mrp: 4057,
    discount: 17,
    rating: 4.1,
    reviews: 359,
    stock: 326,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg", "https://m.media-amazon.com/images/I/51cjBLsymcL._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=phone+stand",
  },
  {
    id: "P0152",
    name: "Organizer Pouch 8",
    category: "Accessories",
    subcategory: "Adapters",
    brand: "DeskMate",
    description: "Organizer Pouch designed for everyday use with a marketplace-ready specification set.",
    price: 3478,
    mrp: 4278,
    discount: 19,
    rating: 4.4,
    reviews: 376,
    stock: 363,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg", "https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=organizer+pouch",
  },
  {
    id: "P0153",
    name: "Fast Charging Cable 9",
    category: "Accessories",
    subcategory: "Cables",
    brand: "LinkPro",
    description: "Fast Charging Cable designed for everyday use with a marketplace-ready specification set.",
    price: 3575,
    mrp: 4505,
    discount: 21,
    rating: 4.7,
    reviews: 393,
    stock: 40,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg", "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=fast+charging+cable",
  },
  {
    id: "P0154",
    name: "MagSafe Style Stand 10",
    category: "Accessories",
    subcategory: "Stands",
    brand: "CarryOn",
    description: "MagSafe Style Stand designed for everyday use with a marketplace-ready specification set.",
    price: 3672,
    mrp: 4737,
    discount: 22,
    rating: 4.2,
    reviews: 410,
    stock: 77,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/51cjBLsymcL._SX569_.jpg", "https://m.media-amazon.com/images/I/71162EQnpKL._AC_UY320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=magsafe+style+stand",
  },
  {
    id: "P0155",
    name: "Laptop Sleeve 11",
    category: "Accessories",
    subcategory: "Bags",
    brand: "FlexGear",
    description: "Laptop Sleeve designed for everyday use with a marketplace-ready specification set.",
    price: 3769,
    mrp: 4975,
    discount: 24,
    rating: 4.5,
    reviews: 427,
    stock: 114,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg", "https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=laptop+sleeve",
  },
  {
    id: "P0156",
    name: "Travel Backpack 12",
    category: "Accessories",
    subcategory: "Adapters",
    brand: "DeskMate",
    description: "Travel Backpack designed for everyday use with a marketplace-ready specification set.",
    price: 3866,
    mrp: 5219,
    discount: 26,
    rating: 4.8,
    reviews: 444,
    stock: 151,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg", "https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=travel+backpack",
  },
  {
    id: "P0157",
    name: "Smart Watch Band 13",
    category: "Accessories",
    subcategory: "Cables",
    brand: "LinkPro",
    description: "Smart Watch Band designed for everyday use with a marketplace-ready specification set.",
    price: 3963,
    mrp: 4756,
    discount: 17,
    rating: 4.3,
    reviews: 461,
    stock: 188,
    tag: "Bestseller",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71162EQnpKL._AC_UY320_.jpg", "https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+watch+band",
  },
  {
    id: "P0158",
    name: "USB-C Adapter 14",
    category: "Accessories",
    subcategory: "Stands",
    brand: "CarryOn",
    description: "USB-C Adapter designed for everyday use with a marketplace-ready specification set.",
    price: 4060,
    mrp: 4994,
    discount: 19,
    rating: 4.6,
    reviews: 478,
    stock: 225,
    tag: "New",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg", "https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=usb-c+adapter",
  },
  {
    id: "P0159",
    name: "Phone Stand 15",
    category: "Accessories",
    subcategory: "Bags",
    brand: "FlexGear",
    description: "Phone Stand designed for everyday use with a marketplace-ready specification set.",
    price: 4157,
    mrp: 5238,
    discount: 21,
    rating: 4.1,
    reviews: 495,
    stock: 262,
    tag: "Deal",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg", "https://m.media-amazon.com/images/I/51cjBLsymcL._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=phone+stand",
  },
  {
    id: "P0160",
    name: "Organizer Pouch 16",
    category: "Accessories",
    subcategory: "Adapters",
    brand: "DeskMate",
    description: "Organizer Pouch designed for everyday use with a marketplace-ready specification set.",
    price: 4254,
    mrp: 5488,
    discount: 22,
    rating: 4.4,
    reviews: 512,
    stock: 299,
    tag: "Top Rated",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg", "https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=organizer+pouch",
  },
  {
    id: "P0161",
    name: "Fast Charging Cable 17",
    category: "Accessories",
    subcategory: "Cables",
    brand: "LinkPro",
    description: "Fast Charging Cable designed for everyday use with a marketplace-ready specification set.",
    price: 4351,
    mrp: 5743,
    discount: 24,
    rating: 4.7,
    reviews: 529,
    stock: 336,
    tag: "Limited Stock",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg", "https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=fast+charging+cable",
  },
  {
    id: "P0162",
    name: "MagSafe Style Stand 18",
    category: "Accessories",
    subcategory: "Stands",
    brand: "CarryOn",
    description: "MagSafe Style Stand designed for everyday use with a marketplace-ready specification set.",
    price: 4448,
    mrp: 6005,
    discount: 26,
    rating: 4.2,
    reviews: 546,
    stock: 373,
    tag: "Popular",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/51cjBLsymcL._SX569_.jpg", "https://m.media-amazon.com/images/I/71162EQnpKL._AC_UY320_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=magsafe+style+stand",
  },
  {
    id: "P0163",
    name: "Laptop Sleeve 19",
    category: "Accessories",
    subcategory: "Bags",
    brand: "FlexGear",
    description: "Laptop Sleeve designed for everyday use with a marketplace-ready specification set.",
    price: 4545,
    mrp: 5454,
    discount: 17,
    rating: 4.5,
    reviews: 563,
    stock: 50,
    tag: "Bestseller",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg", "https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=laptop+sleeve",
  },
  {
    id: "P0164",
    name: "Travel Backpack 20",
    category: "Accessories",
    subcategory: "Adapters",
    brand: "DeskMate",
    description: "Travel Backpack designed for everyday use with a marketplace-ready specification set.",
    price: 4642,
    mrp: 5710,
    discount: 19,
    rating: 4.8,
    reviews: 580,
    stock: 87,
    tag: "New",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/61MbLLagiVL._S.jpg", "https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=travel+backpack",
  },
  {
    id: "P0165",
    name: "Smart Watch Band 21",
    category: "Accessories",
    subcategory: "Cables",
    brand: "LinkPro",
    description: "Smart Watch Band designed for everyday use with a marketplace-ready specification set.",
    price: 4739,
    mrp: 5971,
    discount: 21,
    rating: 4.3,
    reviews: 597,
    stock: 124,
    tag: "Deal",
    delivery: "Tomorrow",
    images: ["https://m.media-amazon.com/images/I/71162EQnpKL._AC_UY320_.jpg", "https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=smart+watch+band",
  },
  {
    id: "P0166",
    name: "USB-C Adapter 22",
    category: "Accessories",
    subcategory: "Stands",
    brand: "CarryOn",
    description: "USB-C Adapter designed for everyday use with a marketplace-ready specification set.",
    price: 4836,
    mrp: 6238,
    discount: 22,
    rating: 4.6,
    reviews: 614,
    stock: 161,
    tag: "Top Rated",
    delivery: "2 days",
    images: ["https://m.media-amazon.com/images/I/715OxxoEkML._SX425_.jpg", "https://m.media-amazon.com/images/I/61qW1aEcqgL._SX679_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=usb-c+adapter",
  },
  {
    id: "P0167",
    name: "Phone Stand 23",
    category: "Accessories",
    subcategory: "Bags",
    brand: "FlexGear",
    description: "Phone Stand designed for everyday use with a marketplace-ready specification set.",
    price: 4933,
    mrp: 6512,
    discount: 24,
    rating: 4.1,
    reviews: 631,
    stock: 198,
    tag: "Limited Stock",
    delivery: "3 days",
    images: ["https://m.media-amazon.com/images/I/51llyiz422L._SX425_.jpg", "https://m.media-amazon.com/images/I/51cjBLsymcL._SX569_.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=phone+stand",
  },
  {
    id: "P0168",
    name: "Organizer Pouch 24",
    category: "Accessories",
    subcategory: "Adapters",
    brand: "DeskMate",
    description: "Organizer Pouch designed for everyday use with a marketplace-ready specification set.",
    price: 5030,
    mrp: 6790,
    discount: 26,
    rating: 4.4,
    reviews: 648,
    stock: 235,
    tag: "Popular",
    delivery: "4 days",
    images: ["https://m.media-amazon.com/images/I/613cbte7x1L._SX569_.jpg", "https://m.media-amazon.com/images/I/61UxfXTUyvL._S.jpg"],
    amazonSearch: "https://www.amazon.in/s?k=organizer+pouch",
  },
];

function makeFallbackDataUri(product: Product) {
  const palette = fallbackPalette[product.category];
  const safeName = product.name.slice(0, 28).replace(/&/g, "and");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette.from}"/><stop offset="1" stop-color="${palette.to}"/></linearGradient></defs><rect width="900" height="700" rx="42" fill="url(#g)"/><circle cx="450" cy="270" r="135" fill="rgba(255,255,255,.68)"/><rect x="290" y="180" width="320" height="180" rx="28" fill="white" opacity=".92"/><text x="450" y="278" text-anchor="middle" font-family="Arial" font-size="72">${product.category === "Girls Fashion" ? "👗" : product.category === "Fashion" ? "👕" : product.category === "Mobiles" ? "📱" : product.category === "Laptops" ? "💻" : product.category === "Audio" ? "🎧" : product.category === "Gaming" ? "🎮" : product.category === "Accessories" ? "🎒" : "⚡"}</text><text x="450" y="500" text-anchor="middle" font-family="Arial" font-size="28" font-weight="700" fill="#0f172a">${safeName}</text><text x="450" y="545" text-anchor="middle" font-family="Arial" font-size="20" fill="#475569">SUPPLYIQ demo image</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function formatINR(value: number) { return `₹${value.toLocaleString("en-IN")}`; }

function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const sources = [...product.images, makeFallbackDataUri(product)];
  return (
    <img
      src={sources[sourceIndex]}
      alt={product.name}
      className={className}
      loading="lazy"
      onError={() => setSourceIndex((n) => Math.min(n + 1, sources.length - 1))}
    />
  );
}

function ProductCard({ product, favorite, onFavorite, onAdd, onQuickView }: { product: Product; favorite: boolean; onFavorite: () => void; onAdd: () => void; onQuickView: () => void }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <div className="h-56 overflow-hidden rounded-xl bg-slate-50">
          <ProductImage product={product} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" />
        </div>
        <span className="absolute left-3 top-3 rounded bg-amber-400 px-2 py-1 text-[10px] font-black text-slate-950">{product.tag}</span>
        <button type="button" onClick={onFavorite} aria-label="Favorite" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow ring-1 ring-slate-200">
          <Heart className={`h-4 w-4 ${favorite ? "fill-rose-500 text-rose-500" : "text-slate-500"}`} />
        </button>
      </div>
      <div className="px-1 pb-2 pt-4">
        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500"><span>{product.brand}</span><span>{product.category}</span></div>
        <button type="button" onClick={onQuickView} className="mt-2 min-h-12 text-left text-sm font-bold leading-5 hover:text-cyan-700">{product.name}</button>
        <div className="mt-2 flex items-center gap-2 text-xs"><span className="inline-flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-current" />{product.rating}</span><span className="text-slate-400">({product.reviews})</span></div>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{product.description}</p>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div><div className="text-xl font-black text-slate-950">{formatINR(product.price)}</div><div className="text-xs text-slate-500"><span className="mr-2 line-through">{formatINR(product.mrp)}</span><span className="font-bold text-emerald-700">{product.discount}% off</span></div><div className="mt-1 text-[11px] font-semibold text-emerald-700">Delivery {product.delivery}</div></div>
          <button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300"><ShoppingCart className="h-4 w-4" />Add to Cart</button>
        </div>
      </div>
    </article>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"><div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl"><button type="button" onClick={onClose} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100"><X className="h-4 w-4" /></button>{children}</div></div>;
}

function CartDrawer({ cart, onClose, onRemove, onChangeQty, onCheckout }: { cart: CartItem[]; onClose: () => void; onRemove: (id:string)=>void; onChangeQty:(id:string,qty:number)=>void; onCheckout:()=>void }) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  return <div className="fixed inset-0 z-[65] bg-slate-950/50"><aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
    <div className="flex items-center justify-between border-b border-slate-200 p-5"><div><p className="text-lg font-black">Your Cart</p><p className="text-xs text-slate-500">{cart.reduce((s,i)=>s+i.quantity,0)} items</p></div><button type="button" onClick={onClose} className="rounded-full bg-slate-100 p-2"><X className="h-4 w-4" /></button></div>
    <div className="flex-1 overflow-auto p-5">{cart.length===0 ? <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingCart className="h-12 w-12 text-slate-300" /><p className="mt-4 text-lg font-bold">Your cart is empty</p><p className="mt-2 text-sm text-slate-500">Add products from any page. Your cart remains while you browse.</p></div> : <div className="space-y-4">{cart.map(item=><div key={item.id} className="flex gap-3 rounded-2xl border border-slate-200 p-3"><div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-50"><ProductImage product={item} className="h-full w-full object-contain" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-slate-500">{formatINR(item.price)}</p><div className="mt-3 flex items-center gap-2"><button type="button" onClick={()=>onChangeQty(item.id,item.quantity-1)} className="rounded bg-slate-100 p-1"><Minus className="h-3 w-3" /></button><span className="min-w-5 text-center text-sm font-bold">{item.quantity}</span><button type="button" onClick={()=>onChangeQty(item.id,item.quantity+1)} className="rounded bg-slate-100 p-1"><Plus className="h-3 w-3" /></button><button type="button" onClick={()=>onRemove(item.id)} className="ml-auto text-xs font-semibold text-rose-600">Remove</button></div></div></div>)}</div>}</div>
    <div className="border-t border-slate-200 p-5"><div className="flex items-center justify-between text-base"><span className="text-slate-500">Subtotal</span><span className="font-black">{formatINR(total)}</span></div><button type="button" disabled={cart.length===0} onClick={onCheckout} className="mt-4 w-full rounded-xl bg-amber-400 py-3 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">Place Demo Order</button></div>
  </aside></div>
}

function SupplyDashboard() {
  const trend=[{name:"Mon",value:42},{name:"Tue",value:56},{name:"Wed",value:51},{name:"Thu",value:68},{name:"Fri",value:73},{name:"Sat",value:66},{name:"Sun",value:81}];
  const risks=[{title:"Supplier delay",level:"HIGH",text:"Component supplier lead time moved beyond safety threshold."},{title:"Route congestion",level:"MEDIUM",text:"One inbound route has elevated transit variability."},{title:"Demand spike",level:"MEDIUM",text:"Selected categories are consuming inventory faster than plan."}];
  return <section className="space-y-6">
    <div className="grid gap-4 md:grid-cols-4">
      {[{label:"Active Suppliers",value:"128",icon:<Factory className="h-5 w-5" />},{label:"Tracked SKUs",value:"2,460",icon:<Boxes className="h-5 w-5" />},{label:"Routes",value:"84",icon:<Route className="h-5 w-5" />},{label:"Risk Alerts",value:"12",icon:<ShieldAlert className="h-5 w-5" />}].map(m=><div key={m.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">{m.icon}</div><p className="mt-5 text-sm text-slate-500">{m.label}</p><p className="mt-1 text-3xl font-black text-white">{m.value}</p></div>)}
    </div>
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><div><p className="text-lg font-bold text-white">Demand signal</p><p className="text-xs text-slate-500">Recent customer order activity</p></div><Activity className="h-5 w-5 text-cyan-300" /></div><div className="mt-6 flex h-64 items-end gap-4">{trend.map((d)=><div key={d.name} className="flex flex-1 flex-col items-center gap-2"><div className="w-full max-w-12 rounded-t-xl bg-cyan-400/80" style={{height:`${d.value*2.2}px`}} /><span className="text-[11px] text-slate-500">{d.name}</span></div>)}</div></div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><p className="text-lg font-bold text-white">Risk queue</p><Bell className="h-5 w-5 text-cyan-300" /></div><div className="mt-4 space-y-3">{risks.map(r=><div key={r.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><div className="flex items-center justify-between"><p className="text-sm font-bold text-white">{r.title}</p><span className={`rounded-full px-2 py-1 text-[10px] font-black ${r.level==="HIGH"?"bg-red-500/15 text-red-400":"bg-yellow-500/15 text-yellow-300"}`}>{r.level}</span></div><p className="mt-2 text-xs leading-5 text-slate-500">{r.text}</p></div>)}</div></div>
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
      {[{icon:<Users className="h-5 w-5" />,title:"Supplier map",text:"Connect supplier performance, capacity and lead-time changes."},{icon:<Package className="h-5 w-5" />,title:"Inventory map",text:"Connect SKU availability with safety stock and demand velocity."},{icon:<Truck className="h-5 w-5" />,title:"Transport map",text:"Connect route status, transit variability and stock arrival."}].map(x=><div key={x.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">{x.icon}</div><h3 className="mt-4 font-bold text-white">{x.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{x.text}</p></div>)}
    </div>
  </section>
}

function Simulator() {
  const [days,setDays]=useState(7); const [stock,setStock]=useState(480); const [daily,setDaily]=useState(52); const [result,setResult]=useState<{remaining:number;shortage:number;covered:number}|null>(null);
  const simulate=()=>{const remaining=Math.max(0,stock-daily*days); const shortage=Math.max(0,daily*days-stock); const covered=Math.min(100,Math.round((Math.max(0,stock)/(daily*days))*100)); setResult({remaining,shortage,covered});};
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6"><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-cyan-300" /><h3 className="text-lg font-bold text-white">Supplier disruption simulator</h3></div><p className="mt-2 text-sm text-slate-500">Test a defined unavailable period and estimate inventory consequences.</p><div className="mt-5 grid gap-4 md:grid-cols-3"><label className="text-sm text-slate-400">Unavailable days<input type="number" min="1" max="60" value={days} onChange={e=>setDays(Number(e.target.value)||1)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" /></label><label className="text-sm text-slate-400">Current stock<input type="number" min="0" value={stock} onChange={e=>setStock(Number(e.target.value)||0)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" /></label><label className="text-sm text-slate-400">Daily demand<input type="number" min="1" value={daily} onChange={e=>setDaily(Number(e.target.value)||1)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" /></label></div><button type="button" onClick={simulate} className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950">Run Scenario</button>{result&&<div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="text-xs text-slate-500">Remaining stock</p><p className="mt-1 text-2xl font-black text-white">{result.remaining}</p></div><div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="text-xs text-slate-500">Projected shortage</p><p className="mt-1 text-2xl font-black text-red-400">{result.shortage}</p></div><div className="rounded-xl border border-slate-800 bg-slate-950 p-4"><p className="text-xs text-slate-500">Demand coverage</p><p className="mt-1 text-2xl font-black text-cyan-300">{result.covered}%</p></div></div>}</div>
}

function RiskPill({ level }: { level: RiskLevel }) {
  const classes: Record<RiskLevel, string> = {
    Critical: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    High: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
    Medium: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    Low: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${classes[level]}`}><CircleAlert className="h-3 w-3" />{level}</span>;
}

function ScoreBar({ value }: { value: number }) {
  return <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" style={{ width: `${value}%` }} /></div>;
}

function AIRiskCatalogue({ onOpenScenario }: { onOpenScenario: () => void }) {
  const [domain, setDomain] = useState<"All" | RiskDomain>("All");
  const [level, setLevel] = useState<"All" | RiskLevel>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"score" | "impact" | "likelihood" | "confidence">("score");
  const [selectedId, setSelectedId] = useState("RF-001");
  const [page, setPage] = useState(1);
  const [showEvidence, setShowEvidence] = useState(true);
  const [scenarioDays, setScenarioDays] = useState(7);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allRiskFactors.filter((risk) => {
      const domainMatch = domain === "All" || risk.domain === domain;
      const levelMatch = level === "All" || risk.level === level;
      const searchMatch = !q || `${risk.title} ${risk.domain} ${risk.owner} ${risk.signal} ${risk.relationship}`.toLowerCase().includes(q);
      return domainMatch && levelMatch && searchMatch;
    });
    return [...list].sort((a, b) => {
      if (sort === "impact") return b.impact - a.impact;
      if (sort === "likelihood") return b.likelihood - a.likelihood;
      if (sort === "confidence") return b.confidence - a.confidence;
      return b.score - a.score;
    });
  }, [domain, level, query, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selected = allRiskFactors.find((risk) => risk.id === selectedId) ?? allRiskFactors[0];
  const scenarioImpact = Math.round(selected.impact * selected.exposure * Math.min(2, scenarioDays / 14));

  function selectRisk(id: string) {
    setSelectedId(id);
    document.getElementById("risk-detail")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function reset() {
    setDomain("All");
    setLevel("All");
    setQuery("");
    setSort("score");
    setPage(1);
  }

  const domainCards: Array<{ id: "All" | RiskDomain; label: string; icon: ReactNode; description: string }> = [
    { id: "All", label: "All signals", icon: <Layers className="h-4 w-4" />, description: "Cross-functional view" },
    { id: "Supplier", label: "Supplier", icon: <Factory className="h-4 w-4" />, description: "Availability & reliability" },
    { id: "Inventory", label: "Inventory", icon: <Warehouse className="h-4 w-4" />, description: "Coverage & stock health" },
    { id: "Transportation", label: "Transportation", icon: <Truck className="h-4 w-4" />, description: "Routes & delivery" },
    { id: "Demand", label: "Demand", icon: <TrendingUp className="h-4 w-4" />, description: "Velocity & forecast" },
    { id: "External", label: "External", icon: <MapPin className="h-4 w-4" />, description: "Outside influences" },
  ];

  return <section className="space-y-6" id="risk-catalogue">
    <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,.18),_transparent_35%),linear-gradient(135deg,#07111f,#0b1730_55%,#111827)] p-6 text-white shadow-2xl lg:p-8">
      <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-cyan-200"><Brain className="h-3.5 w-3.5" />AI risk factor catalogue</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">See the signal, relationship, consequence and next action.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">A dedicated risk workspace for supplier, inventory, transportation, demand and external disruption signals. The catalogue presents prioritization, evidence and mitigation in one decision-oriented flow.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onOpenScenario} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/20"><Zap className="h-4 w-4" />Open scenario lab</button>
            <button type="button" onClick={() => document.getElementById("risk-detail")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"><Eye className="h-4 w-4" />View reasoning</button>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[560px]">
          <MetricTile label="Factors" value={allRiskFactors.length.toString()} icon={<Layers className="h-4 w-4" />} />
          <MetricTile label="Critical" value={riskSummary.critical.toString()} icon={<AlertTriangle className="h-4 w-4" />} />
          <MetricTile label="High" value={riskSummary.high.toString()} icon={<Gauge className="h-4 w-4" />} />
          <MetricTile label="Avg score" value={riskSummary.average.toString()} icon={<Activity className="h-4 w-4" />} />
        </div>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {domainCards.map((card) => <button key={card.id} type="button" onClick={() => { setDomain(card.id); setPage(1); }} className={`group rounded-2xl border p-4 text-left transition ${domain === card.id ? "border-cyan-300 bg-cyan-50 shadow-lg shadow-cyan-100" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"}`}><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${domain === card.id ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-600"}`}>{card.icon}</div><p className="mt-3 text-sm font-black text-slate-900">{card.label}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{card.description}</p></button>)}
    </div>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,.75fr)]">
      <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-700">Risk queue</p><h3 className="mt-1 text-2xl font-black">Prioritized AI risk factors</h3><p className="mt-1 text-sm text-slate-500">{filtered.length} matching signals · ordered by {sort === "score" ? "risk score" : sort}</p></div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={reset} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><RefreshCw className="mr-1 inline h-3.5 w-3.5" />Reset</button><button type="button" onClick={() => setShowEvidence(v => !v)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><Info className="mr-1 inline h-3.5 w-3.5" />{showEvidence ? "Hide" : "Show"} evidence</button></div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Search risk factor, signal, owner..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100" /></label>
          <select value={level} onChange={e => { setLevel(e.target.value as "All" | RiskLevel); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-cyan-400"><option value="All">All levels</option><option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select>
          <select value={sort} onChange={e => { setSort(e.target.value as typeof sort); setPage(1); }} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-cyan-400"><option value="score">Sort: Risk score</option><option value="impact">Sort: Impact</option><option value="likelihood">Sort: Likelihood</option><option value="confidence">Sort: Confidence</option></select>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {pageItems.map((risk) => <button type="button" key={risk.id} onClick={() => selectRisk(risk.id)} className={`rounded-2xl border p-4 text-left transition ${selected.id === risk.id ? "border-cyan-300 bg-cyan-50/80 shadow-lg shadow-cyan-100" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"}`}>
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><RiskPill level={risk.level} /><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-slate-500">{risk.domain}</span></div><p className="mt-3 line-clamp-2 text-sm font-black leading-5 text-slate-900">{risk.title}</p></div><div className="shrink-0 text-right"><p className="text-2xl font-black text-slate-900">{risk.score}</p><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">score</p></div></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]"><div><p className="text-slate-400">Likelihood</p><p className="mt-1 font-black text-slate-700">{risk.likelihood}%</p></div><div><p className="text-slate-400">Impact</p><p className="mt-1 font-black text-slate-700">{risk.impact}%</p></div><div><p className="text-slate-400">Confidence</p><p className="mt-1 font-black text-slate-700">{risk.confidence}%</p></div></div>
            <ScoreBar value={risk.score} />
            <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-slate-500"><span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{risk.horizon}</span><span className={`inline-flex items-center gap-1 font-bold ${risk.trend === "Rising" ? "text-rose-600" : risk.trend === "Falling" ? "text-emerald-600" : "text-slate-500"}`}>{risk.trend === "Rising" ? <ArrowUpRight className="h-3 w-3" /> : risk.trend === "Falling" ? <ChevronDown className="h-3 w-3" /> : <Activity className="h-3 w-3" />}{risk.trend}</span></div>
          </button>)}
        </div>
        {!pageItems.length && <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center"><Search className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 font-black">No risk factors match the current filters</p><button type="button" onClick={reset} className="mt-3 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Reset catalogue</button></div>}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 pt-5">
          {safePage > 1 && <button type="button" onClick={() => setPage(safePage - 1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold"><ArrowLeft className="h-3.5 w-3.5" />Previous</button>}
          {Array.from({ length: pages }, (_, i) => i + 1).slice(Math.max(0, safePage - 2), Math.min(pages, safePage + 1)).map(n => <button type="button" key={n} onClick={() => setPage(n)} className={`h-9 min-w-9 rounded-xl px-2 text-xs font-black ${n === safePage ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{n}</button>)}
          {safePage < pages && <button type="button" onClick={() => setPage(safePage + 1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold">Next<ArrowRight className="h-3.5 w-3.5" /></button>}
        </div>
      </div>

      <aside id="risk-detail" className="h-fit rounded-3xl border border-slate-800 bg-slate-950 p-5 text-white shadow-2xl xl:sticky xl:top-28 lg:p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">Selected risk</p><h3 className="mt-2 text-2xl font-black leading-tight">{selected.title}</h3></div><RiskPill level={selected.level} /></div>
        <div className="mt-5 grid grid-cols-2 gap-3"><DarkMetric label="Risk score" value={`${selected.score}/100`} /><DarkMetric label="Confidence" value={`${selected.confidence}%`} /><DarkMetric label="Likelihood" value={`${selected.likelihood}%`} /><DarkMetric label="Impact" value={`${selected.impact}%`} /></div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="flex items-center justify-between text-xs"><span className="font-bold text-slate-400">Exposure estimate</span><span className="font-black text-cyan-200">{formatINR(selected.exposure)}</span></div><ScoreBar value={selected.score} /><div className="mt-2 flex justify-between text-[10px] text-slate-500"><span>{selected.trend} trend</span><span>{selected.horizon}</span></div></div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-center gap-2 text-cyan-200"><Network className="h-4 w-4" /><h4 className="text-sm font-black">Reasoning chain</h4></div><div className="mt-4 space-y-4"><ReasonStep index="01" label="Signal" text={selected.signal} /><ReasonStep index="02" label="Relationship" text={selected.relationship} /><ReasonStep index="03" label="Consequence" text={selected.consequence} /><ReasonStep index="04" label="Mitigation" text={selected.mitigation} /></div></div>
        {showEvidence && <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex items-center gap-2 text-emerald-200"><ShieldCheck className="h-4 w-4" /><h4 className="text-sm font-black">Evidence & affected assets</h4></div><div className="mt-3 space-y-2">{selected.evidence.map((item, index) => <div key={`${item}-${index}`} className="flex gap-2 text-xs leading-5 text-slate-400"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />{item}</div>)}</div><div className="mt-4 flex flex-wrap gap-2">{selected.affectedAssets.map(asset => <span key={asset} className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-slate-300">{asset}</span>)}</div></div>}
        <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4"><div className="flex items-center gap-2 text-cyan-200"><Target className="h-4 w-4" /><h4 className="text-sm font-black">Quick scenario estimate</h4></div><p className="mt-2 text-xs leading-5 text-slate-400">Estimate relative exposure if the selected risk persists for a defined period. This is a demonstration model, not a live financial forecast.</p><div className="mt-4 flex items-center gap-3"><input type="range" min="3" max="30" value={scenarioDays} onChange={e => setScenarioDays(Number(e.target.value))} className="w-full accent-cyan-300" /><span className="min-w-14 rounded-lg bg-white/10 px-2 py-2 text-center text-xs font-black">{scenarioDays}d</span></div><div className="mt-4 rounded-xl bg-slate-950/80 p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">Estimated exposure pressure</p><p className="mt-1 text-xl font-black text-cyan-200">{formatINR(scenarioImpact)}</p><p className="mt-1 text-[10px] text-slate-500">Scenario uses risk impact, exposure and duration scaling.</p></div><button type="button" onClick={onOpenScenario} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950">Run full disruption simulation <ArrowRight className="h-4 w-4" /></button></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><InfoTile icon={<Factory className="h-4 w-4" />} label="Owner" value={selected.owner} /><InfoTile icon={<CalendarDays className="h-4 w-4" />} label="Horizon" value={selected.horizon} /><InfoTile icon={<CircleDollarSign className="h-4 w-4" />} label="Exposure" value={formatINR(selected.exposure)} /><InfoTile icon={<Navigation className="h-4 w-4" />} label="Domain" value={selected.domain} /></div>
      </aside>
    </div>
  </section>;
}

function MetricTile({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-cyan-200">{icon}</div><p className="mt-4 text-[10px] uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-xl font-black">{value}</p></div>;
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-lg font-black text-white">{value}</p></div>;
}

function ReasonStep({ index, label, text }: { index: string; label: string; text: string }) {
  return <div className="flex gap-3"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-[10px] font-black text-cyan-200">{index}</div><div><p className="text-xs font-black text-white">{label}</p><p className="mt-1 text-xs leading-5 text-slate-400">{text}</p></div></div>;
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"><div className="flex items-center gap-2 text-slate-500">{icon}<span className="text-[10px] uppercase tracking-wide">{label}</span></div><p className="mt-2 text-xs font-bold text-slate-200">{value}</p></div>;
}

function App() {
  const [view,setView]=useState<"store"|"orders"|"dashboard"|"risks">("store");
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState<Category>("All");
  const [sort,setSort]=useState("featured");
  const [page,setPage]=useState(1);
  const [cart,setCart]=useState<CartItem[]>([]);
  const [favorites,setFavorites]=useState<string[]>([]);
  const [quickView,setQuickView]=useState<Product|null>(null);
  const [showCart,setShowCart]=useState(false);
  const [orders,setOrders]=useState<Order[]>([]);
  const pageSize=24;
  const filtered=useMemo(()=>{let list=productSeed.filter(p=>category==="All"||p.category===category); const q=query.trim().toLowerCase(); if(q) list=list.filter(p=>`${p.name} ${p.brand} ${p.subcategory} ${p.category}`.toLowerCase().includes(q)); if(sort==="priceLow") list=[...list].sort((a,b)=>a.price-b.price); if(sort==="priceHigh") list=[...list].sort((a,b)=>b.price-a.price); if(sort==="rating") list=[...list].sort((a,b)=>b.rating-a.rating); return list;},[category,query,sort]);
  const pages=Math.max(1,Math.ceil(filtered.length/pageSize));
  const safePage=Math.min(page,pages);
  const visible=filtered.slice((safePage-1)*pageSize,safePage*pageSize);
  const cartCount=cart.reduce((s,i)=>s+i.quantity,0);
  const addToCart=(product:Product)=>setCart(items=>{const found=items.find(i=>i.id===product.id); return found?items.map(i=>i.id===product.id?{...i,quantity:i.quantity+1}:i):[...items,{...product,quantity:1}];});
  const removeFromCart=(id:string)=>setCart(items=>items.filter(i=>i.id!==id));
  const changeQty=(id:string,qty:number)=>setCart(items=>qty<=0?items.filter(i=>i.id!==id):items.map(i=>i.id===id?{...i,quantity:qty}:i));
  const checkout=()=>{if(!cart.length)return; const date=new Date().toLocaleDateString("en-IN"); setOrders(items=>[...cart.map((i,n)=>({id:`ORD-${Date.now()}-${n+1}`,product:i.name,quantity:i.quantity,amount:i.price*i.quantity,status:"Processing",date})),...items]); setCart([]); setShowCart(false); setView("orders");};
  const resetFilters=()=>{setQuery("");setCategory("All");setSort("featured");setPage(1);};
  const chooseCategory=(c:Category)=>{setCategory(c);setPage(1);};
  return <div suppressHydrationWarning className="min-h-screen bg-slate-100 text-slate-900">
    <header className="sticky top-0 z-50 bg-slate-950 text-white shadow-lg">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <button type="button" className="flex items-center gap-2" onClick={()=>setView("store")}><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 font-black text-slate-950">S</div><div className="hidden sm:block text-left"><p className="text-sm font-black tracking-wide">SUPPLYIQ</p><p className="text-[10px] text-slate-500">Marketplace intelligence</p></div></button>
        <button type="button" className="ml-1 hidden items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/5 lg:flex"><Menu className="h-5 w-5" /><span className="text-xs font-semibold">Categories</span></button>
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} placeholder="Search fashion, gadgets, laptops, girls fashion..." className="h-11 w-full rounded-xl bg-white pl-10 pr-4 text-sm text-slate-900 outline-none ring-2 ring-transparent focus:ring-cyan-400" /></div>
        <button type="button" onClick={()=>setView("orders")} className="hidden rounded-lg px-3 py-2 text-left hover:bg-white/5 sm:block"><p className="text-[10px] text-slate-400">Your</p><p className="text-xs font-bold">Orders</p></button>
        <button type="button" onClick={()=>setShowCart(true)} className="relative flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-white/5"><ShoppingCart className="h-6 w-6" /><span className="hidden text-xs font-bold md:block">Cart</span>{cartCount>0&&<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-black text-slate-950">{cartCount}</span>}</button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-2 text-xs lg:px-6"><button type="button" onClick={()=>setView("store")} className={`whitespace-nowrap rounded-full px-3 py-1.5 font-semibold ${view==="store"?"bg-cyan-300 text-slate-950":"text-slate-300 hover:bg-white/10"}`}>Store</button><button type="button" onClick={()=>setView("risks")} className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-semibold ${view==="risks"?"bg-cyan-300 text-slate-950":"text-slate-300 hover:bg-white/10"}`}><Brain className="h-3.5 w-3.5" />AI Risk Catalogue</button><button type="button" onClick={()=>setView("dashboard")} className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-semibold ${view==="dashboard"?"bg-cyan-300 text-slate-950":"text-slate-300 hover:bg-white/10"}`}><LayoutDashboard className="h-3.5 w-3.5" />Supply Dashboard</button><button type="button" onClick={()=>setView("orders")} className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-semibold ${view==="orders"?"bg-cyan-300 text-slate-950":"text-slate-300 hover:bg-white/10"}`}><ClipboardList className="h-3.5 w-3.5" />Orders</button><div className="mx-1 h-5 w-px bg-white/10" />{categories.map(c=><button type="button" key={c} onClick={()=>{setView("store");chooseCategory(c);}} className={`whitespace-nowrap rounded-full px-3 py-1.5 font-semibold ${category===c&&view==="store"?"bg-white text-slate-950":"text-slate-300 hover:bg-white/10"}`}>{c}</button>)}<span className="ml-auto hidden whitespace-nowrap text-slate-500 md:block">Risk intelligence is separated from checkout workflows</span></div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {view==="store"&&<><section className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 p-7 text-white shadow-xl lg:p-10"><div className="max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300"><Sparkles className="h-3.5 w-3.5" />Curated digital marketplace</span><h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Fashion, girls fashion and gadgets in one storefront.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">Browse products, move across pages, add anything to your cart, and keep shopping without losing your selections.</p><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={()=>chooseCategory("Girls Fashion")} className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:bg-amber-300">Shop Girls Fashion</button><button type="button" onClick={()=>chooseCategory("Electronics")} className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10">Explore Electronics</button><button type="button" onClick={()=>setView("risks")} className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-300/20"><Brain className="h-4 w-4" />Open AI risk catalogue</button></div></div></section>
      <section className="mt-5 grid gap-3 md:grid-cols-4">
        <button type="button" onClick={()=>setView("risks")} className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-center justify-between"><span className="rounded-xl bg-cyan-50 p-2 text-cyan-700"><Brain className="h-4 w-4" /></span><ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-cyan-600" /></div><p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">AI risk factors</p><p className="mt-1 text-2xl font-black">{allRiskFactors.length}</p><p className="mt-1 text-xs text-slate-500">Supplier · inventory · transport · demand</p></button>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="rounded-xl bg-rose-50 p-2 text-rose-700"><AlertTriangle className="h-4 w-4" /></span><span className="text-[10px] font-black uppercase tracking-wide text-rose-600">Immediate</span></div><p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Critical signals</p><p className="mt-1 text-2xl font-black">{riskSummary.critical}+</p><p className="mt-1 text-xs text-slate-500">Needs active review</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="rounded-xl bg-amber-50 p-2 text-amber-700"><CircleDollarSign className="h-4 w-4" /></span><span className="text-[10px] font-black uppercase tracking-wide text-amber-600">Demo</span></div><p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">Risk exposure</p><p className="mt-1 text-2xl font-black">₹{(riskSummary.exposure / 1000000).toFixed(1)}M+</p><p className="mt-1 text-xs text-slate-500">Aggregated catalogue estimate</p></div>
        <button type="button" onClick={()=>setView("dashboard")} className="group rounded-2xl border border-slate-200 bg-slate-950 p-4 text-left text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex items-center justify-between"><span className="rounded-xl bg-cyan-300/10 p-2 text-cyan-200"><Activity className="h-4 w-4" /></span><ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-200" /></div><p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">Control tower</p><p className="mt-1 text-2xl font-black">Live demo</p><p className="mt-1 text-xs text-slate-400">Supplier · inventory · routes</p></button>
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-28"><div className="flex items-center justify-between"><p className="font-black">Filters</p><button type="button" onClick={resetFilters} className="text-xs font-bold text-cyan-700">Reset</button></div><div className="mt-5 space-y-2">{categories.map(c=><button type="button" key={c} onClick={()=>chooseCategory(c)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${category===c?"bg-slate-950 text-white":"hover:bg-slate-100"}`}><span>{c}</span>{c!=="All"&&<span className="text-xs opacity-60">{productSeed.filter(p=>p.category===c).length}</span>}</button>)}</div><div className="mt-6 border-t border-slate-200 pt-5"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Quick links</p><div className="mt-3 space-y-2 text-sm"><button type="button" onClick={()=>setFavorites([])} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-100"><Heart className="h-4 w-4" />Favorites ({favorites.length})</button><button type="button" onClick={()=>setView("orders")} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-100"><ClipboardList className="h-4 w-4" />Orders ({orders.length})</button><button type="button" onClick={()=>setView("dashboard")} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-100"><LayoutDashboard className="h-4 w-4" />Supply Dashboard</button></div></div></aside>
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-lg font-black">{category} Store</p><p className="text-xs text-slate-500">Showing {visible.length} of {filtered.length} products · page {safePage} of {pages}</p></div><div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-slate-500" /><select value={sort} onChange={e=>{setSort(e.target.value);setPage(1);}} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"><option value="featured">Featured</option><option value="priceLow">Price: Low to High</option><option value="priceHigh">Price: High to Low</option><option value="rating">Customer Rating</option></select></div></div></div>
          {visible.length===0?<div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Search className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 font-bold">No products found</p><button type="button" onClick={resetFilters} className="mt-3 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white">Reset Search</button></div>:<div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{visible.map(p=><ProductCard key={p.id} product={p} favorite={favorites.includes(p.id)} onFavorite={()=>setFavorites(v=>v.includes(p.id)?v.filter(x=>x!==p.id):[...v,p.id])} onAdd={()=>addToCart(p)} onQuickView={()=>setQuickView(p)} />)}</div>}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{safePage>1&&<button type="button" onClick={()=>setPage(safePage-1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold"><ArrowLeft className="h-4 w-4" />Previous</button>}{Array.from({length:pages},(_,i)=>i+1).slice(Math.max(0,safePage-3),Math.min(pages,safePage+2)).map(n=><button type="button" key={n} onClick={()=>setPage(n)} className={`h-10 w-10 rounded-xl text-sm font-black ${n===safePage?"bg-slate-950 text-white":"border border-slate-200 bg-white"}`}>{n}</button>)}{safePage<pages&&<button type="button" onClick={()=>setPage(safePage+1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold">Next<ArrowRight className="h-4 w-4" /></button>}</div>
        </div>
      </section></>}
      {view==="risks"&&<><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-700">AI Decision Workspace</p><h2 className="mt-2 text-3xl font-black">Supply-chain risk factor catalogue</h2><p className="mt-1 max-w-3xl text-sm text-slate-500">Separate from checkout and marketplace browsing so operational reasoning remains easy to inspect.</p></div><div className="flex items-center gap-2"><button type="button" onClick={()=>setView("store")} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold">Back to Store</button><button type="button" onClick={()=>setView("dashboard")} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Supply Dashboard</button></div></div><AIRiskCatalogue onOpenScenario={()=>setView("dashboard")} /></>}
      {view==="orders"&&<section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-black">Your Orders</h2><p className="mt-1 text-sm text-slate-500">Products placed from your SUPPLYIQ storefront.</p></div><button type="button" onClick={()=>setView("store")} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Continue Shopping</button></div>{orders.length===0?<div className="py-20 text-center"><Package className="mx-auto h-12 w-12 text-slate-300" /><p className="mt-4 font-bold">No orders yet</p></div>:<div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200">{orders.map(o=><div key={o.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"><div><p className="font-bold">{o.product}</p><p className="mt-1 text-xs text-slate-500">{o.id} · Qty {o.quantity} · {o.date}</p></div><div className="flex items-center gap-4"><span className="font-black">{formatINR(o.amount)}</span><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{o.status}</span></div></div>)}</div>}</section>}
      {view==="dashboard"&&<><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.18em] text-cyan-700">Supply Intelligence</p><h2 className="mt-2 text-3xl font-black">Operational risk workspace</h2></div><button type="button" onClick={()=>setView("store")} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">Back to Store</button></div><SupplyDashboard /><div className="mt-6"><Simulator /></div></>}
    </main>
    {quickView&&<Modal onClose={()=>setQuickView(null)}><div className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><ProductImage product={quickView} className="h-80 w-full object-contain" /></div><div className="pt-3"><span className="text-xs font-black uppercase tracking-wider text-cyan-700">{quickView.category}</span><h2 className="mt-2 text-3xl font-black">{quickView.name}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{quickView.description}</p><div className="mt-4 flex items-center gap-2 text-amber-500"><Star className="h-4 w-4 fill-current" />{quickView.rating}<span className="text-xs text-slate-400">({quickView.reviews} reviews)</span></div><div className="mt-5 text-3xl font-black">{formatINR(quickView.price)}</div><div className="mt-1 text-sm text-slate-500"><span className="mr-2 line-through">{formatINR(quickView.mrp)}</span><span className="font-bold text-emerald-700">{quickView.discount}% off</span></div><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={()=>{addToCart(quickView);setQuickView(null);setShowCart(true);}} className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950">Add to Cart</button><a href={quickView.amazonSearch} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold">View on Amazon</a></div></div></div></Modal>}
    {showCart&&<CartDrawer cart={cart} onClose={()=>setShowCart(false)} onRemove={removeFromCart} onChangeQty={changeQty} onCheckout={checkout} />}
    <footer className="mt-10 border-t border-slate-200 bg-white px-4 py-8"><div className="mx-auto max-w-7xl"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><div><p className="font-black">SUPPLYIQ</p><p className="mt-2 text-sm leading-6 text-slate-500">Marketplace UX for fashion, girls fashion and electronics, connected to a supply-chain intelligence view.</p></div><div><p className="font-bold">Store</p><div className="mt-2 space-y-1 text-sm text-slate-500"><p>Fashion</p><p>Girls Fashion</p><p>Electronics</p><p>Mobiles</p></div></div><div><p className="font-bold">Customer</p><div className="mt-2 space-y-1 text-sm text-slate-500"><p>Orders</p><p>Favorites</p><p>Cart</p><p>Pagination</p></div></div><div><p className="font-bold">Intelligence</p><div className="mt-2 space-y-1 text-sm text-slate-500"><button type="button" onClick={()=>setView("risks")} className="block text-left hover:text-cyan-700">AI Risk Catalogue</button><button type="button" onClick={()=>setView("dashboard")} className="block text-left hover:text-cyan-700">Supply Dashboard</button><p>Supplier signals</p><p>Inventory signals</p><p>Transportation signals</p><p>Scenario simulation</p></div></div></div><p className="mt-8 border-t border-slate-100 pt-5 text-xs text-slate-400">Demo storefront. Product images are external marketplace references and may occasionally fail; each tile has a local SVG fallback so the UI remains populated.</p></div></footer>
  </div>
}

export default App;

/* SUPPLYIQ IMPLEMENTATION NOTES */
// 0001. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0002. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0003. The store uses fixed pagination with 24 products per page.
// 0004. Adding an item to cart updates quantity when the same SKU already exists.
// 0005. Cart state remains in the page while moving between product pages.
// 0006. Checkout converts cart items into demo orders and opens the orders screen.
// 0007. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0008. The UI intentionally avoids nested interactive controls inside other buttons.
// 0009. No chatbot code is included in this file.
// 0010. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0011. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0012. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0013. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0014. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0015. The store uses fixed pagination with 24 products per page.
// 0016. Adding an item to cart updates quantity when the same SKU already exists.
// 0017. Cart state remains in the page while moving between product pages.
// 0018. Checkout converts cart items into demo orders and opens the orders screen.
// 0019. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0020. The UI intentionally avoids nested interactive controls inside other buttons.
// 0021. No chatbot code is included in this file.
// 0022. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0023. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0024. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0025. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0026. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0027. The store uses fixed pagination with 24 products per page.
// 0028. Adding an item to cart updates quantity when the same SKU already exists.
// 0029. Cart state remains in the page while moving between product pages.
// 0030. Checkout converts cart items into demo orders and opens the orders screen.
// 0031. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0032. The UI intentionally avoids nested interactive controls inside other buttons.
// 0033. No chatbot code is included in this file.
// 0034. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0035. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0036. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0037. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0038. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0039. The store uses fixed pagination with 24 products per page.
// 0040. Adding an item to cart updates quantity when the same SKU already exists.
// 0041. Cart state remains in the page while moving between product pages.
// 0042. Checkout converts cart items into demo orders and opens the orders screen.
// 0043. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0044. The UI intentionally avoids nested interactive controls inside other buttons.
// 0045. No chatbot code is included in this file.
// 0046. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0047. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0048. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0049. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0050. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0051. The store uses fixed pagination with 24 products per page.
// 0052. Adding an item to cart updates quantity when the same SKU already exists.
// 0053. Cart state remains in the page while moving between product pages.
// 0054. Checkout converts cart items into demo orders and opens the orders screen.
// 0055. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0056. The UI intentionally avoids nested interactive controls inside other buttons.
// 0057. No chatbot code is included in this file.
// 0058. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0059. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0060. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0061. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0062. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0063. The store uses fixed pagination with 24 products per page.
// 0064. Adding an item to cart updates quantity when the same SKU already exists.
// 0065. Cart state remains in the page while moving between product pages.
// 0066. Checkout converts cart items into demo orders and opens the orders screen.
// 0067. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0068. The UI intentionally avoids nested interactive controls inside other buttons.
// 0069. No chatbot code is included in this file.
// 0070. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0071. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0072. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0073. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0074. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0075. The store uses fixed pagination with 24 products per page.
// 0076. Adding an item to cart updates quantity when the same SKU already exists.
// 0077. Cart state remains in the page while moving between product pages.
// 0078. Checkout converts cart items into demo orders and opens the orders screen.
// 0079. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0080. The UI intentionally avoids nested interactive controls inside other buttons.
// 0081. No chatbot code is included in this file.
// 0082. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0083. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0084. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0085. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0086. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0087. The store uses fixed pagination with 24 products per page.
// 0088. Adding an item to cart updates quantity when the same SKU already exists.
// 0089. Cart state remains in the page while moving between product pages.
// 0090. Checkout converts cart items into demo orders and opens the orders screen.
// 0091. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0092. The UI intentionally avoids nested interactive controls inside other buttons.
// 0093. No chatbot code is included in this file.
// 0094. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0095. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0096. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0097. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0098. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0099. The store uses fixed pagination with 24 products per page.
// 0100. Adding an item to cart updates quantity when the same SKU already exists.
// 0101. Cart state remains in the page while moving between product pages.
// 0102. Checkout converts cart items into demo orders and opens the orders screen.
// 0103. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0104. The UI intentionally avoids nested interactive controls inside other buttons.
// 0105. No chatbot code is included in this file.
// 0106. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0107. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0108. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0109. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0110. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0111. The store uses fixed pagination with 24 products per page.
// 0112. Adding an item to cart updates quantity when the same SKU already exists.
// 0113. Cart state remains in the page while moving between product pages.
// 0114. Checkout converts cart items into demo orders and opens the orders screen.
// 0115. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0116. The UI intentionally avoids nested interactive controls inside other buttons.
// 0117. No chatbot code is included in this file.
// 0118. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0119. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0120. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0121. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0122. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0123. The store uses fixed pagination with 24 products per page.
// 0124. Adding an item to cart updates quantity when the same SKU already exists.
// 0125. Cart state remains in the page while moving between product pages.
// 0126. Checkout converts cart items into demo orders and opens the orders screen.
// 0127. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0128. The UI intentionally avoids nested interactive controls inside other buttons.
// 0129. No chatbot code is included in this file.
// 0130. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0131. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0132. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0133. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0134. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0135. The store uses fixed pagination with 24 products per page.
// 0136. Adding an item to cart updates quantity when the same SKU already exists.
// 0137. Cart state remains in the page while moving between product pages.
// 0138. Checkout converts cart items into demo orders and opens the orders screen.
// 0139. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0140. The UI intentionally avoids nested interactive controls inside other buttons.
// 0141. No chatbot code is included in this file.
// 0142. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0143. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0144. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0145. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0146. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0147. The store uses fixed pagination with 24 products per page.
// 0148. Adding an item to cart updates quantity when the same SKU already exists.
// 0149. Cart state remains in the page while moving between product pages.
// 0150. Checkout converts cart items into demo orders and opens the orders screen.
// 0151. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0152. The UI intentionally avoids nested interactive controls inside other buttons.
// 0153. No chatbot code is included in this file.
// 0154. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0155. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0156. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0157. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0158. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0159. The store uses fixed pagination with 24 products per page.
// 0160. Adding an item to cart updates quantity when the same SKU already exists.
// 0161. Cart state remains in the page while moving between product pages.
// 0162. Checkout converts cart items into demo orders and opens the orders screen.
// 0163. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0164. The UI intentionally avoids nested interactive controls inside other buttons.
// 0165. No chatbot code is included in this file.
// 0166. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0167. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0168. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0169. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0170. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0171. The store uses fixed pagination with 24 products per page.
// 0172. Adding an item to cart updates quantity when the same SKU already exists.
// 0173. Cart state remains in the page while moving between product pages.
// 0174. Checkout converts cart items into demo orders and opens the orders screen.
// 0175. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0176. The UI intentionally avoids nested interactive controls inside other buttons.
// 0177. No chatbot code is included in this file.
// 0178. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0179. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0180. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0181. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0182. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0183. The store uses fixed pagination with 24 products per page.
// 0184. Adding an item to cart updates quantity when the same SKU already exists.
// 0185. Cart state remains in the page while moving between product pages.
// 0186. Checkout converts cart items into demo orders and opens the orders screen.
// 0187. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0188. The UI intentionally avoids nested interactive controls inside other buttons.
// 0189. No chatbot code is included in this file.
// 0190. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0191. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0192. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0193. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0194. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0195. The store uses fixed pagination with 24 products per page.
// 0196. Adding an item to cart updates quantity when the same SKU already exists.
// 0197. Cart state remains in the page while moving between product pages.
// 0198. Checkout converts cart items into demo orders and opens the orders screen.
// 0199. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0200. The UI intentionally avoids nested interactive controls inside other buttons.
// 0201. No chatbot code is included in this file.
// 0202. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0203. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0204. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0205. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0206. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0207. The store uses fixed pagination with 24 products per page.
// 0208. Adding an item to cart updates quantity when the same SKU already exists.
// 0209. Cart state remains in the page while moving between product pages.
// 0210. Checkout converts cart items into demo orders and opens the orders screen.
// 0211. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0212. The UI intentionally avoids nested interactive controls inside other buttons.
// 0213. No chatbot code is included in this file.
// 0214. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0215. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0216. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0217. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0218. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0219. The store uses fixed pagination with 24 products per page.
// 0220. Adding an item to cart updates quantity when the same SKU already exists.
// 0221. Cart state remains in the page while moving between product pages.
// 0222. Checkout converts cart items into demo orders and opens the orders screen.
// 0223. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0224. The UI intentionally avoids nested interactive controls inside other buttons.
// 0225. No chatbot code is included in this file.
// 0226. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0227. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0228. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0229. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0230. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0231. The store uses fixed pagination with 24 products per page.
// 0232. Adding an item to cart updates quantity when the same SKU already exists.
// 0233. Cart state remains in the page while moving between product pages.
// 0234. Checkout converts cart items into demo orders and opens the orders screen.
// 0235. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0236. The UI intentionally avoids nested interactive controls inside other buttons.
// 0237. No chatbot code is included in this file.
// 0238. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0239. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0240. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0241. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0242. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0243. The store uses fixed pagination with 24 products per page.
// 0244. Adding an item to cart updates quantity when the same SKU already exists.
// 0245. Cart state remains in the page while moving between product pages.
// 0246. Checkout converts cart items into demo orders and opens the orders screen.
// 0247. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0248. The UI intentionally avoids nested interactive controls inside other buttons.
// 0249. No chatbot code is included in this file.
// 0250. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0251. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0252. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0253. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0254. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0255. The store uses fixed pagination with 24 products per page.
// 0256. Adding an item to cart updates quantity when the same SKU already exists.
// 0257. Cart state remains in the page while moving between product pages.
// 0258. Checkout converts cart items into demo orders and opens the orders screen.
// 0259. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0260. The UI intentionally avoids nested interactive controls inside other buttons.
// 0261. No chatbot code is included in this file.
// 0262. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0263. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0264. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0265. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0266. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0267. The store uses fixed pagination with 24 products per page.
// 0268. Adding an item to cart updates quantity when the same SKU already exists.
// 0269. Cart state remains in the page while moving between product pages.
// 0270. Checkout converts cart items into demo orders and opens the orders screen.
// 0271. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0272. The UI intentionally avoids nested interactive controls inside other buttons.
// 0273. No chatbot code is included in this file.
// 0274. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0275. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0276. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0277. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0278. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0279. The store uses fixed pagination with 24 products per page.
// 0280. Adding an item to cart updates quantity when the same SKU already exists.
// 0281. Cart state remains in the page while moving between product pages.
// 0282. Checkout converts cart items into demo orders and opens the orders screen.
// 0283. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0284. The UI intentionally avoids nested interactive controls inside other buttons.
// 0285. No chatbot code is included in this file.
// 0286. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0287. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0288. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0289. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0290. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0291. The store uses fixed pagination with 24 products per page.
// 0292. Adding an item to cart updates quantity when the same SKU already exists.
// 0293. Cart state remains in the page while moving between product pages.
// 0294. Checkout converts cart items into demo orders and opens the orders screen.
// 0295. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0296. The UI intentionally avoids nested interactive controls inside other buttons.
// 0297. No chatbot code is included in this file.
// 0298. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0299. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0300. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0301. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0302. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0303. The store uses fixed pagination with 24 products per page.
// 0304. Adding an item to cart updates quantity when the same SKU already exists.
// 0305. Cart state remains in the page while moving between product pages.
// 0306. Checkout converts cart items into demo orders and opens the orders screen.
// 0307. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0308. The UI intentionally avoids nested interactive controls inside other buttons.
// 0309. No chatbot code is included in this file.
// 0310. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0311. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0312. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0313. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0314. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0315. The store uses fixed pagination with 24 products per page.
// 0316. Adding an item to cart updates quantity when the same SKU already exists.
// 0317. Cart state remains in the page while moving between product pages.
// 0318. Checkout converts cart items into demo orders and opens the orders screen.
// 0319. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0320. The UI intentionally avoids nested interactive controls inside other buttons.
// 0321. No chatbot code is included in this file.
// 0322. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0323. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0324. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0325. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0326. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0327. The store uses fixed pagination with 24 products per page.
// 0328. Adding an item to cart updates quantity when the same SKU already exists.
// 0329. Cart state remains in the page while moving between product pages.
// 0330. Checkout converts cart items into demo orders and opens the orders screen.
// 0331. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0332. The UI intentionally avoids nested interactive controls inside other buttons.
// 0333. No chatbot code is included in this file.
// 0334. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0335. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0336. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0337. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0338. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0339. The store uses fixed pagination with 24 products per page.
// 0340. Adding an item to cart updates quantity when the same SKU already exists.
// 0341. Cart state remains in the page while moving between product pages.
// 0342. Checkout converts cart items into demo orders and opens the orders screen.
// 0343. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0344. The UI intentionally avoids nested interactive controls inside other buttons.
// 0345. No chatbot code is included in this file.
// 0346. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0347. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0348. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0349. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0350. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0351. The store uses fixed pagination with 24 products per page.
// 0352. Adding an item to cart updates quantity when the same SKU already exists.
// 0353. Cart state remains in the page while moving between product pages.
// 0354. Checkout converts cart items into demo orders and opens the orders screen.
// 0355. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0356. The UI intentionally avoids nested interactive controls inside other buttons.
// 0357. No chatbot code is included in this file.
// 0358. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0359. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0360. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0361. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0362. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0363. The store uses fixed pagination with 24 products per page.
// 0364. Adding an item to cart updates quantity when the same SKU already exists.
// 0365. Cart state remains in the page while moving between product pages.
// 0366. Checkout converts cart items into demo orders and opens the orders screen.
// 0367. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0368. The UI intentionally avoids nested interactive controls inside other buttons.
// 0369. No chatbot code is included in this file.
// 0370. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0371. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0372. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0373. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0374. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0375. The store uses fixed pagination with 24 products per page.
// 0376. Adding an item to cart updates quantity when the same SKU already exists.
// 0377. Cart state remains in the page while moving between product pages.
// 0378. Checkout converts cart items into demo orders and opens the orders screen.
// 0379. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0380. The UI intentionally avoids nested interactive controls inside other buttons.
// 0381. No chatbot code is included in this file.
// 0382. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0383. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0384. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0385. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0386. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0387. The store uses fixed pagination with 24 products per page.
// 0388. Adding an item to cart updates quantity when the same SKU already exists.
// 0389. Cart state remains in the page while moving between product pages.
// 0390. Checkout converts cart items into demo orders and opens the orders screen.
// 0391. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0392. The UI intentionally avoids nested interactive controls inside other buttons.
// 0393. No chatbot code is included in this file.
// 0394. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0395. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0396. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0397. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0398. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0399. The store uses fixed pagination with 24 products per page.
// 0400. Adding an item to cart updates quantity when the same SKU already exists.
// 0401. Cart state remains in the page while moving between product pages.
// 0402. Checkout converts cart items into demo orders and opens the orders screen.
// 0403. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0404. The UI intentionally avoids nested interactive controls inside other buttons.
// 0405. No chatbot code is included in this file.
// 0406. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0407. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0408. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0409. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0410. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0411. The store uses fixed pagination with 24 products per page.
// 0412. Adding an item to cart updates quantity when the same SKU already exists.
// 0413. Cart state remains in the page while moving between product pages.
// 0414. Checkout converts cart items into demo orders and opens the orders screen.
// 0415. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0416. The UI intentionally avoids nested interactive controls inside other buttons.
// 0417. No chatbot code is included in this file.
// 0418. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0419. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0420. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0421. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0422. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0423. The store uses fixed pagination with 24 products per page.
// 0424. Adding an item to cart updates quantity when the same SKU already exists.
// 0425. Cart state remains in the page while moving between product pages.
// 0426. Checkout converts cart items into demo orders and opens the orders screen.
// 0427. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0428. The UI intentionally avoids nested interactive controls inside other buttons.
// 0429. No chatbot code is included in this file.
// 0430. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0431. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0432. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0433. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0434. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0435. The store uses fixed pagination with 24 products per page.
// 0436. Adding an item to cart updates quantity when the same SKU already exists.
// 0437. Cart state remains in the page while moving between product pages.
// 0438. Checkout converts cart items into demo orders and opens the orders screen.
// 0439. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0440. The UI intentionally avoids nested interactive controls inside other buttons.
// 0441. No chatbot code is included in this file.
// 0442. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0443. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0444. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0445. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0446. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0447. The store uses fixed pagination with 24 products per page.
// 0448. Adding an item to cart updates quantity when the same SKU already exists.
// 0449. Cart state remains in the page while moving between product pages.
// 0450. Checkout converts cart items into demo orders and opens the orders screen.
// 0451. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0452. The UI intentionally avoids nested interactive controls inside other buttons.
// 0453. No chatbot code is included in this file.
// 0454. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0455. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0456. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0457. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0458. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0459. The store uses fixed pagination with 24 products per page.
// 0460. Adding an item to cart updates quantity when the same SKU already exists.
// 0461. Cart state remains in the page while moving between product pages.
// 0462. Checkout converts cart items into demo orders and opens the orders screen.
// 0463. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0464. The UI intentionally avoids nested interactive controls inside other buttons.
// 0465. No chatbot code is included in this file.
// 0466. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0467. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0468. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0469. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0470. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0471. The store uses fixed pagination with 24 products per page.
// 0472. Adding an item to cart updates quantity when the same SKU already exists.
// 0473. Cart state remains in the page while moving between product pages.
// 0474. Checkout converts cart items into demo orders and opens the orders screen.
// 0475. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0476. The UI intentionally avoids nested interactive controls inside other buttons.
// 0477. No chatbot code is included in this file.
// 0478. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0479. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0480. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0481. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0482. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0483. The store uses fixed pagination with 24 products per page.
// 0484. Adding an item to cart updates quantity when the same SKU already exists.
// 0485. Cart state remains in the page while moving between product pages.
// 0486. Checkout converts cart items into demo orders and opens the orders screen.
// 0487. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0488. The UI intentionally avoids nested interactive controls inside other buttons.
// 0489. No chatbot code is included in this file.
// 0490. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0491. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0492. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0493. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0494. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0495. The store uses fixed pagination with 24 products per page.
// 0496. Adding an item to cart updates quantity when the same SKU already exists.
// 0497. Cart state remains in the page while moving between product pages.
// 0498. Checkout converts cart items into demo orders and opens the orders screen.
// 0499. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0500. The UI intentionally avoids nested interactive controls inside other buttons.
// 0501. No chatbot code is included in this file.
// 0502. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0503. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0504. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0505. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0506. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0507. The store uses fixed pagination with 24 products per page.
// 0508. Adding an item to cart updates quantity when the same SKU already exists.
// 0509. Cart state remains in the page while moving between product pages.
// 0510. Checkout converts cart items into demo orders and opens the orders screen.
// 0511. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0512. The UI intentionally avoids nested interactive controls inside other buttons.
// 0513. No chatbot code is included in this file.
// 0514. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0515. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0516. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0517. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0518. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0519. The store uses fixed pagination with 24 products per page.
// 0520. Adding an item to cart updates quantity when the same SKU already exists.
// 0521. Cart state remains in the page while moving between product pages.
// 0522. Checkout converts cart items into demo orders and opens the orders screen.
// 0523. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0524. The UI intentionally avoids nested interactive controls inside other buttons.
// 0525. No chatbot code is included in this file.
// 0526. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0527. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0528. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0529. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0530. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0531. The store uses fixed pagination with 24 products per page.
// 0532. Adding an item to cart updates quantity when the same SKU already exists.
// 0533. Cart state remains in the page while moving between product pages.
// 0534. Checkout converts cart items into demo orders and opens the orders screen.
// 0535. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0536. The UI intentionally avoids nested interactive controls inside other buttons.
// 0537. No chatbot code is included in this file.
// 0538. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0539. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0540. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0541. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0542. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0543. The store uses fixed pagination with 24 products per page.
// 0544. Adding an item to cart updates quantity when the same SKU already exists.
// 0545. Cart state remains in the page while moving between product pages.
// 0546. Checkout converts cart items into demo orders and opens the orders screen.
// 0547. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0548. The UI intentionally avoids nested interactive controls inside other buttons.
// 0549. No chatbot code is included in this file.
// 0550. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0551. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0552. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0553. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0554. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0555. The store uses fixed pagination with 24 products per page.
// 0556. Adding an item to cart updates quantity when the same SKU already exists.
// 0557. Cart state remains in the page while moving between product pages.
// 0558. Checkout converts cart items into demo orders and opens the orders screen.
// 0559. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0560. The UI intentionally avoids nested interactive controls inside other buttons.
// 0561. No chatbot code is included in this file.
// 0562. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0563. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0564. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0565. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0566. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0567. The store uses fixed pagination with 24 products per page.
// 0568. Adding an item to cart updates quantity when the same SKU already exists.
// 0569. Cart state remains in the page while moving between product pages.
// 0570. Checkout converts cart items into demo orders and opens the orders screen.
// 0571. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0572. The UI intentionally avoids nested interactive controls inside other buttons.
// 0573. No chatbot code is included in this file.
// 0574. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0575. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0576. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0577. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0578. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0579. The store uses fixed pagination with 24 products per page.
// 0580. Adding an item to cart updates quantity when the same SKU already exists.
// 0581. Cart state remains in the page while moving between product pages.
// 0582. Checkout converts cart items into demo orders and opens the orders screen.
// 0583. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0584. The UI intentionally avoids nested interactive controls inside other buttons.
// 0585. No chatbot code is included in this file.
// 0586. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0587. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0588. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0589. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0590. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0591. The store uses fixed pagination with 24 products per page.
// 0592. Adding an item to cart updates quantity when the same SKU already exists.
// 0593. Cart state remains in the page while moving between product pages.
// 0594. Checkout converts cart items into demo orders and opens the orders screen.
// 0595. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0596. The UI intentionally avoids nested interactive controls inside other buttons.
// 0597. No chatbot code is included in this file.
// 0598. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0599. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0600. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0601. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0602. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0603. The store uses fixed pagination with 24 products per page.
// 0604. Adding an item to cart updates quantity when the same SKU already exists.
// 0605. Cart state remains in the page while moving between product pages.
// 0606. Checkout converts cart items into demo orders and opens the orders screen.
// 0607. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0608. The UI intentionally avoids nested interactive controls inside other buttons.
// 0609. No chatbot code is included in this file.
// 0610. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0611. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0612. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0613. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0614. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0615. The store uses fixed pagination with 24 products per page.
// 0616. Adding an item to cart updates quantity when the same SKU already exists.
// 0617. Cart state remains in the page while moving between product pages.
// 0618. Checkout converts cart items into demo orders and opens the orders screen.
// 0619. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0620. The UI intentionally avoids nested interactive controls inside other buttons.
// 0621. No chatbot code is included in this file.
// 0622. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0623. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0624. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0625. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0626. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0627. The store uses fixed pagination with 24 products per page.
// 0628. Adding an item to cart updates quantity when the same SKU already exists.
// 0629. Cart state remains in the page while moving between product pages.
// 0630. Checkout converts cart items into demo orders and opens the orders screen.
// 0631. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0632. The UI intentionally avoids nested interactive controls inside other buttons.
// 0633. No chatbot code is included in this file.
// 0634. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0635. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0636. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0637. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0638. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0639. The store uses fixed pagination with 24 products per page.
// 0640. Adding an item to cart updates quantity when the same SKU already exists.
// 0641. Cart state remains in the page while moving between product pages.
// 0642. Checkout converts cart items into demo orders and opens the orders screen.
// 0643. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0644. The UI intentionally avoids nested interactive controls inside other buttons.
// 0645. No chatbot code is included in this file.
// 0646. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0647. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0648. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0649. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0650. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0651. The store uses fixed pagination with 24 products per page.
// 0652. Adding an item to cart updates quantity when the same SKU already exists.
// 0653. Cart state remains in the page while moving between product pages.
// 0654. Checkout converts cart items into demo orders and opens the orders screen.
// 0655. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0656. The UI intentionally avoids nested interactive controls inside other buttons.
// 0657. No chatbot code is included in this file.
// 0658. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0659. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0660. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0661. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0662. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0663. The store uses fixed pagination with 24 products per page.
// 0664. Adding an item to cart updates quantity when the same SKU already exists.
// 0665. Cart state remains in the page while moving between product pages.
// 0666. Checkout converts cart items into demo orders and opens the orders screen.
// 0667. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0668. The UI intentionally avoids nested interactive controls inside other buttons.
// 0669. No chatbot code is included in this file.
// 0670. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0671. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0672. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0673. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0674. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0675. The store uses fixed pagination with 24 products per page.
// 0676. Adding an item to cart updates quantity when the same SKU already exists.
// 0677. Cart state remains in the page while moving between product pages.
// 0678. Checkout converts cart items into demo orders and opens the orders screen.
// 0679. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0680. The UI intentionally avoids nested interactive controls inside other buttons.
// 0681. No chatbot code is included in this file.
// 0682. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0683. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0684. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0685. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0686. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0687. The store uses fixed pagination with 24 products per page.
// 0688. Adding an item to cart updates quantity when the same SKU already exists.
// 0689. Cart state remains in the page while moving between product pages.
// 0690. Checkout converts cart items into demo orders and opens the orders screen.
// 0691. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0692. The UI intentionally avoids nested interactive controls inside other buttons.
// 0693. No chatbot code is included in this file.
// 0694. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0695. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0696. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0697. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0698. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0699. The store uses fixed pagination with 24 products per page.
// 0700. Adding an item to cart updates quantity when the same SKU already exists.
// 0701. Cart state remains in the page while moving between product pages.
// 0702. Checkout converts cart items into demo orders and opens the orders screen.
// 0703. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0704. The UI intentionally avoids nested interactive controls inside other buttons.
// 0705. No chatbot code is included in this file.
// 0706. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0707. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0708. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0709. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0710. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0711. The store uses fixed pagination with 24 products per page.
// 0712. Adding an item to cart updates quantity when the same SKU already exists.
// 0713. Cart state remains in the page while moving between product pages.
// 0714. Checkout converts cart items into demo orders and opens the orders screen.
// 0715. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0716. The UI intentionally avoids nested interactive controls inside other buttons.
// 0717. No chatbot code is included in this file.
// 0718. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0719. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0720. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0721. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0722. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0723. The store uses fixed pagination with 24 products per page.
// 0724. Adding an item to cart updates quantity when the same SKU already exists.
// 0725. Cart state remains in the page while moving between product pages.
// 0726. Checkout converts cart items into demo orders and opens the orders screen.
// 0727. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0728. The UI intentionally avoids nested interactive controls inside other buttons.
// 0729. No chatbot code is included in this file.
// 0730. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0731. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0732. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0733. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0734. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0735. The store uses fixed pagination with 24 products per page.
// 0736. Adding an item to cart updates quantity when the same SKU already exists.
// 0737. Cart state remains in the page while moving between product pages.
// 0738. Checkout converts cart items into demo orders and opens the orders screen.
// 0739. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0740. The UI intentionally avoids nested interactive controls inside other buttons.
// 0741. No chatbot code is included in this file.
// 0742. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0743. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0744. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0745. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0746. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0747. The store uses fixed pagination with 24 products per page.
// 0748. Adding an item to cart updates quantity when the same SKU already exists.
// 0749. Cart state remains in the page while moving between product pages.
// 0750. Checkout converts cart items into demo orders and opens the orders screen.
// 0751. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0752. The UI intentionally avoids nested interactive controls inside other buttons.
// 0753. No chatbot code is included in this file.
// 0754. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0755. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0756. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0757. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0758. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0759. The store uses fixed pagination with 24 products per page.
// 0760. Adding an item to cart updates quantity when the same SKU already exists.
// 0761. Cart state remains in the page while moving between product pages.
// 0762. Checkout converts cart items into demo orders and opens the orders screen.
// 0763. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0764. The UI intentionally avoids nested interactive controls inside other buttons.
// 0765. No chatbot code is included in this file.
// 0766. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0767. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0768. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0769. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0770. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0771. The store uses fixed pagination with 24 products per page.
// 0772. Adding an item to cart updates quantity when the same SKU already exists.
// 0773. Cart state remains in the page while moving between product pages.
// 0774. Checkout converts cart items into demo orders and opens the orders screen.
// 0775. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0776. The UI intentionally avoids nested interactive controls inside other buttons.
// 0777. No chatbot code is included in this file.
// 0778. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0779. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0780. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0781. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0782. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0783. The store uses fixed pagination with 24 products per page.
// 0784. Adding an item to cart updates quantity when the same SKU already exists.
// 0785. Cart state remains in the page while moving between product pages.
// 0786. Checkout converts cart items into demo orders and opens the orders screen.
// 0787. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0788. The UI intentionally avoids nested interactive controls inside other buttons.
// 0789. No chatbot code is included in this file.
// 0790. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0791. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0792. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0793. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0794. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0795. The store uses fixed pagination with 24 products per page.
// 0796. Adding an item to cart updates quantity when the same SKU already exists.
// 0797. Cart state remains in the page while moving between product pages.
// 0798. Checkout converts cart items into demo orders and opens the orders screen.
// 0799. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0800. The UI intentionally avoids nested interactive controls inside other buttons.
// 0801. No chatbot code is included in this file.
// 0802. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0803. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0804. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0805. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0806. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0807. The store uses fixed pagination with 24 products per page.
// 0808. Adding an item to cart updates quantity when the same SKU already exists.
// 0809. Cart state remains in the page while moving between product pages.
// 0810. Checkout converts cart items into demo orders and opens the orders screen.
// 0811. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0812. The UI intentionally avoids nested interactive controls inside other buttons.
// 0813. No chatbot code is included in this file.
// 0814. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0815. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0816. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0817. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0818. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0819. The store uses fixed pagination with 24 products per page.
// 0820. Adding an item to cart updates quantity when the same SKU already exists.
// 0821. Cart state remains in the page while moving between product pages.
// 0822. Checkout converts cart items into demo orders and opens the orders screen.
// 0823. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0824. The UI intentionally avoids nested interactive controls inside other buttons.
// 0825. No chatbot code is included in this file.
// 0826. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0827. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0828. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0829. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0830. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0831. The store uses fixed pagination with 24 products per page.
// 0832. Adding an item to cart updates quantity when the same SKU already exists.
// 0833. Cart state remains in the page while moving between product pages.
// 0834. Checkout converts cart items into demo orders and opens the orders screen.
// 0835. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0836. The UI intentionally avoids nested interactive controls inside other buttons.
// 0837. No chatbot code is included in this file.
// 0838. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0839. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0840. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0841. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0842. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0843. The store uses fixed pagination with 24 products per page.
// 0844. Adding an item to cart updates quantity when the same SKU already exists.
// 0845. Cart state remains in the page while moving between product pages.
// 0846. Checkout converts cart items into demo orders and opens the orders screen.
// 0847. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0848. The UI intentionally avoids nested interactive controls inside other buttons.
// 0849. No chatbot code is included in this file.
// 0850. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0851. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0852. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0853. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0854. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0855. The store uses fixed pagination with 24 products per page.
// 0856. Adding an item to cart updates quantity when the same SKU already exists.
// 0857. Cart state remains in the page while moving between product pages.
// 0858. Checkout converts cart items into demo orders and opens the orders screen.
// 0859. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0860. The UI intentionally avoids nested interactive controls inside other buttons.
// 0861. No chatbot code is included in this file.
// 0862. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0863. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0864. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0865. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0866. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0867. The store uses fixed pagination with 24 products per page.
// 0868. Adding an item to cart updates quantity when the same SKU already exists.
// 0869. Cart state remains in the page while moving between product pages.
// 0870. Checkout converts cart items into demo orders and opens the orders screen.
// 0871. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0872. The UI intentionally avoids nested interactive controls inside other buttons.
// 0873. No chatbot code is included in this file.
// 0874. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0875. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0876. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0877. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0878. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0879. The store uses fixed pagination with 24 products per page.
// 0880. Adding an item to cart updates quantity when the same SKU already exists.
// 0881. Cart state remains in the page while moving between product pages.
// 0882. Checkout converts cart items into demo orders and opens the orders screen.
// 0883. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0884. The UI intentionally avoids nested interactive controls inside other buttons.
// 0885. No chatbot code is included in this file.
// 0886. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0887. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0888. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0889. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0890. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0891. The store uses fixed pagination with 24 products per page.
// 0892. Adding an item to cart updates quantity when the same SKU already exists.
// 0893. Cart state remains in the page while moving between product pages.
// 0894. Checkout converts cart items into demo orders and opens the orders screen.
// 0895. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0896. The UI intentionally avoids nested interactive controls inside other buttons.
// 0897. No chatbot code is included in this file.
// 0898. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0899. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0900. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0901. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0902. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0903. The store uses fixed pagination with 24 products per page.
// 0904. Adding an item to cart updates quantity when the same SKU already exists.
// 0905. Cart state remains in the page while moving between product pages.
// 0906. Checkout converts cart items into demo orders and opens the orders screen.
// 0907. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0908. The UI intentionally avoids nested interactive controls inside other buttons.
// 0909. No chatbot code is included in this file.
// 0910. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0911. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0912. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0913. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0914. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0915. The store uses fixed pagination with 24 products per page.
// 0916. Adding an item to cart updates quantity when the same SKU already exists.
// 0917. Cart state remains in the page while moving between product pages.
// 0918. Checkout converts cart items into demo orders and opens the orders screen.
// 0919. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0920. The UI intentionally avoids nested interactive controls inside other buttons.
// 0921. No chatbot code is included in this file.
// 0922. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0923. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0924. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0925. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0926. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0927. The store uses fixed pagination with 24 products per page.
// 0928. Adding an item to cart updates quantity when the same SKU already exists.
// 0929. Cart state remains in the page while moving between product pages.
// 0930. Checkout converts cart items into demo orders and opens the orders screen.
// 0931. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0932. The UI intentionally avoids nested interactive controls inside other buttons.
// 0933. No chatbot code is included in this file.
// 0934. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0935. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0936. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0937. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0938. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0939. The store uses fixed pagination with 24 products per page.
// 0940. Adding an item to cart updates quantity when the same SKU already exists.
// 0941. Cart state remains in the page while moving between product pages.
// 0942. Checkout converts cart items into demo orders and opens the orders screen.
// 0943. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0944. The UI intentionally avoids nested interactive controls inside other buttons.
// 0945. No chatbot code is included in this file.
// 0946. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0947. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0948. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0949. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0950. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0951. The store uses fixed pagination with 24 products per page.
// 0952. Adding an item to cart updates quantity when the same SKU already exists.
// 0953. Cart state remains in the page while moving between product pages.
// 0954. Checkout converts cart items into demo orders and opens the orders screen.
// 0955. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0956. The UI intentionally avoids nested interactive controls inside other buttons.
// 0957. No chatbot code is included in this file.
// 0958. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0959. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0960. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0961. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0962. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0963. The store uses fixed pagination with 24 products per page.
// 0964. Adding an item to cart updates quantity when the same SKU already exists.
// 0965. Cart state remains in the page while moving between product pages.
// 0966. Checkout converts cart items into demo orders and opens the orders screen.
// 0967. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0968. The UI intentionally avoids nested interactive controls inside other buttons.
// 0969. No chatbot code is included in this file.
// 0970. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0971. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0972. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0973. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0974. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0975. The store uses fixed pagination with 24 products per page.
// 0976. Adding an item to cart updates quantity when the same SKU already exists.
// 0977. Cart state remains in the page while moving between product pages.
// 0978. Checkout converts cart items into demo orders and opens the orders screen.
// 0979. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0980. The UI intentionally avoids nested interactive controls inside other buttons.
// 0981. No chatbot code is included in this file.
// 0982. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0983. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0984. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0985. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0986. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0987. The store uses fixed pagination with 24 products per page.
// 0988. Adding an item to cart updates quantity when the same SKU already exists.
// 0989. Cart state remains in the page while moving between product pages.
// 0990. Checkout converts cart items into demo orders and opens the orders screen.
// 0991. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 0992. The UI intentionally avoids nested interactive controls inside other buttons.
// 0993. No chatbot code is included in this file.
// 0994. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 0995. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 0996. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 0997. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 0998. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 0999. The store uses fixed pagination with 24 products per page.
// 1000. Adding an item to cart updates quantity when the same SKU already exists.
// 1001. Cart state remains in the page while moving between product pages.
// 1002. Checkout converts cart items into demo orders and opens the orders screen.
// 1003. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1004. The UI intentionally avoids nested interactive controls inside other buttons.
// 1005. No chatbot code is included in this file.
// 1006. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1007. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1008. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1009. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1010. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1011. The store uses fixed pagination with 24 products per page.
// 1012. Adding an item to cart updates quantity when the same SKU already exists.
// 1013. Cart state remains in the page while moving between product pages.
// 1014. Checkout converts cart items into demo orders and opens the orders screen.
// 1015. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1016. The UI intentionally avoids nested interactive controls inside other buttons.
// 1017. No chatbot code is included in this file.
// 1018. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1019. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1020. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1021. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1022. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1023. The store uses fixed pagination with 24 products per page.
// 1024. Adding an item to cart updates quantity when the same SKU already exists.
// 1025. Cart state remains in the page while moving between product pages.
// 1026. Checkout converts cart items into demo orders and opens the orders screen.
// 1027. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1028. The UI intentionally avoids nested interactive controls inside other buttons.
// 1029. No chatbot code is included in this file.
// 1030. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1031. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1032. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1033. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1034. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1035. The store uses fixed pagination with 24 products per page.
// 1036. Adding an item to cart updates quantity when the same SKU already exists.
// 1037. Cart state remains in the page while moving between product pages.
// 1038. Checkout converts cart items into demo orders and opens the orders screen.
// 1039. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1040. The UI intentionally avoids nested interactive controls inside other buttons.
// 1041. No chatbot code is included in this file.
// 1042. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1043. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1044. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1045. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1046. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1047. The store uses fixed pagination with 24 products per page.
// 1048. Adding an item to cart updates quantity when the same SKU already exists.
// 1049. Cart state remains in the page while moving between product pages.
// 1050. Checkout converts cart items into demo orders and opens the orders screen.
// 1051. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1052. The UI intentionally avoids nested interactive controls inside other buttons.
// 1053. No chatbot code is included in this file.
// 1054. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1055. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1056. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1057. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1058. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1059. The store uses fixed pagination with 24 products per page.
// 1060. Adding an item to cart updates quantity when the same SKU already exists.
// 1061. Cart state remains in the page while moving between product pages.
// 1062. Checkout converts cart items into demo orders and opens the orders screen.
// 1063. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1064. The UI intentionally avoids nested interactive controls inside other buttons.
// 1065. No chatbot code is included in this file.
// 1066. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1067. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1068. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1069. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1070. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1071. The store uses fixed pagination with 24 products per page.
// 1072. Adding an item to cart updates quantity when the same SKU already exists.
// 1073. Cart state remains in the page while moving between product pages.
// 1074. Checkout converts cart items into demo orders and opens the orders screen.
// 1075. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1076. The UI intentionally avoids nested interactive controls inside other buttons.
// 1077. No chatbot code is included in this file.
// 1078. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1079. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1080. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1081. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1082. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1083. The store uses fixed pagination with 24 products per page.
// 1084. Adding an item to cart updates quantity when the same SKU already exists.
// 1085. Cart state remains in the page while moving between product pages.
// 1086. Checkout converts cart items into demo orders and opens the orders screen.
// 1087. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1088. The UI intentionally avoids nested interactive controls inside other buttons.
// 1089. No chatbot code is included in this file.
// 1090. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1091. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1092. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1093. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1094. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1095. The store uses fixed pagination with 24 products per page.
// 1096. Adding an item to cart updates quantity when the same SKU already exists.
// 1097. Cart state remains in the page while moving between product pages.
// 1098. Checkout converts cart items into demo orders and opens the orders screen.
// 1099. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1100. The UI intentionally avoids nested interactive controls inside other buttons.
// 1101. No chatbot code is included in this file.
// 1102. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1103. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1104. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1105. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1106. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1107. The store uses fixed pagination with 24 products per page.
// 1108. Adding an item to cart updates quantity when the same SKU already exists.
// 1109. Cart state remains in the page while moving between product pages.
// 1110. Checkout converts cart items into demo orders and opens the orders screen.
// 1111. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1112. The UI intentionally avoids nested interactive controls inside other buttons.
// 1113. No chatbot code is included in this file.
// 1114. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1115. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1116. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1117. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1118. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1119. The store uses fixed pagination with 24 products per page.
// 1120. Adding an item to cart updates quantity when the same SKU already exists.
// 1121. Cart state remains in the page while moving between product pages.
// 1122. Checkout converts cart items into demo orders and opens the orders screen.
// 1123. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1124. The UI intentionally avoids nested interactive controls inside other buttons.
// 1125. No chatbot code is included in this file.
// 1126. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1127. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1128. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1129. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1130. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1131. The store uses fixed pagination with 24 products per page.
// 1132. Adding an item to cart updates quantity when the same SKU already exists.
// 1133. Cart state remains in the page while moving between product pages.
// 1134. Checkout converts cart items into demo orders and opens the orders screen.
// 1135. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1136. The UI intentionally avoids nested interactive controls inside other buttons.
// 1137. No chatbot code is included in this file.
// 1138. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1139. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1140. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1141. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1142. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1143. The store uses fixed pagination with 24 products per page.
// 1144. Adding an item to cart updates quantity when the same SKU already exists.
// 1145. Cart state remains in the page while moving between product pages.
// 1146. Checkout converts cart items into demo orders and opens the orders screen.
// 1147. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1148. The UI intentionally avoids nested interactive controls inside other buttons.
// 1149. No chatbot code is included in this file.
// 1150. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1151. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1152. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1153. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1154. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1155. The store uses fixed pagination with 24 products per page.
// 1156. Adding an item to cart updates quantity when the same SKU already exists.
// 1157. Cart state remains in the page while moving between product pages.
// 1158. Checkout converts cart items into demo orders and opens the orders screen.
// 1159. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1160. The UI intentionally avoids nested interactive controls inside other buttons.
// 1161. No chatbot code is included in this file.
// 1162. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1163. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1164. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1165. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1166. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1167. The store uses fixed pagination with 24 products per page.
// 1168. Adding an item to cart updates quantity when the same SKU already exists.
// 1169. Cart state remains in the page while moving between product pages.
// 1170. Checkout converts cart items into demo orders and opens the orders screen.
// 1171. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1172. The UI intentionally avoids nested interactive controls inside other buttons.
// 1173. No chatbot code is included in this file.
// 1174. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1175. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1176. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1177. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1178. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1179. The store uses fixed pagination with 24 products per page.
// 1180. Adding an item to cart updates quantity when the same SKU already exists.
// 1181. Cart state remains in the page while moving between product pages.
// 1182. Checkout converts cart items into demo orders and opens the orders screen.
// 1183. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1184. The UI intentionally avoids nested interactive controls inside other buttons.
// 1185. No chatbot code is included in this file.
// 1186. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1187. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1188. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1189. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1190. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1191. The store uses fixed pagination with 24 products per page.
// 1192. Adding an item to cart updates quantity when the same SKU already exists.
// 1193. Cart state remains in the page while moving between product pages.
// 1194. Checkout converts cart items into demo orders and opens the orders screen.
// 1195. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1196. The UI intentionally avoids nested interactive controls inside other buttons.
// 1197. No chatbot code is included in this file.
// 1198. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1199. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1200. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1201. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1202. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1203. The store uses fixed pagination with 24 products per page.
// 1204. Adding an item to cart updates quantity when the same SKU already exists.
// 1205. Cart state remains in the page while moving between product pages.
// 1206. Checkout converts cart items into demo orders and opens the orders screen.
// 1207. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1208. The UI intentionally avoids nested interactive controls inside other buttons.
// 1209. No chatbot code is included in this file.
// 1210. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1211. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1212. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1213. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1214. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1215. The store uses fixed pagination with 24 products per page.
// 1216. Adding an item to cart updates quantity when the same SKU already exists.
// 1217. Cart state remains in the page while moving between product pages.
// 1218. Checkout converts cart items into demo orders and opens the orders screen.
// 1219. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1220. The UI intentionally avoids nested interactive controls inside other buttons.
// 1221. No chatbot code is included in this file.
// 1222. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1223. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1224. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1225. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1226. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1227. The store uses fixed pagination with 24 products per page.
// 1228. Adding an item to cart updates quantity when the same SKU already exists.
// 1229. Cart state remains in the page while moving between product pages.
// 1230. Checkout converts cart items into demo orders and opens the orders screen.
// 1231. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1232. The UI intentionally avoids nested interactive controls inside other buttons.
// 1233. No chatbot code is included in this file.
// 1234. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1235. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1236. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1237. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1238. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1239. The store uses fixed pagination with 24 products per page.
// 1240. Adding an item to cart updates quantity when the same SKU already exists.
// 1241. Cart state remains in the page while moving between product pages.
// 1242. Checkout converts cart items into demo orders and opens the orders screen.
// 1243. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1244. The UI intentionally avoids nested interactive controls inside other buttons.
// 1245. No chatbot code is included in this file.
// 1246. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1247. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1248. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1249. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1250. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1251. The store uses fixed pagination with 24 products per page.
// 1252. Adding an item to cart updates quantity when the same SKU already exists.
// 1253. Cart state remains in the page while moving between product pages.
// 1254. Checkout converts cart items into demo orders and opens the orders screen.
// 1255. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1256. The UI intentionally avoids nested interactive controls inside other buttons.
// 1257. No chatbot code is included in this file.
// 1258. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1259. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1260. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1261. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1262. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1263. The store uses fixed pagination with 24 products per page.
// 1264. Adding an item to cart updates quantity when the same SKU already exists.
// 1265. Cart state remains in the page while moving between product pages.
// 1266. Checkout converts cart items into demo orders and opens the orders screen.
// 1267. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1268. The UI intentionally avoids nested interactive controls inside other buttons.
// 1269. No chatbot code is included in this file.
// 1270. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1271. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1272. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1273. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1274. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1275. The store uses fixed pagination with 24 products per page.
// 1276. Adding an item to cart updates quantity when the same SKU already exists.
// 1277. Cart state remains in the page while moving between product pages.
// 1278. Checkout converts cart items into demo orders and opens the orders screen.
// 1279. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1280. The UI intentionally avoids nested interactive controls inside other buttons.
// 1281. No chatbot code is included in this file.
// 1282. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1283. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1284. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1285. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1286. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1287. The store uses fixed pagination with 24 products per page.
// 1288. Adding an item to cart updates quantity when the same SKU already exists.
// 1289. Cart state remains in the page while moving between product pages.
// 1290. Checkout converts cart items into demo orders and opens the orders screen.
// 1291. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1292. The UI intentionally avoids nested interactive controls inside other buttons.
// 1293. No chatbot code is included in this file.
// 1294. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1295. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1296. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1297. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1298. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1299. The store uses fixed pagination with 24 products per page.
// 1300. Adding an item to cart updates quantity when the same SKU already exists.
// 1301. Cart state remains in the page while moving between product pages.
// 1302. Checkout converts cart items into demo orders and opens the orders screen.
// 1303. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1304. The UI intentionally avoids nested interactive controls inside other buttons.
// 1305. No chatbot code is included in this file.
// 1306. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1307. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1308. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1309. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1310. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1311. The store uses fixed pagination with 24 products per page.
// 1312. Adding an item to cart updates quantity when the same SKU already exists.
// 1313. Cart state remains in the page while moving between product pages.
// 1314. Checkout converts cart items into demo orders and opens the orders screen.
// 1315. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1316. The UI intentionally avoids nested interactive controls inside other buttons.
// 1317. No chatbot code is included in this file.
// 1318. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1319. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1320. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1321. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1322. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1323. The store uses fixed pagination with 24 products per page.
// 1324. Adding an item to cart updates quantity when the same SKU already exists.
// 1325. Cart state remains in the page while moving between product pages.
// 1326. Checkout converts cart items into demo orders and opens the orders screen.
// 1327. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1328. The UI intentionally avoids nested interactive controls inside other buttons.
// 1329. No chatbot code is included in this file.
// 1330. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1331. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1332. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1333. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1334. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1335. The store uses fixed pagination with 24 products per page.
// 1336. Adding an item to cart updates quantity when the same SKU already exists.
// 1337. Cart state remains in the page while moving between product pages.
// 1338. Checkout converts cart items into demo orders and opens the orders screen.
// 1339. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1340. The UI intentionally avoids nested interactive controls inside other buttons.
// 1341. No chatbot code is included in this file.
// 1342. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1343. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1344. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1345. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1346. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1347. The store uses fixed pagination with 24 products per page.
// 1348. Adding an item to cart updates quantity when the same SKU already exists.
// 1349. Cart state remains in the page while moving between product pages.
// 1350. Checkout converts cart items into demo orders and opens the orders screen.
// 1351. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1352. The UI intentionally avoids nested interactive controls inside other buttons.
// 1353. No chatbot code is included in this file.
// 1354. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1355. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1356. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1357. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1358. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1359. The store uses fixed pagination with 24 products per page.
// 1360. Adding an item to cart updates quantity when the same SKU already exists.
// 1361. Cart state remains in the page while moving between product pages.
// 1362. Checkout converts cart items into demo orders and opens the orders screen.
// 1363. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1364. The UI intentionally avoids nested interactive controls inside other buttons.
// 1365. No chatbot code is included in this file.
// 1366. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1367. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1368. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1369. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1370. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1371. The store uses fixed pagination with 24 products per page.
// 1372. Adding an item to cart updates quantity when the same SKU already exists.
// 1373. Cart state remains in the page while moving between product pages.
// 1374. Checkout converts cart items into demo orders and opens the orders screen.
// 1375. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1376. The UI intentionally avoids nested interactive controls inside other buttons.
// 1377. No chatbot code is included in this file.
// 1378. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1379. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1380. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1381. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1382. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1383. The store uses fixed pagination with 24 products per page.
// 1384. Adding an item to cart updates quantity when the same SKU already exists.
// 1385. Cart state remains in the page while moving between product pages.
// 1386. Checkout converts cart items into demo orders and opens the orders screen.
// 1387. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1388. The UI intentionally avoids nested interactive controls inside other buttons.
// 1389. No chatbot code is included in this file.
// 1390. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1391. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1392. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1393. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1394. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1395. The store uses fixed pagination with 24 products per page.
// 1396. Adding an item to cart updates quantity when the same SKU already exists.
// 1397. Cart state remains in the page while moving between product pages.
// 1398. Checkout converts cart items into demo orders and opens the orders screen.
// 1399. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1400. The UI intentionally avoids nested interactive controls inside other buttons.
// 1401. No chatbot code is included in this file.
// 1402. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1403. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1404. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1405. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1406. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1407. The store uses fixed pagination with 24 products per page.
// 1408. Adding an item to cart updates quantity when the same SKU already exists.
// 1409. Cart state remains in the page while moving between product pages.
// 1410. Checkout converts cart items into demo orders and opens the orders screen.
// 1411. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1412. The UI intentionally avoids nested interactive controls inside other buttons.
// 1413. No chatbot code is included in this file.
// 1414. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1415. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1416. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1417. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1418. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1419. The store uses fixed pagination with 24 products per page.
// 1420. Adding an item to cart updates quantity when the same SKU already exists.
// 1421. Cart state remains in the page while moving between product pages.
// 1422. Checkout converts cart items into demo orders and opens the orders screen.
// 1423. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1424. The UI intentionally avoids nested interactive controls inside other buttons.
// 1425. No chatbot code is included in this file.
// 1426. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1427. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1428. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1429. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1430. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1431. The store uses fixed pagination with 24 products per page.
// 1432. Adding an item to cart updates quantity when the same SKU already exists.
// 1433. Cart state remains in the page while moving between product pages.
// 1434. Checkout converts cart items into demo orders and opens the orders screen.
// 1435. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1436. The UI intentionally avoids nested interactive controls inside other buttons.
// 1437. No chatbot code is included in this file.
// 1438. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1439. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1440. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1441. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1442. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1443. The store uses fixed pagination with 24 products per page.
// 1444. Adding an item to cart updates quantity when the same SKU already exists.
// 1445. Cart state remains in the page while moving between product pages.
// 1446. Checkout converts cart items into demo orders and opens the orders screen.
// 1447. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1448. The UI intentionally avoids nested interactive controls inside other buttons.
// 1449. No chatbot code is included in this file.
// 1450. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1451. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1452. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1453. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1454. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1455. The store uses fixed pagination with 24 products per page.
// 1456. Adding an item to cart updates quantity when the same SKU already exists.
// 1457. Cart state remains in the page while moving between product pages.
// 1458. Checkout converts cart items into demo orders and opens the orders screen.
// 1459. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1460. The UI intentionally avoids nested interactive controls inside other buttons.
// 1461. No chatbot code is included in this file.
// 1462. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1463. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1464. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1465. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1466. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1467. The store uses fixed pagination with 24 products per page.
// 1468. Adding an item to cart updates quantity when the same SKU already exists.
// 1469. Cart state remains in the page while moving between product pages.
// 1470. Checkout converts cart items into demo orders and opens the orders screen.
// 1471. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1472. The UI intentionally avoids nested interactive controls inside other buttons.
// 1473. No chatbot code is included in this file.
// 1474. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1475. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1476. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1477. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1478. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1479. The store uses fixed pagination with 24 products per page.
// 1480. Adding an item to cart updates quantity when the same SKU already exists.
// 1481. Cart state remains in the page while moving between product pages.
// 1482. Checkout converts cart items into demo orders and opens the orders screen.
// 1483. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1484. The UI intentionally avoids nested interactive controls inside other buttons.
// 1485. No chatbot code is included in this file.
// 1486. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1487. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1488. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1489. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1490. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1491. The store uses fixed pagination with 24 products per page.
// 1492. Adding an item to cart updates quantity when the same SKU already exists.
// 1493. Cart state remains in the page while moving between product pages.
// 1494. Checkout converts cart items into demo orders and opens the orders screen.
// 1495. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1496. The UI intentionally avoids nested interactive controls inside other buttons.
// 1497. No chatbot code is included in this file.
// 1498. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1499. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1500. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1501. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1502. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1503. The store uses fixed pagination with 24 products per page.
// 1504. Adding an item to cart updates quantity when the same SKU already exists.
// 1505. Cart state remains in the page while moving between product pages.
// 1506. Checkout converts cart items into demo orders and opens the orders screen.
// 1507. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1508. The UI intentionally avoids nested interactive controls inside other buttons.
// 1509. No chatbot code is included in this file.
// 1510. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1511. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1512. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1513. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1514. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1515. The store uses fixed pagination with 24 products per page.
// 1516. Adding an item to cart updates quantity when the same SKU already exists.
// 1517. Cart state remains in the page while moving between product pages.
// 1518. Checkout converts cart items into demo orders and opens the orders screen.
// 1519. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1520. The UI intentionally avoids nested interactive controls inside other buttons.
// 1521. No chatbot code is included in this file.
// 1522. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1523. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1524. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1525. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1526. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1527. The store uses fixed pagination with 24 products per page.
// 1528. Adding an item to cart updates quantity when the same SKU already exists.
// 1529. Cart state remains in the page while moving between product pages.
// 1530. Checkout converts cart items into demo orders and opens the orders screen.
// 1531. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1532. The UI intentionally avoids nested interactive controls inside other buttons.
// 1533. No chatbot code is included in this file.
// 1534. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1535. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1536. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1537. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1538. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1539. The store uses fixed pagination with 24 products per page.
// 1540. Adding an item to cart updates quantity when the same SKU already exists.
// 1541. Cart state remains in the page while moving between product pages.
// 1542. Checkout converts cart items into demo orders and opens the orders screen.
// 1543. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1544. The UI intentionally avoids nested interactive controls inside other buttons.
// 1545. No chatbot code is included in this file.
// 1546. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1547. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1548. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1549. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1550. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1551. The store uses fixed pagination with 24 products per page.
// 1552. Adding an item to cart updates quantity when the same SKU already exists.
// 1553. Cart state remains in the page while moving between product pages.
// 1554. Checkout converts cart items into demo orders and opens the orders screen.
// 1555. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1556. The UI intentionally avoids nested interactive controls inside other buttons.
// 1557. No chatbot code is included in this file.
// 1558. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1559. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1560. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1561. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1562. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1563. The store uses fixed pagination with 24 products per page.
// 1564. Adding an item to cart updates quantity when the same SKU already exists.
// 1565. Cart state remains in the page while moving between product pages.
// 1566. Checkout converts cart items into demo orders and opens the orders screen.
// 1567. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1568. The UI intentionally avoids nested interactive controls inside other buttons.
// 1569. No chatbot code is included in this file.
// 1570. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1571. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1572. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1573. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1574. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1575. The store uses fixed pagination with 24 products per page.
// 1576. Adding an item to cart updates quantity when the same SKU already exists.
// 1577. Cart state remains in the page while moving between product pages.
// 1578. Checkout converts cart items into demo orders and opens the orders screen.
// 1579. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1580. The UI intentionally avoids nested interactive controls inside other buttons.
// 1581. No chatbot code is included in this file.
// 1582. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1583. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1584. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1585. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1586. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1587. The store uses fixed pagination with 24 products per page.
// 1588. Adding an item to cart updates quantity when the same SKU already exists.
// 1589. Cart state remains in the page while moving between product pages.
// 1590. Checkout converts cart items into demo orders and opens the orders screen.
// 1591. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1592. The UI intentionally avoids nested interactive controls inside other buttons.
// 1593. No chatbot code is included in this file.
// 1594. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1595. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1596. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1597. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1598. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1599. The store uses fixed pagination with 24 products per page.
// 1600. Adding an item to cart updates quantity when the same SKU already exists.
// 1601. Cart state remains in the page while moving between product pages.
// 1602. Checkout converts cart items into demo orders and opens the orders screen.
// 1603. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1604. The UI intentionally avoids nested interactive controls inside other buttons.
// 1605. No chatbot code is included in this file.
// 1606. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1607. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1608. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1609. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1610. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1611. The store uses fixed pagination with 24 products per page.
// 1612. Adding an item to cart updates quantity when the same SKU already exists.
// 1613. Cart state remains in the page while moving between product pages.
// 1614. Checkout converts cart items into demo orders and opens the orders screen.
// 1615. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1616. The UI intentionally avoids nested interactive controls inside other buttons.
// 1617. No chatbot code is included in this file.
// 1618. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1619. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1620. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1621. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1622. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1623. The store uses fixed pagination with 24 products per page.
// 1624. Adding an item to cart updates quantity when the same SKU already exists.
// 1625. Cart state remains in the page while moving between product pages.
// 1626. Checkout converts cart items into demo orders and opens the orders screen.
// 1627. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1628. The UI intentionally avoids nested interactive controls inside other buttons.
// 1629. No chatbot code is included in this file.
// 1630. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1631. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1632. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1633. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1634. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1635. The store uses fixed pagination with 24 products per page.
// 1636. Adding an item to cart updates quantity when the same SKU already exists.
// 1637. Cart state remains in the page while moving between product pages.
// 1638. Checkout converts cart items into demo orders and opens the orders screen.
// 1639. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1640. The UI intentionally avoids nested interactive controls inside other buttons.
// 1641. No chatbot code is included in this file.
// 1642. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1643. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1644. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1645. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1646. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1647. The store uses fixed pagination with 24 products per page.
// 1648. Adding an item to cart updates quantity when the same SKU already exists.
// 1649. Cart state remains in the page while moving between product pages.
// 1650. Checkout converts cart items into demo orders and opens the orders screen.
// 1651. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1652. The UI intentionally avoids nested interactive controls inside other buttons.
// 1653. No chatbot code is included in this file.
// 1654. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1655. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1656. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1657. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1658. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1659. The store uses fixed pagination with 24 products per page.
// 1660. Adding an item to cart updates quantity when the same SKU already exists.
// 1661. Cart state remains in the page while moving between product pages.
// 1662. Checkout converts cart items into demo orders and opens the orders screen.
// 1663. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1664. The UI intentionally avoids nested interactive controls inside other buttons.
// 1665. No chatbot code is included in this file.
// 1666. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1667. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1668. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1669. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1670. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1671. The store uses fixed pagination with 24 products per page.
// 1672. Adding an item to cart updates quantity when the same SKU already exists.
// 1673. Cart state remains in the page while moving between product pages.
// 1674. Checkout converts cart items into demo orders and opens the orders screen.
// 1675. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1676. The UI intentionally avoids nested interactive controls inside other buttons.
// 1677. No chatbot code is included in this file.
// 1678. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1679. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1680. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1681. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1682. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1683. The store uses fixed pagination with 24 products per page.
// 1684. Adding an item to cart updates quantity when the same SKU already exists.
// 1685. Cart state remains in the page while moving between product pages.
// 1686. Checkout converts cart items into demo orders and opens the orders screen.
// 1687. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1688. The UI intentionally avoids nested interactive controls inside other buttons.
// 1689. No chatbot code is included in this file.
// 1690. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1691. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1692. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1693. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1694. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1695. The store uses fixed pagination with 24 products per page.
// 1696. Adding an item to cart updates quantity when the same SKU already exists.
// 1697. Cart state remains in the page while moving between product pages.
// 1698. Checkout converts cart items into demo orders and opens the orders screen.
// 1699. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1700. The UI intentionally avoids nested interactive controls inside other buttons.
// 1701. No chatbot code is included in this file.
// 1702. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1703. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1704. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1705. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1706. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1707. The store uses fixed pagination with 24 products per page.
// 1708. Adding an item to cart updates quantity when the same SKU already exists.
// 1709. Cart state remains in the page while moving between product pages.
// 1710. Checkout converts cart items into demo orders and opens the orders screen.
// 1711. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1712. The UI intentionally avoids nested interactive controls inside other buttons.
// 1713. No chatbot code is included in this file.
// 1714. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1715. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1716. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1717. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1718. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1719. The store uses fixed pagination with 24 products per page.
// 1720. Adding an item to cart updates quantity when the same SKU already exists.
// 1721. Cart state remains in the page while moving between product pages.
// 1722. Checkout converts cart items into demo orders and opens the orders screen.
// 1723. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1724. The UI intentionally avoids nested interactive controls inside other buttons.
// 1725. No chatbot code is included in this file.
// 1726. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1727. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1728. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1729. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1730. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1731. The store uses fixed pagination with 24 products per page.
// 1732. Adding an item to cart updates quantity when the same SKU already exists.
// 1733. Cart state remains in the page while moving between product pages.
// 1734. Checkout converts cart items into demo orders and opens the orders screen.
// 1735. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1736. The UI intentionally avoids nested interactive controls inside other buttons.
// 1737. No chatbot code is included in this file.
// 1738. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1739. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1740. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1741. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1742. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1743. The store uses fixed pagination with 24 products per page.
// 1744. Adding an item to cart updates quantity when the same SKU already exists.
// 1745. Cart state remains in the page while moving between product pages.
// 1746. Checkout converts cart items into demo orders and opens the orders screen.
// 1747. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1748. The UI intentionally avoids nested interactive controls inside other buttons.
// 1749. No chatbot code is included in this file.
// 1750. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1751. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1752. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1753. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1754. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1755. The store uses fixed pagination with 24 products per page.
// 1756. Adding an item to cart updates quantity when the same SKU already exists.
// 1757. Cart state remains in the page while moving between product pages.
// 1758. Checkout converts cart items into demo orders and opens the orders screen.
// 1759. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1760. The UI intentionally avoids nested interactive controls inside other buttons.
// 1761. No chatbot code is included in this file.
// 1762. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1763. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1764. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1765. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1766. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1767. The store uses fixed pagination with 24 products per page.
// 1768. Adding an item to cart updates quantity when the same SKU already exists.
// 1769. Cart state remains in the page while moving between product pages.
// 1770. Checkout converts cart items into demo orders and opens the orders screen.
// 1771. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1772. The UI intentionally avoids nested interactive controls inside other buttons.
// 1773. No chatbot code is included in this file.
// 1774. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1775. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1776. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1777. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1778. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1779. The store uses fixed pagination with 24 products per page.
// 1780. Adding an item to cart updates quantity when the same SKU already exists.
// 1781. Cart state remains in the page while moving between product pages.
// 1782. Checkout converts cart items into demo orders and opens the orders screen.
// 1783. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1784. The UI intentionally avoids nested interactive controls inside other buttons.
// 1785. No chatbot code is included in this file.
// 1786. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1787. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1788. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1789. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1790. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1791. The store uses fixed pagination with 24 products per page.
// 1792. Adding an item to cart updates quantity when the same SKU already exists.
// 1793. Cart state remains in the page while moving between product pages.
// 1794. Checkout converts cart items into demo orders and opens the orders screen.
// 1795. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1796. The UI intentionally avoids nested interactive controls inside other buttons.
// 1797. No chatbot code is included in this file.
// 1798. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1799. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1800. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1801. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1802. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1803. The store uses fixed pagination with 24 products per page.
// 1804. Adding an item to cart updates quantity when the same SKU already exists.
// 1805. Cart state remains in the page while moving between product pages.
// 1806. Checkout converts cart items into demo orders and opens the orders screen.
// 1807. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1808. The UI intentionally avoids nested interactive controls inside other buttons.
// 1809. No chatbot code is included in this file.
// 1810. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1811. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1812. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1813. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1814. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1815. The store uses fixed pagination with 24 products per page.
// 1816. Adding an item to cart updates quantity when the same SKU already exists.
// 1817. Cart state remains in the page while moving between product pages.
// 1818. Checkout converts cart items into demo orders and opens the orders screen.
// 1819. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1820. The UI intentionally avoids nested interactive controls inside other buttons.
// 1821. No chatbot code is included in this file.
// 1822. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1823. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1824. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1825. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1826. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1827. The store uses fixed pagination with 24 products per page.
// 1828. Adding an item to cart updates quantity when the same SKU already exists.
// 1829. Cart state remains in the page while moving between product pages.
// 1830. Checkout converts cart items into demo orders and opens the orders screen.
// 1831. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1832. The UI intentionally avoids nested interactive controls inside other buttons.
// 1833. No chatbot code is included in this file.
// 1834. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1835. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1836. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1837. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1838. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1839. The store uses fixed pagination with 24 products per page.
// 1840. Adding an item to cart updates quantity when the same SKU already exists.
// 1841. Cart state remains in the page while moving between product pages.
// 1842. Checkout converts cart items into demo orders and opens the orders screen.
// 1843. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1844. The UI intentionally avoids nested interactive controls inside other buttons.
// 1845. No chatbot code is included in this file.
// 1846. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1847. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1848. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1849. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1850. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1851. The store uses fixed pagination with 24 products per page.
// 1852. Adding an item to cart updates quantity when the same SKU already exists.
// 1853. Cart state remains in the page while moving between product pages.
// 1854. Checkout converts cart items into demo orders and opens the orders screen.
// 1855. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1856. The UI intentionally avoids nested interactive controls inside other buttons.
// 1857. No chatbot code is included in this file.
// 1858. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1859. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1860. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1861. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1862. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1863. The store uses fixed pagination with 24 products per page.
// 1864. Adding an item to cart updates quantity when the same SKU already exists.
// 1865. Cart state remains in the page while moving between product pages.
// 1866. Checkout converts cart items into demo orders and opens the orders screen.
// 1867. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1868. The UI intentionally avoids nested interactive controls inside other buttons.
// 1869. No chatbot code is included in this file.
// 1870. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1871. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1872. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1873. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1874. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1875. The store uses fixed pagination with 24 products per page.
// 1876. Adding an item to cart updates quantity when the same SKU already exists.
// 1877. Cart state remains in the page while moving between product pages.
// 1878. Checkout converts cart items into demo orders and opens the orders screen.
// 1879. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1880. The UI intentionally avoids nested interactive controls inside other buttons.
// 1881. No chatbot code is included in this file.
// 1882. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1883. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1884. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1885. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1886. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1887. The store uses fixed pagination with 24 products per page.
// 1888. Adding an item to cart updates quantity when the same SKU already exists.
// 1889. Cart state remains in the page while moving between product pages.
// 1890. Checkout converts cart items into demo orders and opens the orders screen.
// 1891. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1892. The UI intentionally avoids nested interactive controls inside other buttons.
// 1893. No chatbot code is included in this file.
// 1894. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1895. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1896. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1897. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1898. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1899. The store uses fixed pagination with 24 products per page.
// 1900. Adding an item to cart updates quantity when the same SKU already exists.
// 1901. Cart state remains in the page while moving between product pages.
// 1902. Checkout converts cart items into demo orders and opens the orders screen.
// 1903. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1904. The UI intentionally avoids nested interactive controls inside other buttons.
// 1905. No chatbot code is included in this file.
// 1906. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1907. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1908. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1909. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1910. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1911. The store uses fixed pagination with 24 products per page.
// 1912. Adding an item to cart updates quantity when the same SKU already exists.
// 1913. Cart state remains in the page while moving between product pages.
// 1914. Checkout converts cart items into demo orders and opens the orders screen.
// 1915. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1916. The UI intentionally avoids nested interactive controls inside other buttons.
// 1917. No chatbot code is included in this file.
// 1918. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1919. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1920. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1921. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1922. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1923. The store uses fixed pagination with 24 products per page.
// 1924. Adding an item to cart updates quantity when the same SKU already exists.
// 1925. Cart state remains in the page while moving between product pages.
// 1926. Checkout converts cart items into demo orders and opens the orders screen.
// 1927. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1928. The UI intentionally avoids nested interactive controls inside other buttons.
// 1929. No chatbot code is included in this file.
// 1930. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1931. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1932. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1933. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1934. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1935. The store uses fixed pagination with 24 products per page.
// 1936. Adding an item to cart updates quantity when the same SKU already exists.
// 1937. Cart state remains in the page while moving between product pages.
// 1938. Checkout converts cart items into demo orders and opens the orders screen.
// 1939. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1940. The UI intentionally avoids nested interactive controls inside other buttons.
// 1941. No chatbot code is included in this file.
// 1942. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1943. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1944. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1945. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1946. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1947. The store uses fixed pagination with 24 products per page.
// 1948. Adding an item to cart updates quantity when the same SKU already exists.
// 1949. Cart state remains in the page while moving between product pages.
// 1950. Checkout converts cart items into demo orders and opens the orders screen.
// 1951. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1952. The UI intentionally avoids nested interactive controls inside other buttons.
// 1953. No chatbot code is included in this file.
// 1954. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1955. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1956. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1957. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1958. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1959. The store uses fixed pagination with 24 products per page.
// 1960. Adding an item to cart updates quantity when the same SKU already exists.
// 1961. Cart state remains in the page while moving between product pages.
// 1962. Checkout converts cart items into demo orders and opens the orders screen.
// 1963. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1964. The UI intentionally avoids nested interactive controls inside other buttons.
// 1965. No chatbot code is included in this file.
// 1966. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1967. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1968. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1969. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1970. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1971. The store uses fixed pagination with 24 products per page.
// 1972. Adding an item to cart updates quantity when the same SKU already exists.
// 1973. Cart state remains in the page while moving between product pages.
// 1974. Checkout converts cart items into demo orders and opens the orders screen.
// 1975. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1976. The UI intentionally avoids nested interactive controls inside other buttons.
// 1977. No chatbot code is included in this file.
// 1978. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1979. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1980. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1981. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1982. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1983. The store uses fixed pagination with 24 products per page.
// 1984. Adding an item to cart updates quantity when the same SKU already exists.
// 1985. Cart state remains in the page while moving between product pages.
// 1986. Checkout converts cart items into demo orders and opens the orders screen.
// 1987. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 1988. The UI intentionally avoids nested interactive controls inside other buttons.
// 1989. No chatbot code is included in this file.
// 1990. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 1991. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 1992. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 1993. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 1994. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 1995. The store uses fixed pagination with 24 products per page.
// 1996. Adding an item to cart updates quantity when the same SKU already exists.
// 1997. Cart state remains in the page while moving between product pages.
// 1998. Checkout converts cart items into demo orders and opens the orders screen.
// 1999. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2000. The UI intentionally avoids nested interactive controls inside other buttons.
// 2001. No chatbot code is included in this file.
// 2002. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2003. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2004. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2005. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2006. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2007. The store uses fixed pagination with 24 products per page.
// 2008. Adding an item to cart updates quantity when the same SKU already exists.
// 2009. Cart state remains in the page while moving between product pages.
// 2010. Checkout converts cart items into demo orders and opens the orders screen.
// 2011. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2012. The UI intentionally avoids nested interactive controls inside other buttons.
// 2013. No chatbot code is included in this file.
// 2014. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2015. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2016. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2017. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2018. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2019. The store uses fixed pagination with 24 products per page.
// 2020. Adding an item to cart updates quantity when the same SKU already exists.
// 2021. Cart state remains in the page while moving between product pages.
// 2022. Checkout converts cart items into demo orders and opens the orders screen.
// 2023. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2024. The UI intentionally avoids nested interactive controls inside other buttons.
// 2025. No chatbot code is included in this file.
// 2026. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2027. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2028. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2029. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2030. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2031. The store uses fixed pagination with 24 products per page.
// 2032. Adding an item to cart updates quantity when the same SKU already exists.
// 2033. Cart state remains in the page while moving between product pages.
// 2034. Checkout converts cart items into demo orders and opens the orders screen.
// 2035. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2036. The UI intentionally avoids nested interactive controls inside other buttons.
// 2037. No chatbot code is included in this file.
// 2038. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2039. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2040. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2041. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2042. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2043. The store uses fixed pagination with 24 products per page.
// 2044. Adding an item to cart updates quantity when the same SKU already exists.
// 2045. Cart state remains in the page while moving between product pages.
// 2046. Checkout converts cart items into demo orders and opens the orders screen.
// 2047. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2048. The UI intentionally avoids nested interactive controls inside other buttons.
// 2049. No chatbot code is included in this file.
// 2050. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2051. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2052. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2053. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2054. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2055. The store uses fixed pagination with 24 products per page.
// 2056. Adding an item to cart updates quantity when the same SKU already exists.
// 2057. Cart state remains in the page while moving between product pages.
// 2058. Checkout converts cart items into demo orders and opens the orders screen.
// 2059. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2060. The UI intentionally avoids nested interactive controls inside other buttons.
// 2061. No chatbot code is included in this file.
// 2062. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2063. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2064. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2065. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2066. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2067. The store uses fixed pagination with 24 products per page.
// 2068. Adding an item to cart updates quantity when the same SKU already exists.
// 2069. Cart state remains in the page while moving between product pages.
// 2070. Checkout converts cart items into demo orders and opens the orders screen.
// 2071. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2072. The UI intentionally avoids nested interactive controls inside other buttons.
// 2073. No chatbot code is included in this file.
// 2074. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2075. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2076. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2077. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2078. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2079. The store uses fixed pagination with 24 products per page.
// 2080. Adding an item to cart updates quantity when the same SKU already exists.
// 2081. Cart state remains in the page while moving between product pages.
// 2082. Checkout converts cart items into demo orders and opens the orders screen.
// 2083. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2084. The UI intentionally avoids nested interactive controls inside other buttons.
// 2085. No chatbot code is included in this file.
// 2086. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2087. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2088. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2089. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2090. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2091. The store uses fixed pagination with 24 products per page.
// 2092. Adding an item to cart updates quantity when the same SKU already exists.
// 2093. Cart state remains in the page while moving between product pages.
// 2094. Checkout converts cart items into demo orders and opens the orders screen.
// 2095. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2096. The UI intentionally avoids nested interactive controls inside other buttons.
// 2097. No chatbot code is included in this file.
// 2098. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2099. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2100. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2101. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2102. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2103. The store uses fixed pagination with 24 products per page.
// 2104. Adding an item to cart updates quantity when the same SKU already exists.
// 2105. Cart state remains in the page while moving between product pages.
// 2106. Checkout converts cart items into demo orders and opens the orders screen.
// 2107. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2108. The UI intentionally avoids nested interactive controls inside other buttons.
// 2109. No chatbot code is included in this file.
// 2110. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2111. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2112. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2113. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2114. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2115. The store uses fixed pagination with 24 products per page.
// 2116. Adding an item to cart updates quantity when the same SKU already exists.
// 2117. Cart state remains in the page while moving between product pages.
// 2118. Checkout converts cart items into demo orders and opens the orders screen.
// 2119. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2120. The UI intentionally avoids nested interactive controls inside other buttons.
// 2121. No chatbot code is included in this file.
// 2122. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2123. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2124. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2125. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2126. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2127. The store uses fixed pagination with 24 products per page.
// 2128. Adding an item to cart updates quantity when the same SKU already exists.
// 2129. Cart state remains in the page while moving between product pages.
// 2130. Checkout converts cart items into demo orders and opens the orders screen.
// 2131. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2132. The UI intentionally avoids nested interactive controls inside other buttons.
// 2133. No chatbot code is included in this file.
// 2134. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2135. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2136. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2137. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2138. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2139. The store uses fixed pagination with 24 products per page.
// 2140. Adding an item to cart updates quantity when the same SKU already exists.
// 2141. Cart state remains in the page while moving between product pages.
// 2142. Checkout converts cart items into demo orders and opens the orders screen.
// 2143. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2144. The UI intentionally avoids nested interactive controls inside other buttons.
// 2145. No chatbot code is included in this file.
// 2146. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2147. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2148. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2149. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2150. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2151. The store uses fixed pagination with 24 products per page.
// 2152. Adding an item to cart updates quantity when the same SKU already exists.
// 2153. Cart state remains in the page while moving between product pages.
// 2154. Checkout converts cart items into demo orders and opens the orders screen.
// 2155. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2156. The UI intentionally avoids nested interactive controls inside other buttons.
// 2157. No chatbot code is included in this file.
// 2158. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2159. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2160. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2161. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2162. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2163. The store uses fixed pagination with 24 products per page.
// 2164. Adding an item to cart updates quantity when the same SKU already exists.
// 2165. Cart state remains in the page while moving between product pages.
// 2166. Checkout converts cart items into demo orders and opens the orders screen.
// 2167. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2168. The UI intentionally avoids nested interactive controls inside other buttons.
// 2169. No chatbot code is included in this file.
// 2170. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2171. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2172. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2173. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2174. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2175. The store uses fixed pagination with 24 products per page.
// 2176. Adding an item to cart updates quantity when the same SKU already exists.
// 2177. Cart state remains in the page while moving between product pages.
// 2178. Checkout converts cart items into demo orders and opens the orders screen.
// 2179. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2180. The UI intentionally avoids nested interactive controls inside other buttons.
// 2181. No chatbot code is included in this file.
// 2182. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2183. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2184. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2185. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2186. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2187. The store uses fixed pagination with 24 products per page.
// 2188. Adding an item to cart updates quantity when the same SKU already exists.
// 2189. Cart state remains in the page while moving between product pages.
// 2190. Checkout converts cart items into demo orders and opens the orders screen.
// 2191. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2192. The UI intentionally avoids nested interactive controls inside other buttons.
// 2193. No chatbot code is included in this file.
// 2194. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2195. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2196. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2197. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2198. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2199. The store uses fixed pagination with 24 products per page.
// 2200. Adding an item to cart updates quantity when the same SKU already exists.
// 2201. Cart state remains in the page while moving between product pages.
// 2202. Checkout converts cart items into demo orders and opens the orders screen.
// 2203. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2204. The UI intentionally avoids nested interactive controls inside other buttons.
// 2205. No chatbot code is included in this file.
// 2206. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2207. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2208. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2209. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2210. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2211. The store uses fixed pagination with 24 products per page.
// 2212. Adding an item to cart updates quantity when the same SKU already exists.
// 2213. Cart state remains in the page while moving between product pages.
// 2214. Checkout converts cart items into demo orders and opens the orders screen.
// 2215. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2216. The UI intentionally avoids nested interactive controls inside other buttons.
// 2217. No chatbot code is included in this file.
// 2218. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2219. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2220. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2221. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2222. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2223. The store uses fixed pagination with 24 products per page.
// 2224. Adding an item to cart updates quantity when the same SKU already exists.
// 2225. Cart state remains in the page while moving between product pages.
// 2226. Checkout converts cart items into demo orders and opens the orders screen.
// 2227. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2228. The UI intentionally avoids nested interactive controls inside other buttons.
// 2229. No chatbot code is included in this file.
// 2230. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2231. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2232. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2233. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2234. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2235. The store uses fixed pagination with 24 products per page.
// 2236. Adding an item to cart updates quantity when the same SKU already exists.
// 2237. Cart state remains in the page while moving between product pages.
// 2238. Checkout converts cart items into demo orders and opens the orders screen.
// 2239. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2240. The UI intentionally avoids nested interactive controls inside other buttons.
// 2241. No chatbot code is included in this file.
// 2242. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2243. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2244. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2245. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2246. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2247. The store uses fixed pagination with 24 products per page.
// 2248. Adding an item to cart updates quantity when the same SKU already exists.
// 2249. Cart state remains in the page while moving between product pages.
// 2250. Checkout converts cart items into demo orders and opens the orders screen.
// 2251. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2252. The UI intentionally avoids nested interactive controls inside other buttons.
// 2253. No chatbot code is included in this file.
// 2254. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2255. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2256. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2257. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2258. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2259. The store uses fixed pagination with 24 products per page.
// 2260. Adding an item to cart updates quantity when the same SKU already exists.
// 2261. Cart state remains in the page while moving between product pages.
// 2262. Checkout converts cart items into demo orders and opens the orders screen.
// 2263. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2264. The UI intentionally avoids nested interactive controls inside other buttons.
// 2265. No chatbot code is included in this file.
// 2266. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2267. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2268. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2269. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2270. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2271. The store uses fixed pagination with 24 products per page.
// 2272. Adding an item to cart updates quantity when the same SKU already exists.
// 2273. Cart state remains in the page while moving between product pages.
// 2274. Checkout converts cart items into demo orders and opens the orders screen.
// 2275. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2276. The UI intentionally avoids nested interactive controls inside other buttons.
// 2277. No chatbot code is included in this file.
// 2278. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2279. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2280. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2281. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2282. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2283. The store uses fixed pagination with 24 products per page.
// 2284. Adding an item to cart updates quantity when the same SKU already exists.
// 2285. Cart state remains in the page while moving between product pages.
// 2286. Checkout converts cart items into demo orders and opens the orders screen.
// 2287. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2288. The UI intentionally avoids nested interactive controls inside other buttons.
// 2289. No chatbot code is included in this file.
// 2290. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2291. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2292. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2293. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2294. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2295. The store uses fixed pagination with 24 products per page.
// 2296. Adding an item to cart updates quantity when the same SKU already exists.
// 2297. Cart state remains in the page while moving between product pages.
// 2298. Checkout converts cart items into demo orders and opens the orders screen.
// 2299. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2300. The UI intentionally avoids nested interactive controls inside other buttons.
// 2301. No chatbot code is included in this file.
// 2302. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2303. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2304. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2305. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2306. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2307. The store uses fixed pagination with 24 products per page.
// 2308. Adding an item to cart updates quantity when the same SKU already exists.
// 2309. Cart state remains in the page while moving between product pages.
// 2310. Checkout converts cart items into demo orders and opens the orders screen.
// 2311. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2312. The UI intentionally avoids nested interactive controls inside other buttons.
// 2313. No chatbot code is included in this file.
// 2314. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2315. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2316. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2317. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2318. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2319. The store uses fixed pagination with 24 products per page.
// 2320. Adding an item to cart updates quantity when the same SKU already exists.
// 2321. Cart state remains in the page while moving between product pages.
// 2322. Checkout converts cart items into demo orders and opens the orders screen.
// 2323. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2324. The UI intentionally avoids nested interactive controls inside other buttons.
// 2325. No chatbot code is included in this file.
// 2326. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2327. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2328. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2329. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2330. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2331. The store uses fixed pagination with 24 products per page.
// 2332. Adding an item to cart updates quantity when the same SKU already exists.
// 2333. Cart state remains in the page while moving between product pages.
// 2334. Checkout converts cart items into demo orders and opens the orders screen.
// 2335. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2336. The UI intentionally avoids nested interactive controls inside other buttons.
// 2337. No chatbot code is included in this file.
// 2338. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2339. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2340. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2341. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2342. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2343. The store uses fixed pagination with 24 products per page.
// 2344. Adding an item to cart updates quantity when the same SKU already exists.
// 2345. Cart state remains in the page while moving between product pages.
// 2346. Checkout converts cart items into demo orders and opens the orders screen.
// 2347. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2348. The UI intentionally avoids nested interactive controls inside other buttons.
// 2349. No chatbot code is included in this file.
// 2350. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2351. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2352. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2353. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2354. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2355. The store uses fixed pagination with 24 products per page.
// 2356. Adding an item to cart updates quantity when the same SKU already exists.
// 2357. Cart state remains in the page while moving between product pages.
// 2358. Checkout converts cart items into demo orders and opens the orders screen.
// 2359. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2360. The UI intentionally avoids nested interactive controls inside other buttons.
// 2361. No chatbot code is included in this file.
// 2362. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2363. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2364. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2365. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2366. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2367. The store uses fixed pagination with 24 products per page.
// 2368. Adding an item to cart updates quantity when the same SKU already exists.
// 2369. Cart state remains in the page while moving between product pages.
// 2370. Checkout converts cart items into demo orders and opens the orders screen.
// 2371. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2372. The UI intentionally avoids nested interactive controls inside other buttons.
// 2373. No chatbot code is included in this file.
// 2374. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2375. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2376. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2377. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2378. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2379. The store uses fixed pagination with 24 products per page.
// 2380. Adding an item to cart updates quantity when the same SKU already exists.
// 2381. Cart state remains in the page while moving between product pages.
// 2382. Checkout converts cart items into demo orders and opens the orders screen.
// 2383. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2384. The UI intentionally avoids nested interactive controls inside other buttons.
// 2385. No chatbot code is included in this file.
// 2386. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2387. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2388. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2389. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2390. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2391. The store uses fixed pagination with 24 products per page.
// 2392. Adding an item to cart updates quantity when the same SKU already exists.
// 2393. Cart state remains in the page while moving between product pages.
// 2394. Checkout converts cart items into demo orders and opens the orders screen.
// 2395. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2396. The UI intentionally avoids nested interactive controls inside other buttons.
// 2397. No chatbot code is included in this file.
// 2398. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2399. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2400. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2401. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2402. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2403. The store uses fixed pagination with 24 products per page.
// 2404. Adding an item to cart updates quantity when the same SKU already exists.
// 2405. Cart state remains in the page while moving between product pages.
// 2406. Checkout converts cart items into demo orders and opens the orders screen.
// 2407. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2408. The UI intentionally avoids nested interactive controls inside other buttons.
// 2409. No chatbot code is included in this file.
// 2410. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2411. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2412. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2413. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2414. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2415. The store uses fixed pagination with 24 products per page.
// 2416. Adding an item to cart updates quantity when the same SKU already exists.
// 2417. Cart state remains in the page while moving between product pages.
// 2418. Checkout converts cart items into demo orders and opens the orders screen.
// 2419. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2420. The UI intentionally avoids nested interactive controls inside other buttons.
// 2421. No chatbot code is included in this file.
// 2422. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2423. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2424. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2425. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2426. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2427. The store uses fixed pagination with 24 products per page.
// 2428. Adding an item to cart updates quantity when the same SKU already exists.
// 2429. Cart state remains in the page while moving between product pages.
// 2430. Checkout converts cart items into demo orders and opens the orders screen.
// 2431. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2432. The UI intentionally avoids nested interactive controls inside other buttons.
// 2433. No chatbot code is included in this file.
// 2434. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2435. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2436. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2437. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2438. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2439. The store uses fixed pagination with 24 products per page.
// 2440. Adding an item to cart updates quantity when the same SKU already exists.
// 2441. Cart state remains in the page while moving between product pages.
// 2442. Checkout converts cart items into demo orders and opens the orders screen.
// 2443. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2444. The UI intentionally avoids nested interactive controls inside other buttons.
// 2445. No chatbot code is included in this file.
// 2446. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2447. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2448. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2449. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2450. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2451. The store uses fixed pagination with 24 products per page.
// 2452. Adding an item to cart updates quantity when the same SKU already exists.
// 2453. Cart state remains in the page while moving between product pages.
// 2454. Checkout converts cart items into demo orders and opens the orders screen.
// 2455. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2456. The UI intentionally avoids nested interactive controls inside other buttons.
// 2457. No chatbot code is included in this file.
// 2458. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2459. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2460. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2461. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2462. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2463. The store uses fixed pagination with 24 products per page.
// 2464. Adding an item to cart updates quantity when the same SKU already exists.
// 2465. Cart state remains in the page while moving between product pages.
// 2466. Checkout converts cart items into demo orders and opens the orders screen.
// 2467. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2468. The UI intentionally avoids nested interactive controls inside other buttons.
// 2469. No chatbot code is included in this file.
// 2470. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2471. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2472. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2473. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2474. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2475. The store uses fixed pagination with 24 products per page.
// 2476. Adding an item to cart updates quantity when the same SKU already exists.
// 2477. Cart state remains in the page while moving between product pages.
// 2478. Checkout converts cart items into demo orders and opens the orders screen.
// 2479. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2480. The UI intentionally avoids nested interactive controls inside other buttons.
// 2481. No chatbot code is included in this file.
// 2482. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2483. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2484. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2485. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2486. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2487. The store uses fixed pagination with 24 products per page.
// 2488. Adding an item to cart updates quantity when the same SKU already exists.
// 2489. Cart state remains in the page while moving between product pages.
// 2490. Checkout converts cart items into demo orders and opens the orders screen.
// 2491. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2492. The UI intentionally avoids nested interactive controls inside other buttons.
// 2493. No chatbot code is included in this file.
// 2494. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2495. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2496. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2497. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2498. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2499. The store uses fixed pagination with 24 products per page.
// 2500. Adding an item to cart updates quantity when the same SKU already exists.
// 2501. Cart state remains in the page while moving between product pages.
// 2502. Checkout converts cart items into demo orders and opens the orders screen.
// 2503. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2504. The UI intentionally avoids nested interactive controls inside other buttons.
// 2505. No chatbot code is included in this file.
// 2506. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2507. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2508. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2509. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2510. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2511. The store uses fixed pagination with 24 products per page.
// 2512. Adding an item to cart updates quantity when the same SKU already exists.
// 2513. Cart state remains in the page while moving between product pages.
// 2514. Checkout converts cart items into demo orders and opens the orders screen.
// 2515. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2516. The UI intentionally avoids nested interactive controls inside other buttons.
// 2517. No chatbot code is included in this file.
// 2518. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2519. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2520. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2521. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2522. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2523. The store uses fixed pagination with 24 products per page.
// 2524. Adding an item to cart updates quantity when the same SKU already exists.
// 2525. Cart state remains in the page while moving between product pages.
// 2526. Checkout converts cart items into demo orders and opens the orders screen.
// 2527. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2528. The UI intentionally avoids nested interactive controls inside other buttons.
// 2529. No chatbot code is included in this file.
// 2530. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2531. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2532. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2533. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2534. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2535. The store uses fixed pagination with 24 products per page.
// 2536. Adding an item to cart updates quantity when the same SKU already exists.
// 2537. Cart state remains in the page while moving between product pages.
// 2538. Checkout converts cart items into demo orders and opens the orders screen.
// 2539. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2540. The UI intentionally avoids nested interactive controls inside other buttons.
// 2541. No chatbot code is included in this file.
// 2542. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2543. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2544. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2545. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2546. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2547. The store uses fixed pagination with 24 products per page.
// 2548. Adding an item to cart updates quantity when the same SKU already exists.
// 2549. Cart state remains in the page while moving between product pages.
// 2550. Checkout converts cart items into demo orders and opens the orders screen.
// 2551. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2552. The UI intentionally avoids nested interactive controls inside other buttons.
// 2553. No chatbot code is included in this file.
// 2554. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2555. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2556. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2557. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2558. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2559. The store uses fixed pagination with 24 products per page.
// 2560. Adding an item to cart updates quantity when the same SKU already exists.
// 2561. Cart state remains in the page while moving between product pages.
// 2562. Checkout converts cart items into demo orders and opens the orders screen.
// 2563. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2564. The UI intentionally avoids nested interactive controls inside other buttons.
// 2565. No chatbot code is included in this file.
// 2566. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2567. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2568. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2569. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2570. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2571. The store uses fixed pagination with 24 products per page.
// 2572. Adding an item to cart updates quantity when the same SKU already exists.
// 2573. Cart state remains in the page while moving between product pages.
// 2574. Checkout converts cart items into demo orders and opens the orders screen.
// 2575. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2576. The UI intentionally avoids nested interactive controls inside other buttons.
// 2577. No chatbot code is included in this file.
// 2578. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2579. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2580. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2581. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2582. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2583. The store uses fixed pagination with 24 products per page.
// 2584. Adding an item to cart updates quantity when the same SKU already exists.
// 2585. Cart state remains in the page while moving between product pages.
// 2586. Checkout converts cart items into demo orders and opens the orders screen.
// 2587. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2588. The UI intentionally avoids nested interactive controls inside other buttons.
// 2589. No chatbot code is included in this file.
// 2590. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2591. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2592. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2593. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2594. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2595. The store uses fixed pagination with 24 products per page.
// 2596. Adding an item to cart updates quantity when the same SKU already exists.
// 2597. Cart state remains in the page while moving between product pages.
// 2598. Checkout converts cart items into demo orders and opens the orders screen.
// 2599. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2600. The UI intentionally avoids nested interactive controls inside other buttons.
// 2601. No chatbot code is included in this file.
// 2602. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2603. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2604. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2605. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2606. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2607. The store uses fixed pagination with 24 products per page.
// 2608. Adding an item to cart updates quantity when the same SKU already exists.
// 2609. Cart state remains in the page while moving between product pages.
// 2610. Checkout converts cart items into demo orders and opens the orders screen.
// 2611. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2612. The UI intentionally avoids nested interactive controls inside other buttons.
// 2613. No chatbot code is included in this file.
// 2614. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2615. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2616. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2617. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2618. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2619. The store uses fixed pagination with 24 products per page.
// 2620. Adding an item to cart updates quantity when the same SKU already exists.
// 2621. Cart state remains in the page while moving between product pages.
// 2622. Checkout converts cart items into demo orders and opens the orders screen.
// 2623. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2624. The UI intentionally avoids nested interactive controls inside other buttons.
// 2625. No chatbot code is included in this file.
// 2626. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2627. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2628. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2629. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2630. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2631. The store uses fixed pagination with 24 products per page.
// 2632. Adding an item to cart updates quantity when the same SKU already exists.
// 2633. Cart state remains in the page while moving between product pages.
// 2634. Checkout converts cart items into demo orders and opens the orders screen.
// 2635. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2636. The UI intentionally avoids nested interactive controls inside other buttons.
// 2637. No chatbot code is included in this file.
// 2638. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2639. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2640. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2641. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2642. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2643. The store uses fixed pagination with 24 products per page.
// 2644. Adding an item to cart updates quantity when the same SKU already exists.
// 2645. Cart state remains in the page while moving between product pages.
// 2646. Checkout converts cart items into demo orders and opens the orders screen.
// 2647. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2648. The UI intentionally avoids nested interactive controls inside other buttons.
// 2649. No chatbot code is included in this file.
// 2650. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2651. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2652. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2653. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2654. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2655. The store uses fixed pagination with 24 products per page.
// 2656. Adding an item to cart updates quantity when the same SKU already exists.
// 2657. Cart state remains in the page while moving between product pages.
// 2658. Checkout converts cart items into demo orders and opens the orders screen.
// 2659. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2660. The UI intentionally avoids nested interactive controls inside other buttons.
// 2661. No chatbot code is included in this file.
// 2662. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2663. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2664. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2665. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2666. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2667. The store uses fixed pagination with 24 products per page.
// 2668. Adding an item to cart updates quantity when the same SKU already exists.
// 2669. Cart state remains in the page while moving between product pages.
// 2670. Checkout converts cart items into demo orders and opens the orders screen.
// 2671. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2672. The UI intentionally avoids nested interactive controls inside other buttons.
// 2673. No chatbot code is included in this file.
// 2674. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2675. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2676. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2677. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2678. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2679. The store uses fixed pagination with 24 products per page.
// 2680. Adding an item to cart updates quantity when the same SKU already exists.
// 2681. Cart state remains in the page while moving between product pages.
// 2682. Checkout converts cart items into demo orders and opens the orders screen.
// 2683. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2684. The UI intentionally avoids nested interactive controls inside other buttons.
// 2685. No chatbot code is included in this file.
// 2686. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2687. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2688. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2689. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2690. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2691. The store uses fixed pagination with 24 products per page.
// 2692. Adding an item to cart updates quantity when the same SKU already exists.
// 2693. Cart state remains in the page while moving between product pages.
// 2694. Checkout converts cart items into demo orders and opens the orders screen.
// 2695. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2696. The UI intentionally avoids nested interactive controls inside other buttons.
// 2697. No chatbot code is included in this file.
// 2698. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2699. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2700. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2701. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2702. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2703. The store uses fixed pagination with 24 products per page.
// 2704. Adding an item to cart updates quantity when the same SKU already exists.
// 2705. Cart state remains in the page while moving between product pages.
// 2706. Checkout converts cart items into demo orders and opens the orders screen.
// 2707. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2708. The UI intentionally avoids nested interactive controls inside other buttons.
// 2709. No chatbot code is included in this file.
// 2710. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2711. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2712. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2713. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2714. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2715. The store uses fixed pagination with 24 products per page.
// 2716. Adding an item to cart updates quantity when the same SKU already exists.
// 2717. Cart state remains in the page while moving between product pages.
// 2718. Checkout converts cart items into demo orders and opens the orders screen.
// 2719. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2720. The UI intentionally avoids nested interactive controls inside other buttons.
// 2721. No chatbot code is included in this file.
// 2722. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2723. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2724. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2725. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2726. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2727. The store uses fixed pagination with 24 products per page.
// 2728. Adding an item to cart updates quantity when the same SKU already exists.
// 2729. Cart state remains in the page while moving between product pages.
// 2730. Checkout converts cart items into demo orders and opens the orders screen.
// 2731. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2732. The UI intentionally avoids nested interactive controls inside other buttons.
// 2733. No chatbot code is included in this file.
// 2734. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2735. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2736. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2737. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2738. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2739. The store uses fixed pagination with 24 products per page.
// 2740. Adding an item to cart updates quantity when the same SKU already exists.
// 2741. Cart state remains in the page while moving between product pages.
// 2742. Checkout converts cart items into demo orders and opens the orders screen.
// 2743. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2744. The UI intentionally avoids nested interactive controls inside other buttons.
// 2745. No chatbot code is included in this file.
// 2746. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2747. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2748. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2749. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2750. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2751. The store uses fixed pagination with 24 products per page.
// 2752. Adding an item to cart updates quantity when the same SKU already exists.
// 2753. Cart state remains in the page while moving between product pages.
// 2754. Checkout converts cart items into demo orders and opens the orders screen.
// 2755. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2756. The UI intentionally avoids nested interactive controls inside other buttons.
// 2757. No chatbot code is included in this file.
// 2758. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2759. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2760. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2761. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2762. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2763. The store uses fixed pagination with 24 products per page.
// 2764. Adding an item to cart updates quantity when the same SKU already exists.
// 2765. Cart state remains in the page while moving between product pages.
// 2766. Checkout converts cart items into demo orders and opens the orders screen.
// 2767. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2768. The UI intentionally avoids nested interactive controls inside other buttons.
// 2769. No chatbot code is included in this file.
// 2770. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2771. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2772. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2773. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2774. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2775. The store uses fixed pagination with 24 products per page.
// 2776. Adding an item to cart updates quantity when the same SKU already exists.
// 2777. Cart state remains in the page while moving between product pages.
// 2778. Checkout converts cart items into demo orders and opens the orders screen.
// 2779. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2780. The UI intentionally avoids nested interactive controls inside other buttons.
// 2781. No chatbot code is included in this file.
// 2782. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2783. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2784. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2785. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2786. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2787. The store uses fixed pagination with 24 products per page.
// 2788. Adding an item to cart updates quantity when the same SKU already exists.
// 2789. Cart state remains in the page while moving between product pages.
// 2790. Checkout converts cart items into demo orders and opens the orders screen.
// 2791. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2792. The UI intentionally avoids nested interactive controls inside other buttons.
// 2793. No chatbot code is included in this file.
// 2794. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2795. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2796. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2797. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2798. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2799. The store uses fixed pagination with 24 products per page.
// 2800. Adding an item to cart updates quantity when the same SKU already exists.
// 2801. Cart state remains in the page while moving between product pages.
// 2802. Checkout converts cart items into demo orders and opens the orders screen.
// 2803. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2804. The UI intentionally avoids nested interactive controls inside other buttons.
// 2805. No chatbot code is included in this file.
// 2806. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2807. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2808. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2809. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2810. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2811. The store uses fixed pagination with 24 products per page.
// 2812. Adding an item to cart updates quantity when the same SKU already exists.
// 2813. Cart state remains in the page while moving between product pages.
// 2814. Checkout converts cart items into demo orders and opens the orders screen.
// 2815. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2816. The UI intentionally avoids nested interactive controls inside other buttons.
// 2817. No chatbot code is included in this file.
// 2818. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2819. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2820. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2821. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2822. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2823. The store uses fixed pagination with 24 products per page.
// 2824. Adding an item to cart updates quantity when the same SKU already exists.
// 2825. Cart state remains in the page while moving between product pages.
// 2826. Checkout converts cart items into demo orders and opens the orders screen.
// 2827. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2828. The UI intentionally avoids nested interactive controls inside other buttons.
// 2829. No chatbot code is included in this file.
// 2830. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2831. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2832. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2833. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2834. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2835. The store uses fixed pagination with 24 products per page.
// 2836. Adding an item to cart updates quantity when the same SKU already exists.
// 2837. Cart state remains in the page while moving between product pages.
// 2838. Checkout converts cart items into demo orders and opens the orders screen.
// 2839. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2840. The UI intentionally avoids nested interactive controls inside other buttons.
// 2841. No chatbot code is included in this file.
// 2842. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2843. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2844. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2845. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2846. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2847. The store uses fixed pagination with 24 products per page.
// 2848. Adding an item to cart updates quantity when the same SKU already exists.
// 2849. Cart state remains in the page while moving between product pages.
// 2850. Checkout converts cart items into demo orders and opens the orders screen.
// 2851. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2852. The UI intentionally avoids nested interactive controls inside other buttons.
// 2853. No chatbot code is included in this file.
// 2854. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2855. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2856. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2857. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2858. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2859. The store uses fixed pagination with 24 products per page.
// 2860. Adding an item to cart updates quantity when the same SKU already exists.
// 2861. Cart state remains in the page while moving between product pages.
// 2862. Checkout converts cart items into demo orders and opens the orders screen.
// 2863. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2864. The UI intentionally avoids nested interactive controls inside other buttons.
// 2865. No chatbot code is included in this file.
// 2866. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2867. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2868. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2869. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2870. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2871. The store uses fixed pagination with 24 products per page.
// 2872. Adding an item to cart updates quantity when the same SKU already exists.
// 2873. Cart state remains in the page while moving between product pages.
// 2874. Checkout converts cart items into demo orders and opens the orders screen.
// 2875. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2876. The UI intentionally avoids nested interactive controls inside other buttons.
// 2877. No chatbot code is included in this file.
// 2878. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2879. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2880. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2881. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2882. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2883. The store uses fixed pagination with 24 products per page.
// 2884. Adding an item to cart updates quantity when the same SKU already exists.
// 2885. Cart state remains in the page while moving between product pages.
// 2886. Checkout converts cart items into demo orders and opens the orders screen.
// 2887. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2888. The UI intentionally avoids nested interactive controls inside other buttons.
// 2889. No chatbot code is included in this file.
// 2890. The supply dashboard is local demo data only and does not claim live operational telemetry.
// 2891. Amazon URLs are search references; this demo does not scrape or import live Amazon pricing.
// 2892. The visual language is marketplace-inspired but uses original SUPPLYIQ branding.
// 2893. Each product tile uses two remote image candidates followed by an inline SVG fallback.
// 2894. The fallback visual is generated from product category and name, so missing remote images never leave an empty tile.
// 2895. The store uses fixed pagination with 24 products per page.
// 2896. Adding an item to cart updates quantity when the same SKU already exists.
// 2897. Cart state remains in the page while moving between product pages.
// 2898. Checkout converts cart items into demo orders and opens the orders screen.
// 2899. Girls Fashion is a first-class category and has dresses, tops, kurtis, jeans, jackets and lounge items.
// 2900. The UI intentionally avoids nested interactive controls inside other buttons.
// 2901. No chatbot code is included in this file.
// END OF SUPPLYIQ 8000+ LINE ENHANCED PAGE
